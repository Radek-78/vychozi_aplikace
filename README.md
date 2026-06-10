# Výchozí aplikace 2.0

Výchozí šablona pro Google Apps Script webové aplikace v interním Lidl stylu.
Každý nový projekt začíná úvodním průvodcem: uživatel, který ho dokončí, se
stává superadminem a ve složce skriptu vznikne spreadsheet sloužící jako databáze.

## Struktura

```text
server/
  00_config.js     konstanty: výchozí texty, role, klíče properties, systémové listy
  10_util.js       odpovědní obálka {ok,data,error}, uuid, audit log
  20_db.js         repository vrstva nad Sheets (DB_SCHEMA -> CRUD, zámky)
  30_auth.js       identita, role, guard_ pro každý endpoint
  40_setup.js      detekce prvního spuštění + inicializace (backend wizardu)
  50_api.js        veřejné API volané z UI (vždy přes guard_)
  90_tools.js      ruční nástroje pro vlastníka (spouští se z editoru)
  99_main.js       doGet — routing wizard / aplikace / bez přístupu
ui/
  styles.html      kompletní design systém (Lidl barvy, komponenty)
  core.html        Ui objekt: volání serveru, loader, toasty, modaly
  view_wizard.html úvodní průvodce (3 kroky + úspěch)
  view_app.html    shell aplikace: sidebar, topbar, Domů, Uživatelé, Nastavení, Audit
index.html         vstupní šablona, SVG ikony, bootstrap dat
tools/
  new-project.ps1  založení nového projektu ze šablony
```

## Životní cyklus projektu

1. `.\tools\new-project.ps1 -Name "Název projektu"` — zkopíruje šablonu,
   vytvoří nový standalone skript a nahraje soubory.
2. V editoru (`npx clasp open-script`) spusť `TOOLS_presunSkriptDoSlozky`
   s ID cílové složky Drive — přesune skript a odsouhlasí oprávnění.
3. Deploy → New deployment → **Web app**, Execute as: **Me**.
4. Otevři URL aplikace → proběhne **úvodní průvodce**:
   - tebe zapíše jako superadmina,
   - ve složce skriptu vytvoří spreadsheet `<název> – databáze`
     s listy `_users`, `_settings`, `_audit_log`,
   - ID databáze uloží do Script Properties.
5. Další uživatele přidáš v sekci **Uživatelé** (role: superadmin, administrátor, uživatel).

## Databáze (Sheets)

- Tabulka = list, první řádek = hlavičky podle `DB_SCHEMA` v `server/20_db.js`.
- Novou tabulku projektu přidáš rozšířením `DB_SCHEMA` — `dbEnsureSchema_()`
  chybějící listy/sloupce doplní (nic nemaže).
- Záznamy dostávají automaticky `id`, `created_at`, `created_by`, `updated_at`.
- Veškerá čtení/zápisy jdou dávkově (`getValues`/`setValues`), zápisy pod zámkem.

## Oprávnění

- Nasazení **Execute as me** — uživatelé nepotřebují přístup ke spreadsheetu,
  o přístupu rozhoduje výhradně list `_users`.
- Každý endpoint v `server/50_api.js` je obalený `guard_(role, fn)` a vrací
  obálku `{ ok, data | error }` — frontend ji rozbaluje v `Ui.call()`.
- `webapp.access` v `appsscript.json` je `ANYONE`; na Workspace doméně změň
  na `DOMAIN`. Pozn.: u účtů mimo doménu nemusí být dostupný e-mail uživatele —
  takový uživatel uvidí obrazovku „bez přístupu".

## Nástroje (editor Apps Script, ručně)

- `TOOLS_kdeJeSkript` — vypíše složku skriptu a odkaz na databázi.
- `TOOLS_presunSkriptDoSlozky` — přesune skript do zadané složky Drive.
- `TOOLS_resetInicializace` — odpojí databázi; další otevření spustí průvodce
  (spreadsheet v Drive zůstává).
- `TOOLS_testDb` — rychlý test CRUD operací DB vrstvy.

## UI pravidla

- Sidebar je Lidl Dark Blue, aktivní položka má žluté zvýraznění.
- Žlutá jen jako akcent, červená jen pro chyby a blokace.
- Ikony jsou jednoduché line symboly (SVG sprite v `index.html`).
- Loader je brand splash: modré pozadí, logo, název aplikace, žluté tečky.

## Vývoj

```powershell
npx clasp push        # nahrání změn (testování)
npx clasp open-script # otevření editoru
```

Pro testování použij test deployment `/dev` (Deploy → Test deployments).

## Release (verzování + záloha)

Každé vydání se provádí výhradně skriptem:

```powershell
.\tools\release.ps1 -Version v2.1.0 -Message "Popis změny; další položka"
```

Skript v jednom kroku:

1. změní číslo verze v `server/00_config.js` (zobrazuje se ve footeru),
2. zapíše záznam s datem a časem do `CHANGELOG.md`,
3. nahraje soubory do Apps Scriptu (`clasp push`),
4. provede `git commit`, tag verze a push na GitHub
   (https://github.com/Radek-78/vychozi_aplikace).

Číslo verze ani changelog neměň ručně — vždy přes `release.ps1`.
