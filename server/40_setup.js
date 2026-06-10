/**
 * Inicializace aplikace — backend úvodního průvodce.
 *
 * První spuštění: doGet() zjistí, že chybí DB_SPREADSHEET_ID, a místo
 * aplikace vyrenderuje wizard. Ten smí dokončit pouze vlastník skriptu;
 * stane se superadminem a v jeho složce (tam, kde leží skript) vznikne
 * DB spreadsheet.
 */
function isSetupDone_() {
  return !!PropertiesService.getScriptProperties().getProperty(PROPS.DB_ID);
}

/** Složka v Drive, ve které leží tento skript, nebo null (root / bez přístupu). */
function scriptFolder_() {
  try {
    const parents = DriveApp.getFileById(ScriptApp.getScriptId()).getParents();
    return parents.hasNext() ? parents.next() : null;
  } catch (e) {
    console.error('Složku skriptu se nepodařilo zjistit: ' + e);
    return null;
  }
}

/** Data pro úvodní obrazovku wizardu (volá doGet, jen před inicializací). */
function wizardInfo_() {
  const email = currentEmail_();
  const folder = scriptFolder_();
  return {
    email: email,
    isOwner: !!email && email === Session.getEffectiveUser().getEmail(),
    folderName: folder ? folder.getName() : null,
    defaultAppName: CONFIG.defaultAppName,
    defaultAppSubtitle: CONFIG.defaultAppSubtitle,
  };
}

/**
 * Dokončení wizardu: vytvoří DB spreadsheet, založí schéma, zapíše
 * superadmina a nastavení. Chráněno zámkem proti dvojí inicializaci.
 */
function setupInitialize(payload) {
  try {
    if (isSetupDone_()) return fail_('Aplikace už je inicializována.');

    const email = currentEmail_();
    if (!email || email !== Session.getEffectiveUser().getEmail()) {
      return fail_('Inicializaci může provést pouze vlastník skriptu.');
    }

    const appName = String((payload && payload.appName) || '').trim();
    if (!appName) return fail_('Vyplňte název aplikace.');
    const appSubtitle = String((payload && payload.appSubtitle) || '').trim();
    const userName = String((payload && payload.userName) || '').trim();

    return withLock_(() => {
      if (isSetupDone_()) return fail_('Aplikace už je inicializována.');

      const ss = SpreadsheetApp.create(appName + ' – databáze');
      const defaultSheet = ss.getSheets()[0];
      const folder = scriptFolder_();
      if (folder) DriveApp.getFileById(ss.getId()).moveTo(folder);

      dbEnsureSchema_(ss);
      ss.deleteSheet(defaultSheet);

      const properties = {};
      properties[PROPS.DB_ID] = ss.getId();
      properties[PROPS.SETUP_AT] = nowIso_();
      PropertiesService.getScriptProperties().setProperties(properties);
      dbHandle_ = ss;

      dbInsert_(SHEETS.USERS, {
        email: email,
        name: userName,
        role: ROLES.SUPERADMIN,
        active: true,
      });
      settingsSet_('appName', appName);
      settingsSet_('appSubtitle', appSubtitle);
      audit_('setup', 'Inicializace aplikace. DB: ' + ss.getId()
        + (folder ? ', složka: ' + folder.getName() : ', složka: kořen Disku'));

      return ok_({
        spreadsheetUrl: ss.getUrl(),
        folderName: folder ? folder.getName() : null,
      });
    });
  } catch (e) {
    console.error(e);
    return fail_(e);
  }
}
