/**
 * Synchronizace dat filiálek a logistických center z externího .xlsx souboru.
 *
 * Postup: najde nejnovější .xlsx v zadané Drive složce → otevře jako Spreadsheet
 * → přečte listy dle konfigurace → porovná s DB → provede INSERT/UPDATE/deaktivaci.
 */

const STORES_COL_MAP = {
  'Č.prodejny':       'code',
  'Název':            'name',
  'LC':               'lc_code',
  'Telefon prodejny': 'phone',
  'VT':               'area_manager',
  'RM':               'regional_manager',
  'Telefon RM':       'rm_phone',
  'Pondělí otevřeno': 'mon_open',
  'Pondělí zavřeno':  'mon_close',
  'Úterý otevřeno':   'tue_open',
  'Úterý zavřeno':    'tue_close',
  'Středa otevřeno':  'wed_open',
  'Středa zavřeno':   'wed_close',
  'Čtvrtek otevřeno': 'thu_open',
  'Čtvrtek zavřeno':  'thu_close',
  'Pátek otevřeno':   'fri_open',
  'Pátek zavřeno':    'fri_close',
  'Sobota otevřeno':  'sat_open',
  'Sobota zavřeno':   'sat_close',
  'Neděle otevřeno':  'sun_open',
  'Neděle zavřeno':   'sun_close',
};

const LOGISTICS_COL_MAP = {
  'Číslo LC': 'code',
  'Název LC': 'name',
  'Zkratka':  'abbreviation',
};

/* ── Veřejné API ──────────────────────────────────────────────── */

function apiRunSync() {
  return guard_(ROLES.ADMIN, () => {
    const settings = settingsAll_();
    const folderUrl = settings.syncFolderUrl || '';
    if (!folderUrl) throw new Error('Není nastavena URL složky. Vyplňte ji v sekci Synchronizace.');

    const folderId = extractFolderIdFromUrl_(folderUrl);
    if (!folderId) throw new Error('Z URL složky se nepodařilo rozpoznat ID. Použijte URL ve tvaru https://drive.google.com/drive/folders/...');

    const xlsxFile = findXlsxInFolder_(folderId);
    if (!xlsxFile) throw new Error('Ve složce nebyl nalezen žádný soubor .xlsx.');

    let ss;
    let tempSheetId = null;
    try {
      const copy = Drive.Files.copy(
        { name: '__sync_tmp__', mimeType: 'application/vnd.google-apps.spreadsheet' },
        xlsxFile.getId()
      );
      tempSheetId = copy.id;
      ss = SpreadsheetApp.openById(tempSheetId);
    } catch (e) {
      throw new Error('Nepodařilo se převést soubor "' + xlsxFile.getName() + '" na Google Sheet: ' + e.message);
    }

    let result;
    try {
      result = {
        fileName: xlsxFile.getName(),
        stores: syncStores_(ss, settings),
        logistics: syncLogistics_(ss, settings),
      };
    } finally {
      if (tempSheetId) {
        try { Drive.Files.remove(tempSheetId); } catch (_) {}
      }
    }

    settingsSet_('lastSyncAt', nowIso_());
    settingsSet_('lastSyncResult', JSON.stringify(result));
    audit_('sync_run',
      'Soubor: ' + result.fileName +
      ' | Filiálky: +' + result.stores.added + ' u' + result.stores.updated + ' d' + result.stores.deactivated +
      ' | LC: +' + result.logistics.added + ' u' + result.logistics.updated + ' d' + result.logistics.deactivated
    );
    return result;
  });
}

/* ── Interní funkce ───────────────────────────────────────────── */

