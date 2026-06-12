/**
 * Identita a oprávnění.
 *
 * Aplikace je nasazena jako "Execute as me" — uživatelé nepotřebují přístup
 * k DB spreadsheetu, o přístupu rozhoduje výhradně tabulka _users.
 */
function currentEmail_() {
  return Session.getActiveUser().getEmail() || '';
}

/** Vrátí aktivního uživatele z _users, nebo null (bez přístupu). */
function getCurrentUser_() {
  const email = currentEmail_();
  if (!email) return null;
  const user = dbGetAll_(SHEETS.USERS).find(
    (u) => String(u.email).toLowerCase() === email.toLowerCase() && u.active === true
  ) || null;

  if (user) {
    // Výchozí hodnoty pro zachování přístupu stávajících uživatelů
    if (!user.permission) user.permission = 'EDITOR';
    if (!user.location) user.location = 'HQ';
  }
  return user;
}

/**
 * Centrální vyhodnocení přístupových práv uživatele.
 * 
 * @param {Object} user Aktivní uživatel z DB
 * @param {string} minRole Minimální vyžadovaná role ('USER', 'ADMIN', 'SUPERADMIN')
 * @param {boolean} requireWrite Vyžaduje tato akce zápis/editaci? (default false)
 * @param {string} [resourceLcCode] LC kód pro kontrolu datového rozsahu (např. 'BNL')
 * @returns {boolean}
 */
function isAllowed_(user, minRole, requireWrite, resourceLcCode) {
  if (!user || user.active !== true) return false;

  // Superadmin má vždy plná práva ke všemu
  if (user.role === 'SUPERADMIN') return true;

  // 1. KROK: Kontrola systémové role
  const userLevel = ROLE_LEVEL[user.role] || 1;
  const requiredLevel = ROLE_LEVEL[minRole] || 1;
  if (userLevel < requiredLevel) return false;

  // 2. KROK: Kontrola oprávnění k zápisu (READER vs EDITOR)
  if (requireWrite && user.permission !== 'EDITOR') {
    return false;
  }

  // 3. KROK: Kontrola lokace (Row-Level Security)
  const userLoc = String(user.location || 'HQ').trim().toUpperCase();
  if (userLoc === 'HQ' || userLoc === 'CENTRÁLA') {
    return true; // Uživatel z centrály vidí vše
  }

  // Pokud provádíme akci nad konkrétním záznamem patřícím pod nějaké LC
  if (resourceLcCode) {
    return userLoc === String(resourceLcCode).trim().toUpperCase();
  }

  return true;
}

/**
 * Obal pro každý veřejný endpoint: ověří inicializaci, uživatele a roli,
 * spustí fn(uživatel) a výsledek či chybu zabalí do jednotné obálky.
 */
function guard_(minRole, fn, options) {
  try {
    if (!isSetupDone_()) throw new Error('Aplikace není inicializována.');
    const user = getCurrentUser_();
    if (!user) throw new Error('Nemáte přístup do aplikace. Kontaktujte správce.');
    
    const opts = options || {};
    const requireWrite = opts.requireWrite === true;
    
    if (!isAllowed_(user, minRole, requireWrite)) {
      throw new Error('Na tuto akci nemáte dostatečné oprávnění.');
    }
    return ok_(fn(user));
  } catch (e) {
    console.error(e);
    return fail_(e);
  }
}
