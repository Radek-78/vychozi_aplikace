/**
 * Vstupní bod webové aplikace.
 *
 * Routing podle stavu:
 *  - bez inicializace  → úvodní průvodce (wizard)
 *  - uživatel v _users → aplikace
 *  - jinak             → obrazovka bez přístupu
 */
function doGet() {
  let page = 'wizard';
  let user = null;
  let settings = {};

  try {
    if (isSetupDone_()) {
      user = getCurrentUser_();
      page = user ? 'app' : 'denied';
      if (user) settings = settingsAll_();
    }
  } catch (e) {
    console.error(e);
    page = 'denied';
  }

  const data = {
    page: page,
    appName: settings.appName || CONFIG.defaultAppName,
    appSubtitle: settings.appSubtitle || CONFIG.defaultAppSubtitle,
    logoUrl: CONFIG.logoUrl,
    version: CONFIG.version,
    userEmail: currentEmail_(),
    user: user ? { email: user.email, name: user.name, role: user.role } : null,
    setup: page === 'wizard' ? wizardInfo_() : null,
  };

  const template = HtmlService.createTemplateFromFile('index');
  template.app = data;
  template.bootstrapJson = JSON.stringify(data).replace(/</g, '\\u003c');
  return template.evaluate()
    .setTitle(data.appName)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}