function syncStores_(ss, settings) {
  const mainSheetName = settings.syncStoresSheet || 'VTBZL_export';
  const tempPrefix    = settings.syncTempClosedPrefix || 'Dočasné zavření';

  const sheet1 = ss.getSheetByName(mainSheetName);
  if (!sheet1) throw new Error('List "' + mainSheetName + '" nebyl v souboru nalezen.');

  const sheet2 = ss.getSheets().find((s) => s.getName().startsWith(tempPrefix)) || null;

  const mainRows = parseSheetRows_(sheet1, STORES_COL_MAP);
  const tempRows = sheet2 ? parseSheetRows_(sheet2, STORES_COL_MAP) : [];

  // Mapa: code → data (hlavní list je autoritativní zdroj dat)
  const xlsxMap = new Map(mainRows.map((r) => [r.code, r]));
  const tempCodes = new Set(tempRows.map((r) => r.code));

  // Filiálky jen na listu "Dočasné zavření" (nejsou v hlavním listu)
  tempRows.forEach((r) => { if (!xlsxMap.has(r.code)) xlsxMap.set(r.code, r); });

  const currentRecords = dbGetAll_(SHEETS.STORES);
  const currentMap = new Map(currentRecords.map((r) => [r.code, r]));

  const stats = { added: 0, updated: 0, deactivated: 0, reactivated: 0, unchanged: 0, errors: [] };
  const now = nowIso_();
  const newRecords = [];

  // Zpracování stávajících DB záznamů
  currentRecords.forEach((existing) => {
    if (!xlsxMap.has(existing.code)) {
      if (existing.active === true) {
        newRecords.push(Object.assign({}, existing, { active: false, updated_at: now }));
        stats.deactivated++;
      } else {
        newRecords.push(existing);
        stats.unchanged++;
      }
    } else {
      const xlsxRow = xlsxMap.get(existing.code);
      const tempClosed = tempCodes.has(existing.code);
      const patch = buildStorePatch_(xlsxRow, tempClosed, now);

      const changed = storeDiffers_(existing, patch);
      const wasInactive = existing.active !== true;

      if (changed || wasInactive) {
        newRecords.push(Object.assign({}, existing, patch));
        if (wasInactive) stats.reactivated++;
        else stats.updated++;
      } else {
        newRecords.push(existing);
        stats.unchanged++;
      }
      xlsxMap.delete(existing.code);
    }
  });

  // Nové záznamy z xlsx (nezpracované = nebyly v DB)
  xlsxMap.forEach((xlsxRow, code) => {
    const tempClosed = tempCodes.has(code);
    newRecords.push(Object.assign(buildStorePatch_(xlsxRow, tempClosed, now), {
      id: uuid_(),
      created_at: now,
      created_by: currentEmail_() || 'sync',
      synced_at: now,
    }));
    stats.added++;
  });

  dbBatchReplace_(SHEETS.STORES, newRecords);
  return stats;
}

function syncLogistics_(ss, settings) {
  const sheetName = settings.syncLogisticsSheet || 'LC';
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return { added: 0, updated: 0, deactivated: 0, reactivated: 0, unchanged: 0,
             errors: ['List "' + sheetName + '" nebyl v souboru nalezen.'] };
  }

  const xlsxRows = parseSheetRows_(sheet, LOGISTICS_COL_MAP);
  const xlsxMap = new Map(xlsxRows.map((r) => [r.abbreviation.toUpperCase(), r]));

  const currentRecords = dbGetAll_(SHEETS.LOGISTICS);
  const stats = { added: 0, updated: 0, deactivated: 0, reactivated: 0, unchanged: 0, errors: [] };
  const now = nowIso_();
  const newRecords = [];

  currentRecords.forEach((existing) => {
    const key = String(existing.abbreviation || '').toUpperCase();
    if (!xlsxMap.has(key)) {
      if (existing.active === true) {
        newRecords.push(Object.assign({}, existing, { active: false, updated_at: now }));
        stats.deactivated++;
      } else {
        newRecords.push(existing);
        stats.unchanged++;
      }
    } else {
      const xlsxRow = xlsxMap.get(key);
      const patch = { code: String(xlsxRow.code || '').trim(), name: String(xlsxRow.name || '').trim(),
                      abbreviation: key, active: true, synced_at: now, updated_at: now };
      const changed = String(existing.code) !== patch.code || existing.name !== patch.name;
      const wasInactive = existing.active !== true;
      if (changed || wasInactive) {
        newRecords.push(Object.assign({}, existing, patch));
        if (wasInactive) stats.reactivated++;
        else stats.updated++;
      } else {
        newRecords.push(existing);
        stats.unchanged++;
      }
      xlsxMap.delete(key);
    }
  });

  xlsxMap.forEach((xlsxRow, key) => {
    newRecords.push({
      id: uuid_(),
      code: String(xlsxRow.code || '').trim(),
      name: String(xlsxRow.name || '').trim(),
      abbreviation: key,
      active: true,
      synced_at: now,
      created_at: now,
      created_by: currentEmail_() || 'sync',
      updated_at: now,
    });
    stats.added++;
  });

  dbBatchReplace_(SHEETS.LOGISTICS, newRecords);
  return stats;
}

