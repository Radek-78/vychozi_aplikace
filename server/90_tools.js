/**
 * Jednorázové nástroje pro vlastníka — spouštějí se ručně z editoru
 * Apps Script (Spustit ▸ vybraná funkce). Nejsou volány z aplikace.
 */

/** Vypíše, kde v Drive skript leží a kam by se vytvořila databáze. */
function TOOLS_kdeJeSkript() {
  const folder = scriptFolder_();
  console.log(folder
    ? 'Skript leží ve složce: ' + folder.getName() + ' (' + folder.getUrl() + ')'
    : 'Skript leží v kořeni Můj disk (nebo složku nelze přečíst).');
  const dbId = PropertiesService.getScriptProperties().getProperty(PROPS.DB_ID);
  console.log(dbId ? 'Databáze: https://docs.google.com/spreadsheets/d/' + dbId : 'Databáze zatím nebyla vytvořena.');
}

/**
 * Přesune tento skript do zadané složky v Drive. Použij, když přesun
 * v Drive UI hlásí chybu. Před spuštěním vlož ID složky (z její URL).
 */
function TOOLS_presunSkriptDoSlozky() {
  const FOLDER_ID = 'SEM_VLOZ_ID_SLOZKY';
  if (FOLDER_ID === 'SEM_VLOZ_ID_SLOZKY') {
    throw new Error('Nejdřív do konstanty FOLDER_ID vlož ID cílové složky.');
  }
  const folder = DriveApp.getFolderById(FOLDER_ID);
  DriveApp.getFileById(ScriptApp.getScriptId()).moveTo(folder);
  console.log('Skript přesunut do složky: ' + folder.getName());
}

/**
 * POZOR: odpojí aplikaci od databáze (smaže Script Properties), takže
 * při dalším otevření znovu naběhne úvodní průvodce. Samotný spreadsheet
 * v Drive zůstává — případné smazání proveď ručně.
 */
function TOOLS_resetInicializace() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  console.log('Inicializace zrušena. Další otevření aplikace spustí průvodce.');
}

/** Smaže celou server-side cache (CacheService). Použij po přímých úpravách v DB sheetu. */
function TOOLS_clearCache() {
  CacheService.getScriptCache().removeAll(
    Object.values(SHEETS).map((t) => 'tbl:' + t).concat(['tbl:_settings'])
  );
  console.log('Cache smazána.');
}

/** Rychlý test DB vrstvy: vlož, načti, uprav a smaž testovací záznam v _settings. */
function TOOLS_testDb() {
  const key = '_test_' + uuid_();
  settingsSet_(key, 'hodnota1');
  let value = settingsAll_()[key];
  if (value !== 'hodnota1') throw new Error('Zápis/čtení selhalo: ' + value);
  settingsSet_(key, 'hodnota2');
  value = settingsAll_()[key];
  if (value !== 'hodnota2') throw new Error('Aktualizace selhala: ' + value);
  const sheet = dbSheet_(SHEETS.SETTINGS);
  const keys = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  sheet.deleteRow(keys.findIndex((row) => row[0] === key) + 2);
  console.log('DB vrstva funguje (insert, read, update, delete).');
}
