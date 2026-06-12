/**
 * CentrĂˇlnĂ­ konfigurace Ĺˇablony.
 *
 * Hodnoty specifickĂ© pro konkrĂ©tnĂ­ projekt (nĂˇzev, podtitul) se po inicializaci
 * ÄŤtou z listu _settings v databĂˇzi â€” zde jsou jen vĂ˝chozĂ­ hodnoty a konstanty,
 * kterĂ© se mezi projekty nemÄ›nĂ­.
 */
const CONFIG = {
  defaultAppName: 'VĂ˝chozĂ­ aplikace',
  defaultAppSubtitle: '',
  version: 'v2.2.0',
  logoUrl: 'https://drive.google.com/thumbnail?id=18mu_Lq1F_FqqSZcolMjLwG0aaQDPMdyD&sz=w320',
  theme: {
    blue: '#0050aa',
    darkBlue: '#002466',
    lightBlue: '#008cd2',
    yellow: '#fff000',
    red: '#e60a14',
    white: '#ffffff',
    black: '#000000',
  },
};

/** KlĂ­ÄŤe ve Script Properties. */
const PROPS = {
  DB_ID: 'DB_SPREADSHEET_ID',
  SETUP_AT: 'SETUP_COMPLETED_AT',
};

/** Role a jejich hierarchie. VyĹˇĹˇĂ­ ÄŤĂ­slo = vyĹˇĹˇĂ­ oprĂˇvnÄ›nĂ­. */
const ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
};

const ROLE_LEVEL = {
  SUPERADMIN: 3,
  ADMIN: 2,
  USER: 1,
};

/** SystĂ©movĂ© listy v DB spreadsheetu. */
const SHEETS = {
  USERS: '_users',
  SETTINGS: '_settings',
  AUDIT: '_audit_log',
  STORES: 'stores',
  LOGISTICS: 'logistics',
  APPS: 'apps',
};