/* ── Pomocné funkce ───────────────────────────────────────────── */

function buildStorePatch_(xlsxRow, temporarilyClosed, now) {
  const FIELDS = [
    'code','name','lc_code','phone','area_manager','regional_manager','rm_phone',
    'mon_open','mon_close','tue_open','tue_close','wed_open','wed_close',
    'thu_open','thu_close','fri_open','fri_close','sat_open','sat_close','sun_open','sun_close',
  ];
  const patch = { temporarily_closed: temporarilyClosed, active: true, synced_at: now, updated_at: now };
  FIELDS.forEach((f) => { patch[f] = xlsxRow[f] !== undefined ? xlsxRow[f] : ''; });
  return patch;
}

function storeDiffers_(existing, patch) {
  const CHECK = [
    'name','lc_code','phone','area_manager','regional_manager','rm_phone',
    'mon_open','mon_close','tue_open','tue_close','wed_open','wed_close',
    'thu_open','thu_close','fri_open','fri_close','sat_open','sat_close','sun_open','sun_close',
    'temporarily_closed',
  ];
  return CHECK.some((f) => String(existing[f] || '') !== String(patch[f] || ''));
}

/**
 * Přečte list tabulky a vrátí pole objektů namapovaných přes colMap.
 * Záhlaví je na řádku 1 (trimované). Prázdné řádky (bez code) jsou přeskočeny.
 */
function parseSheetRows_(sheet, colMap) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const lastCol = sheet.getLastColumn();
  const rawHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const headers = rawHeaders.map((h) => String(h).trim());

  // Index každého cílového pole
  const colIndices = {};
  Object.keys(colMap).forEach((xlsxHeader) => {
    const idx = headers.indexOf(xlsxHeader);
    if (idx !== -1) colIndices[colMap[xlsxHeader]] = idx;
  });

  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  return data
    .map((row) => {
      const record = {};
      Object.keys(colIndices).forEach((dbField) => {
        const val = row[colIndices[dbField]];
        record[dbField] = (val !== undefined && val !== null) ? String(val).trim() : '';
      });
      return record;
    })
    .filter((r) => r.code);  // přeskočit řádky bez kódu
}

/** Extrahuje ID složky z Google Drive URL. */
function extractFolderIdFromUrl_(url) {
  const match = String(url).match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/** Vrátí nejnovější .xlsx soubor ve složce nebo null. */
function findXlsxInFolder_(folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByType(MimeType.MICROSOFT_EXCEL);
    let newest = null;
    let newestDate = null;
    while (files.hasNext()) {
      const file = files.next();
      const date = file.getLastUpdated();
      if (!newestDate || date > newestDate) { newest = file; newestDate = date; }
    }
    return newest;
  } catch (e) {
    throw new Error('Nepodařilo se otevřít složku: ' + e.message);
  }
}
