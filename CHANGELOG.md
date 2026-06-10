# Changelog

## v2.1.4 – 10.06.2026 14:17
- Oprava načítání brandu (APP_BOOTSTRAP před view includes)
- rastr na loader obrazovce
- skrytí loaderu při navigaci menu
- SVG ikony v status kartách

## v2.1.3 – 10.06.2026 14:00
- Jméno a příjmení vedle sebe i ve wizardu (form-row-2)

## v2.1.2 – 10.06.2026 13:57
- Jméno a příjmení vedle sebe v modalu — CSS třída form-row-2

## v2.1.1 – 10.06.2026 13:55
- Jméno a příjmení vedle sebe v modalu uživatele

## v2.1.0 – 10.06.2026 13:53
- Spustit aplikaci naviguje přes appUrl ze serveru
- jméno/příjmení jako samostatná pole v DB a UI
- rastr vždy viditelný (padding 48px)
- userDisplayName_ helper

## v2.0.9 – 10.06.2026 13:44
- Auth uživatele přesunuta do klienta přes apiGetCurrentUser
- doGet už neřeší identitu (getActiveUser nefunguje v doGet kontextu)

## v2.0.8 – 10.06.2026 13:38
- isSetupDone_ ověřuje existenci spreadsheetu
- při smazání DB se property automaticky vyčistí a spustí se wizard

## v2.0.7 – 10.06.2026 13:35
- Oprava auth: access DOMAIN (fix doGet, reload po wizardu, načtení uživatele)
- jemnější rastr pozadí

## v2.0.6 – 10.06.2026 13:33
- Oprava auth: access ANYONE_WITH_GOOGLE_LINK (fix doGet, reload po wizardu, načtení uživatele)
- jemnější rastr pozadí

## v2.0.5 – 10.06.2026 13:23
- Složka skriptu načítána přes google.script.run (stejný fix jako email)

## v2.0.4 – 10.06.2026 13:19
- Email ve wizardu načítán přes google.script.run místo doGet bootstrapu

## v2.0.3 – 10.06.2026 13:17
- Debug panel pro diagnostiku emailu ve wizardu

## v2.0.2 – 10.06.2026 13:12
- Oprava centrování ikon ve wizardu (CSS specifičnost info-row span)
- email přes getEffectiveUser() jako primární zdroj

## v2.0.1 – 10.06.2026 13:08
- Oprava zjišťování emailu ve wizardu (fallback na getEffectiveUser)
- vycentrování ikon
- bodový rastr na pozadí

## v2.0.0 – 10.06.2026 12:55
- Kompletní přepracování šablony: úvodní průvodce (superadmin + databáze ve složce skriptu), role a oprávnění přes list _users, DB vrstva nad Sheets, administrace (uživatelé, nastavení, audit), jednotná odpovědní obálka API.
