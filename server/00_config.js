/**
 * CentrÄ‚Ë‡lnÄ‚Â­ konfigurace ÄąË‡ablony.
 *
 * Hodnoty specifickÄ‚Â© pro konkrÄ‚Â©tnÄ‚Â­ projekt (nÄ‚Ë‡zev, podtitul) se po inicializaci
 * Ă„Ĺ¤tou z listu _settings v databÄ‚Ë‡zi Ă˘â‚¬â€ť zde jsou jen vÄ‚ËťchozÄ‚Â­ hodnoty a konstanty,
 * kterÄ‚Â© se mezi projekty nemĂ„â€şnÄ‚Â­.
 */
const CONFIG = {
  defaultAppName: 'VÄ‚ËťchozÄ‚Â­ aplikace',
  defaultAppSubtitle: '',
  version: 'v3.0.0',
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

/** KlÄ‚Â­Ă„Ĺ¤e ve Script Properties. */
const PROPS = {
  DB_ID: 'DB_SPREADSHEET_ID',
  SETUP_AT: 'SETUP_COMPLETED_AT',
};

/** Role a jejich hierarchie. VyÄąË‡ÄąË‡Ä‚Â­ Ă„Ĺ¤Ä‚Â­slo = vyÄąË‡ÄąË‡Ä‚Â­ oprÄ‚Ë‡vnĂ„â€şnÄ‚Â­. */
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

/** SystÄ‚Â©movÄ‚Â© listy v DB spreadsheetu. */
const SHEETS = {
  USERS: '_users',
  SETTINGS: '_settings',
  AUDIT: '_audit_log',
  STORES: 'stores',
  LOGISTICS: 'logistics',
  APPS: 'apps',
  ROLE_PERMISSIONS: '_role_permissions',
};
