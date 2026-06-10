/**
 * Veřejné API volané z frontendu přes google.script.run.
 * Každý endpoint je obalený guard_() — vrací { ok, data } / { ok, error }.
 */

function apiGetCurrentUser() {
  return guard_(ROLES.USER, (user) => user);
}

function apiGetHome() {
  return guard_(ROLES.USER, (user) => {
    const isAdmin = (ROLE_LEVEL[user.role] || 0) >= ROLE_LEVEL[ROLES.ADMIN];
    return {
      stats: [
        { label: 'Stav systému', value: 'V pořádku', tone: 'success', icon: 'check' },
        { label: 'Přihlášen', value: userDisplayName_(user) || user.email, tone: 'info', icon: 'user' },
        { label: 'Role', value: user.role, tone: 'neutral', icon: 'users' },
        { label: 'Verze', value: CONFIG.version, tone: 'neutral', icon: 'info' },
      ],
      activity: isAdmin ? dbGetAll_(SHEETS.AUDIT).slice(-10).reverse() : [],
    };
  });
}

/* ── Uživatelé ──────────────────────────────────────────────────── */

function apiListUsers() {
  return guard_(ROLES.ADMIN, () => dbGetAll_(SHEETS.USERS));
}

function apiSaveUser(payload) {
  return guard_(ROLES.ADMIN, (actor) => {
    const email = String((payload && payload.email) || '').trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Zadejte platný e-mail.');
    const firstName = String((payload && payload.firstName) || '').trim();
    const lastName = String((payload && payload.lastName) || '').trim();

    const role = String((payload && payload.role) || ROLES.USER).toUpperCase();
    if (!ROLES[role]) throw new Error('Neplatná role.');

    const actorIsSuper = actor.role === ROLES.SUPERADMIN;
    if (role === ROLES.SUPERADMIN && !actorIsSuper) {
      throw new Error('Roli superadmin může přidělit pouze superadmin.');
    }

    const users = dbGetAll_(SHEETS.USERS);
    const existing = payload.id ? users.find((user) => user.id === payload.id) : null;
    if (payload.id && !existing) throw new Error('Uživatel nenalezen.');
    if (existing && existing.role === ROLES.SUPERADMIN && !actorIsSuper) {
      throw new Error('Superadmina může upravit pouze superadmin.');
    }

    const duplicate = users.find(
      (user) => String(user.email).toLowerCase() === email && (!existing || user.id !== existing.id)
    );
    if (duplicate) throw new Error('Uživatel s tímto e-mailem už existuje.');

    const active = !payload || payload.active !== false;

    // Poslední aktivní superadmin nesmí přijít o roli ani být zablokován.
    if (existing && existing.role === ROLES.SUPERADMIN && (role !== ROLES.SUPERADMIN || !active)) {
      const superadmins = users.filter(
        (user) => user.role === ROLES.SUPERADMIN && user.active === true
      );
      if (superadmins.length <= 1) {
        throw new Error('Aplikace musí mít alespoň jednoho aktivního superadmina.');
      }
    }

    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: role,
      active: active,
    };

    const saved = existing
      ? dbUpdate_(SHEETS.USERS, existing.id, data)
      : dbInsert_(SHEETS.USERS, data);
    audit_(existing ? 'user_update' : 'user_create', email + ' (' + role + (active ? '' : ', blokován') + ')');
    return saved;
  });
}

/* ── Nastavení ──────────────────────────────────────────────────── */

function apiGetSettings() {
  return guard_(ROLES.ADMIN, () => settingsAll_());
}

function apiSaveSettings(payload) {
  return guard_(ROLES.ADMIN, () => {
    const appName = String((payload && payload.appName) || '').trim();
    if (!appName) throw new Error('Vyplňte název aplikace.');
    settingsSet_('appName', appName);
    settingsSet_('appSubtitle', String((payload && payload.appSubtitle) || '').trim());
    audit_('settings_update', appName);
    return settingsAll_();
  });
}

/* ── Stores ─────────────────────────────────────────────────────── */

function apiListStores() {
  return guard_(ROLES.ADMIN, () => dbGetAll_(SHEETS.STORES));
}

