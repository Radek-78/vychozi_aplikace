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
  return dbGetAll_(SHEETS.USERS).find(
    (user) => String(user.email).toLowerCase() === email.toLowerCase() && user.active === true
  ) || null;
}

/**
 * Obal pro každý veřejný endpoint: ověří inicializaci, uživatele a roli,
 * spustí fn(uživatel) a výsledek či chybu zabalí do jednotné obálky.
 */
function guard_(minRole, fn) {
  try {
    if (!isSetupDone_()) throw new Error('Aplikace není inicializována.');
    const user = getCurrentUser_();
    if (!user) throw new Error('Nemáte přístup do aplikace. Kontaktujte správce.');
    if ((ROLE_LEVEL[user.role] || 0) < ROLE_LEVEL[minRole]) {
      throw new Error('Na tuto akci nemáte dostatečné oprávnění.');
    }
    return ok_(fn(user));
  } catch (e) {
    console.error(e);
    return fail_(e);
  }
}
