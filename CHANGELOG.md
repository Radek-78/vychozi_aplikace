# Changelog

## v2.1.33 – 11.06.2026 09:48
- Home: 3 nové moduly — Svátek dne (statický JS kalendář), Počasí (Open-Meteo + geolokace), Poslední návštěva (DB last_visit_at)

## v2.1.32 – 11.06.2026 00:09
- UI: section-bar layout pro všechny záložky, sort/filter na sloupcích tabulek, Lidl ikony (SVG sprite), filiálky: deaktivace tlačítkem, manually_inactive přes sync

## v2.1.31 – 10.06.2026 23:21
- Home: všechny moduly v designu bočního pruhu s barevnými variantami
- globální busy overlay s rozmazáním a popisem akce u všech načítání

## v2.1.30 – 10.06.2026 23:09
- Home: hero dvouřádková pravá strana, activity panel u spodního okraje, 6 nových designů modulů (boční pruh, kruh, závorky, diagonála, vstupenka, typo)

## v2.1.29 – 10.06.2026 22:55
- Home: kompaktní hero s číslem týdne, 6 rozdílných designů modulů (čtverce), kompaktní activity panel, stat karta s počtem uživatelů

## v2.1.28 – 10.06.2026 22:39
- Home: footer fix, hero top-left + status, vokativ, 6 module designů, activity scroll nav, tooltip overflow fix, hover lift odstraněn

## v2.1.27 – 10.06.2026 22:11
- Home: redesign — odstraněn topbar, hero s varováním (bell/badge/tooltip), modul grid 6 sloupců, activity list, changelog modal
- Sidebar: email uživatele

## v2.1.26 – 10.06.2026 21:44
- Wizard: sync krok skrytý při prázdné URL
- odstraněn výchozí podtitul 'Webová aplikace'

## v2.1.25 – 10.06.2026 21:37
- Wizard: Dokončuji vždy poslední krok, sync krok jen při potvrzeném přístupu ke složce

## v2.1.24 – 10.06.2026 21:32
- Wizard: krok načítání filiálek v progress panelu (zobrazí se jen při potvrzeném přístupu ke složce)

## v2.1.23 – 10.06.2026 21:27
- Wizard: oprava pořadí volání - disabled se nastavuje až po setButtonLoading

## v2.1.22 – 10.06.2026 21:22
- Wizard: tlačítko Pokračovat v kroku 1 aktivní až po načtení emailu superadmina

## v2.1.21 – 10.06.2026 21:15
- Wizard: status přístupu ve štítku pole, první sync po init
- Home: varování o chybějící konfiguraci

## v2.1.20 – 10.06.2026 21:04
- Wizard: předvyplněná URL sync složky, automatická kontrola přístupu ke složce

## v2.1.19 – 10.06.2026 21:00
- Wizard: chyba validace jako placeholder v poli (zmizí po 3s), žádná změna velikosti okna

## v2.1.18 – 10.06.2026 20:56
- Wizard: validace povinných polí bez zvětšení okna, červené ohraničení při chybě

## v2.1.17 – 10.06.2026 20:52
- Wizard krok 2: ikony u polí, oprava podtitulu (placeholder), lepší validace povinných polí, hint sync složky

## v2.1.16 – 10.06.2026 17:29
- DB: dbDeserialize_ převádí Date objekty na string při čtení (oprava časových hodnot)

## v2.1.15 – 10.06.2026 17:22
- Debug: tlačítko a funkce apiDebugStores pro diagnostiku načítání filiálek

## v2.1.14 – 10.06.2026 17:19
- DB schema logistics: odstraněn sloupec synced_at (LC se nesynchronizují)

## v2.1.13 – 10.06.2026 17:17
- Sync: oprava formátu časových buněk z xlsx (Date→H:mm string)

## v2.1.12 – 10.06.2026 17:13
- LC modal: placeholdery BNL/Brandýs
- placeholder barva světle šedá globálně

## v2.1.11 – 10.06.2026 17:05
- Sync: odstraněna synchronizace LC z xlsx (LC se zakládají ručně)

## v2.1.10 – 10.06.2026 17:01
- Sync: dočasný Sheet se vytvoří ve složce skriptu, ne v kořeni Disku

## v2.1.9 – 10.06.2026 16:57
- Sync: konverze .xlsx na dočasný Google Sheet před čtením (Drive Advanced Service)

## v2.1.8 – 10.06.2026 16:37
- Wizard: Název a Podtitul vedle sebe v kroku 2 (form-row-2)

## v2.1.7 – 10.06.2026 16:24
- Síť filiálek a log. center: CRUD, sync z xlsx
- wizard: pole sync složky
- CSS: modal-wide, form-hint, is-muted

## v2.1.6 – 10.06.2026 14:45
- Redesign úvodní stránky: hero uvítací banner s pozdravem a datem, oddělené status karty se stínem, zaoblené ikony, hover efekt na module kartách

## v2.1.5 – 10.06.2026 14:32
- Wizard UX: symetrické kroky se spojovací čarou, přechody mezi kroky, konstantní výška, progress panel při inicializaci, loading na Spustit aplikaci

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