function apiSaveStore(payload) {
  return guard_(ROLES.ADMIN, (actor) => {
    const code = String((payload && payload.code) || '').trim();
    if (!/^\d{1,3}$/.test(code)) throw new Error('Číslo prodejny musí být 1–3 cifry.');
    const paddedCode = code.padStart(3, '0');

    const name = String((payload && payload.name) || '').trim();
    if (!name) throw new Error('Název je povinný.');

    const HOUR_FIELDS = [
      'mon_open','mon_close','tue_open','tue_close','wed_open','wed_close',
      'thu_open','thu_close','fri_open','fri_close','sat_open','sat_close',
      'sun_open','sun_close',
    ];
    const data = {
      code: paddedCode,
      name,
      lc_code: String((payload && payload.lc_code) || '').trim(),
      phone: String((payload && payload.phone) || '').trim(),
      area_manager: String((payload && payload.area_manager) || '').trim(),
      regional_manager: String((payload && payload.regional_manager) || '').trim(),
      rm_phone: String((payload && payload.rm_phone) || '').trim(),
      temporarily_closed: payload && payload.temporarily_closed === true,
      active: !payload || payload.active !== false,
    };
    HOUR_FIELDS.forEach((f) => { data[f] = String((payload && payload[f]) || '').trim(); });

    const stores = dbGetAll_(SHEETS.STORES);
    const existing = payload && payload.id ? stores.find((s) => s.id === payload.id) : null;
    if (payload && payload.id && !existing) throw new Error('Filiálka nenalezena.');

    const duplicate = stores.find(
      (s) => s.code === paddedCode && (!existing || s.id !== existing.id)
    );
    if (duplicate) throw new Error('Filiálka s tímto číslem už existuje.');

    const saved = existing
      ? dbUpdate_(SHEETS.STORES, existing.id, data)
      : dbInsert_(SHEETS.STORES, data);
    audit_('store_' + (existing ? 'update' : 'create'), paddedCode + ' ' + name);
    return saved;
  });
}

function apiDeleteStore(id) {
  return guard_(ROLES.ADMIN, () => {
    const store = dbGetById_(SHEETS.STORES, id);
    if (!store) throw new Error('Filiálka nenalezena.');
    dbUpdate_(SHEETS.STORES, id, { active: false });
    audit_('store_delete', store.code + ' ' + store.name);
    return null;
  });
}

/* ── Logistics ──────────────────────────────────────────────────── */

function apiListLogistics() {
  return guard_(ROLES.ADMIN, () => dbGetAll_(SHEETS.LOGISTICS));
}

function apiSaveLogistic(payload) {
  return guard_(ROLES.ADMIN, () => {
    const code = String((payload && payload.code) || '').trim();
    if (!code) throw new Error('Číslo LC je povinné.');
    const name = String((payload && payload.name) || '').trim();
    if (!name) throw new Error('Název je povinný.');
    const abbreviation = String((payload && payload.abbreviation) || '').trim().toUpperCase();
    if (!/^[A-Z]{2,4}$/.test(abbreviation)) throw new Error('Zkratka musí mít 2–4 písmena.');

    const data = {
      code,
      name,
      abbreviation,
      active: !payload || payload.active !== false,
    };

    const list = dbGetAll_(SHEETS.LOGISTICS);
    const existing = payload && payload.id ? list.find((l) => l.id === payload.id) : null;
    if (payload && payload.id && !existing) throw new Error('LC nenalezeno.');

    const dup = list.find(
      (l) => l.abbreviation === abbreviation && (!existing || l.id !== existing.id)
    );
    if (dup) throw new Error('LC s touto zkratkou už existuje.');

    const saved = existing
      ? dbUpdate_(SHEETS.LOGISTICS, existing.id, data)
      : dbInsert_(SHEETS.LOGISTICS, data);
    audit_('logistic_' + (existing ? 'update' : 'create'), abbreviation + ' ' + name);
    return saved;
  });
}

function apiDeleteLogistic(id) {
  return guard_(ROLES.ADMIN, () => {
    const lc = dbGetById_(SHEETS.LOGISTICS, id);
    if (!lc) throw new Error('LC nenalezeno.');
    dbUpdate_(SHEETS.LOGISTICS, id, { active: false });
    audit_('logistic_delete', lc.abbreviation + ' ' + lc.name);
    return null;
  });
}

/* ── Sync settings ──────────────────────────────────────────────── */

function apiGetSyncSettings() {
  return guard_(ROLES.ADMIN, () => {
    const s = settingsAll_();
    return {
      syncFolderUrl: s.syncFolderUrl || '',
      syncStoresSheet: s.syncStoresSheet || 'VTBZL_export',
      syncTempClosedPrefix: s.syncTempClosedPrefix || 'Dočasné zavření',
      syncLogisticsSheet: s.syncLogisticsSheet || 'LC',
      lastSyncAt: s.lastSyncAt || null,
      lastSyncResult: s.lastSyncResult ? JSON.parse(s.lastSyncResult) : null,
    };
  });
}

function apiSaveSyncSettings(payload) {
  return guard_(ROLES.ADMIN, () => {
    settingsSet_('syncFolderUrl', String((payload && payload.syncFolderUrl) || '').trim());
    settingsSet_('syncStoresSheet', String((payload && payload.syncStoresSheet) || 'VTBZL_export').trim());
    settingsSet_('syncTempClosedPrefix', String((payload && payload.syncTempClosedPrefix) || 'Dočasné zavření').trim());
    settingsSet_('syncLogisticsSheet', String((payload && payload.syncLogisticsSheet) || 'LC').trim());
    audit_('sync_settings_update', 'Aktualizace konfigurace synchronizace.');
    return null;
  });
}

/* ── Audit ──────────────────────────────────────────────────────── */

function apiGetAudit() {
  return guard_(ROLES.ADMIN, () => dbGetAll_(SHEETS.AUDIT).slice(-100).reverse());
}
