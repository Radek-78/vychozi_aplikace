/**
 * Veřejné API volané z frontendu přes google.script.run.
 * Každý endpoint je obalený guard_() — vrací { ok, data } / { ok, error }.
 */

function apiGetHome() {
  return guard_(ROLES.USER, (user) => {
    const isAdmin = (ROLE_LEVEL[user.role] || 0) >= ROLE_LEVEL[ROLES.ADMIN];
    return {
      stats: [
        { label: 'Stav systému', value: 'V pořádku', tone: 'success', icon: 'check' },
        { label: 'Přihlášen', value: user.name || user.email, tone: 'info', icon: 'user' },
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
      name: String((payload && payload.name) || '').trim(),
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

/* ── Audit ──────────────────────────────────────────────────────── */

function apiGetAudit() {
  return guard_(ROLES.ADMIN, () => dbGetAll_(SHEETS.AUDIT).slice(-100).reverse());
}
