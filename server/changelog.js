/**
 * Historie verzí aplikace — zobrazuje se v modalu po kliknutí na číslo verze.
 * Nejnovější verze první.
 */
const CHANGELOG = [
  { version: 'v2.1.26', date: '10.6.2026', message: 'Wizard: sync krok skrytý při prázdné URL; odstraněn výchozí podtitul.' },
  { version: 'v2.1.25', date: '10.6.2026', message: 'Wizard: Dokončuji vždy poslední krok, sync krok jen při potvrzeném přístupu ke složce.' },
  { version: 'v2.1.24', date: '10.6.2026', message: 'Wizard: krok načítání filiálek v progress panelu.' },
  { version: 'v2.1.23', date: '10.6.2026', message: 'Wizard: oprava pořadí volání — tlačítko Pokračovat aktivní až po načtení emailu.' },
  { version: 'v2.1.21', date: '10.6.2026', message: 'Wizard: automatická kontrola přístupu ke složce, první sync po inicializaci; Home: varování o chybějící konfiguraci.' },
  { version: 'v2.1.20', date: '10.6.2026', message: 'Wizard: předvyplněná URL sync složky.' },
  { version: 'v2.1.16', date: '10.6.2026', message: 'DB: oprava čtení časových hodnot (Date → H:mm string).' },
  { version: 'v2.1.13', date: '10.6.2026', message: 'Sync: oprava formátu časových buněk z xlsx.' },
  { version: 'v2.1.11', date: '10.6.2026', message: 'Sync: odstraněna synchronizace LC z xlsx — LC se zakládají ručně.' },
  { version: 'v2.1.9',  date: '10.6.2026', message: 'Sync: konverze .xlsx na dočasný Google Sheet před čtením.' },
  { version: 'v2.1.7',  date: '10.6.2026', message: 'Síť filiálek a log. center: CRUD, synchronizace z xlsx.' },
];

function apiGetChangelog() {
  return guard_(ROLES.USER, () => CHANGELOG);
}
