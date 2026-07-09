# Changelog

## v3.1.11 - 09.07.2026 13:20
- Design: vraceny puvodni styl cisel v hero statistikach (zruseno zvetseni z v3.1.10)

## v3.1.10 - 09.07.2026 13:07
- Design: vyraznejsi cisla ve statistikach hero banneru (vetsi font, tucnejsi)
- prazdny stav modulu ma jemny tecovany ramecek misto holeho textu

## v3.1.9 - 09.07.2026 12:31
- Pridana TOOLS_authorizeAutoSync - bezpecna (jen cte) funkce pro vynuceni autorizace noveho scope script.scriptapp, nutne pred zapnutim automaticke synchronizace

## v3.1.8 - 09.07.2026 12:24
- Synchronizace: automaticka kontrola slozky jednou denne (nastavitelna hodina) - pri zmene souboru (jine ID nebo novejsi uprava) spusti sync automaticky
- pridan OAuth scope script.scriptapp pro sprava triggeru

## v3.1.7 - 09.07.2026 12:01
- Synchronizace: podpora i souboru Google Sheets ve slozce (drive nejen .xlsx)
- ikona slozky vedle URL pole otevre slozku v Drive

## v3.1.6 - 09.07.2026 11:50
- Vykon: kontrola schematu (dbEnsureApps_) cachovana per-beh i pres CacheService misto behu pri kazde kontrole opravneni
- apiSaveApp posouva poradi ostatnich aplikaci jednim davkovym zapisem misto N jednotlivych
- audit log (bootstrap/home/apiGetAudit) cte jen poslednich N radku primo ze sheetu misto cele tabulky

## v3.1.5 - 09.07.2026 11:29
- Uklid: odstranen mrtvy kod (LC sync, storeDiffers_, renderStats, wizard debug, buildEmail, nedosazitelna gate vetev, DEBUG blok v syncu)
- opravena diakritika v server/00_config.js (mojibake)
- opraveny vokativy Barbora a Jaroslav
- odstranena natvrdo zadana URL Drive slozky ve wizardu

## v3.1.4 - 09.07.2026 11:24
- Changelog: modal Historie zmen se nyni generuje automaticky z CHANGELOG.md pri kazdem release (server/changelog.js uz needituj rucne)

## v3.1.3 - 09.07.2026 11:17
- Splashscreen: verze a datum vydani presunuty ke spodnimu okraji obrazovky, mensi pismo

## v3.1.2 - 09.07.2026 11:12
- Bezpecnost: opravena kontrola opravneni pro zapis filialek a logistickych center (isAllowed_ nyni spravne overuje stores_write/logistics_write vc. lokace)
- zabezpeceny TOOLS_* nastroje proti spusteni jinym uzivatelem nez vlastnikem
- smazan nechraneny debug endpoint apiDebugStores
- wizardCheckFolderAccess odmita dotazy po dokoncene inicializaci
- oprava chyby s nedefinovanou promennou ve wizardu
- splashscreen nyni zobrazuje cislo verze a datum vydani

## v3.1.1 - 16.06.2026 13:26
- Auto-email od prvniho znaku jmena
- odstraneno tlacitko z jmena

## v3.1.0 - 16.06.2026 13:21
- Auto-email se aktualizuje prubeznie pri psani
- doplnen scope script.external_request pro Workspace search

## v3.0.9 - 16.06.2026 13:14
- Auto-email jen kdyz je pole prazdne
- search chyba se zobrazi v dropdownu misto skryti widgetu

## v3.0.8 - 16.06.2026 13:09
- Workspace search: People API pres UrlFetchApp REST misto advanced service - funguje bez admin prav

## v3.0.7 - 16.06.2026 13:08
- Workspace search: AdminDirectory nahrazen People API (directory.readonly) - funguje bez admin prav

## v3.0.6 - 16.06.2026 13:06
- Email se generuje live pri psani jmena
- workspace search se ticho skryje pri chybe opravneni

## v3.0.5 - 16.06.2026 13:00
- Modal uzivatele: vyhledavani zamestnance v Google Workspace + tlacitko pro sestaveni emailu z jmena

## v3.0.4 - 16.06.2026 12:43
- Section bar: sjednoceni leveho odsazeni nadpisu na 16px ve vsech zaloskach

## v3.0.3 - 16.06.2026 12:38
- Modal filiálky: kalendar ma vzdy 6 radku
- mezery mezi kartami s informacemi

## v3.0.2 - 16.06.2026 12:29
- Sloupec Nazev: zobrazeni aktivniho rozsahu datumu vlevo od badge Docasne uzavrena

## v3.0.1 - 16.06.2026 12:26
- Badge Docasne uzavrena zarovnana k pravemu okraji sloupce Nazev

## v3.0.0 - 16.06.2026 12:24
- Sync: temporarily_closed se bere z temp_closed_ranges, nikoli z xlsx
- badge Docasne uzavrena zarovnana vpravo v bunce

## v2.9.9 - 16.06.2026 12:09
- Badge filtr: vyber VT zvyrazni nadrazene LC
- vyber RM zvyrazni nadrazene VT a LC

## v2.9.8 - 16.06.2026 12:01
- Oprava filtru Docasne uzavrena
- modal se nezavre pri prvnim otevreni
- logo spinneru se nacte z APP_BOOTSTRAP

## v2.9.7 - 16.06.2026 11:13
- isTempClosedNow_ helper na serveru
- spinner v modal okne ma logo Lidl

## v2.9.6 - 16.06.2026 11:03
- Store modal: mezery mezi kartami, padding footeru, pravy okraj kalendare, saving overlay uvnitr dialogu

## v2.9.5 - 16.06.2026 10:54
- Store modal: oprava paddingu
- ulozeni bez busy overlay
- badge se aktualizuje okamzite po ulozeni

## v2.9.4 - 16.06.2026 10:44
- Sync: dbEnsureSchema_ pred ctenim DB - sync obnovi chybejici list stores automaticky

## v2.9.3 - 16.06.2026 10:40
- Store modal: sirsi okno (860px)
- telefon prodejny na radku s cislem a nazvem filialky

## v2.9.2 - 16.06.2026 10:31
- Filialky: oprava timezone v kalendari
- sync nezamazava oteviraci doby z DB
- sirka sloupce Akce
- redesign store modalu s kartami a ikonami

## v2.9.1 - 16.06.2026 10:19
- Filialky: oprava poradi sloupce temp_closed_ranges v DB schematu
- oprava JS chyby v openStoreModal
- hlavicka Akce v poslednim sloupci
- tlacitka ve spolecnem sloupci

## v2.9.0 - 16.06.2026 10:08
- Filialky: modal s detailem filialky a kalendarem pro rucni spravou docasneho uzavreni
- badge docasne uzavrena rizena rozsahy dat misto sync pole

## v2.8.6 - 16.06.2026 09:44
- Popup filtru sloupce: ciselne hodnoty razeny numericky, ne abecedne

## v2.8.5 - 16.06.2026 09:41
- Popup filtru sloupce: tlacitko pro okamzite smazani aktivniho filtru v hlavicce okna

## v2.8.4 - 16.06.2026 09:39
- Filialky: badge Docasne uzavrena neotevira popup filtru
- misto scrollbaru vzdy vyhrazeno

## v2.8.3 - 16.06.2026 09:18
- Popup razeni/filtru sloupce: ikona krizku pro zavreni v pravem hornim rohu hlavicky

## v2.8.2 - 16.06.2026 09:15
- Filialky: filtr docasne uzavrene filialky v hlavicce sloupce Nazev

## v2.8.1 - 16.06.2026 09:10
- Filialky: fixni sirka sloupcu tabulky
- odstraneni zlute oramovani vyhledavaciho pole v seznamu RM

## v2.8.0 - 16.06.2026 09:06
- Filtry LC/VT/RM v zalozce Filialky: badge system, kaskadove filtrovani, rozevírací seznam RM s vyhledavanim a tlacitkem pro reset
- snizeni vysky radku v tabulce

## v2.7.0 - 16.06.2026 08:56
- Filialky: testovaci zalozka s badge filtry LC/VT/RM
- pevna vyska section-bar 58px
- portal dropdown pro RM

## v2.6.0 - 16.06.2026 07:27
- Tabulky: mensi okraje sekci, modra hlavicka s bilym textem, nizsi radky, bily oddelovac sloupcu v hlavicce
- Filialky: prejmenovani RM, novy sloupec VT (area_manager)

## v2.5.5 - 15.06.2026 13:12
- Weather tooltip: bile pozadi s tmavym textem misto modre - lepsi kontrast vuci hero liste

## v2.5.4 - 15.06.2026 12:57
- Tlacitko Vymazat cache v Nastaveni
- po primych upravach v DB sheetu se zmeny projevi okamzite

## v2.5.3 - 15.06.2026 12:49
- Poradi aplikaci: vlozeni na konkretni pozici posune ostatni aplikace o 1 nahoru

## v2.5.2 - 15.06.2026 12:43
- Odstraneni modre uvodni obrazovky pri mazani a ukladani aplikaci - vsechna Ui.call volani maji silent:true

## v2.5.1 - 15.06.2026 11:11
- Oprava zavreni modal okna pri oznacovani textu - modal se zavre jen kdyz mousedown i click probehl na pozadi

## v2.5.0 - 15.06.2026 11:00
- Moduly v priprave: ikona hodin misto ikony aplikace, srafovani na barvene lište, pulzovani, vyraznejsi badge

## v2.4.9 - 15.06.2026 10:43
- Spinner: odstranena druha cara, zpomaleni na 2s, pruzny efekt (rychle vyskoci, drzi se, rychle sklapne)

## v2.4.8 - 15.06.2026 10:38
- Vylepseny spinner: dychajici oblouk + protismerny tenky oblouk + glow efekt

## v2.4.7 - 15.06.2026 10:29
- Oprava spinneru pri synchronizaci - pozadi zustava dashboard misto modre obrazovky

## v2.4.6 - 15.06.2026 10:25
- Spinner pri synchronizaci
- vetsi modal okno pro prehled zmen filialek (modal-large)

## v2.4.5 - 15.06.2026 10:19
- Tlacitka (zvonecek, sync, obnovit) presunuta do radku pocasi zarovnana vpravo
- sync upozorneni otevre modal se seznamem zmen pro vsechny uzivatele
- po zavreni modalu zvonecek zmizi

## v2.4.4 - 15.06.2026 10:09
- Spinner na tlacitku syncu na dashboardu
- ikona upozorneni po dokonceni syncu se zmenami
- oprava falesnych zmen hodin (normalizace formatu h:mm)

## v2.4.3 - 15.06.2026 10:02
- Tlacitko sync filialek na dashboardu (admin only)
- po dokonceni zobrazi toast se souhrnem zmen a obnovi home data

## v2.4.2 - 15.06.2026 09:54
- Oprava porovnani kodov filialek pri synchronizaci (typovy nesoulad string/number)
- Detail zmen ve vysledku syncu
- Docasny debug vystup pro diagnostiku

## v2.4.1 - 12.06.2026 15:50
- Optimalizace layoutu modalniho okna pro upravu aplikaci bez nutnosti scrollovani

## v2.4.0 - 12.06.2026 15:20
- Uzivatelska opravneni k subaplikacim (allowed_apps override)
- Checklist subaplikaci v detailu uzivatele

## v2.3.1 - 12.06.2026 13:33
- Oprava chyby pri prvotnim nacteni role_permissions a robustnejsi klientsky init

## v2.3.0 - 12.06.2026 13:20
- Vizualni matice roli a opravneni v administraci
- Subaplikace routovani a opravneni

## v2.2.0 - 12.06.2026 13:08
- Implementace RBAC
- opravneni Ctenar/Editor
- lokalni datove zabezpeceni LC/HQ

## v2.1.43 â€“ 11.06.2026 11:57
- Home: oprava duplikace LC chipĹŻ, LC zarovnĂˇny na stĹ™ed, moduly min-height 130px, activity Ĺ™Ăˇdky 30px + barevnĂ© ikony

## v2.1.42 â€“ 11.06.2026 11:53
- Spinner: krouĹľek 100px (byl 56px), logo 48px, busy-box bĂ­lĂˇ karta se stĂ­nem, plynulejĹˇĂ­ animace arc

## v2.1.41 â€“ 11.06.2026 11:47
- PoÄŤasĂ­: zobrazenĂ­ pro kaĹľdĂ© aktivnĂ­ LC (Open-Meteo geocoding + weather)
- poslednĂ­ nĂˇvĹˇtÄ›va zarovnĂˇna vpravo

## v2.1.40 â€“ 11.06.2026 11:41
- PoÄŤasĂ­: nahrazena GPS geolokace IP geolokacĂ­ (ipapi.co) â€” funguje bez oprĂˇvnÄ›nĂ­ prohlĂ­ĹľeÄŤe

## v2.1.39 â€“ 11.06.2026 11:36
- PoÄŤasĂ­: diagnostickĂ˝ reĹľim â€” chip vĹľdy viditelnĂ˝ se stavem (zjiĹˇĹĄuji polohu / pĹ™Ă­stup odepĹ™en / timeout / souĹ™adnice)

## v2.1.38 â€“ 11.06.2026 11:30
- Moduly: stavovĂ© ikony â€” hodiny (v pĹ™Ă­pravÄ›) a zĂˇmek (nedostupnĂ©) v pravĂ©m hornĂ­m rohu karty

## v2.1.37 â€“ 11.06.2026 11:28
- Home: moduly vyĹˇĹˇĂ­ (padding 16/14px), hero kompaktnÄ›jĹˇĂ­ (12px), hover border na modulech (modrĂ˝ outline + shadow)

## v2.1.36 â€“ 11.06.2026 11:25
- PoÄŤasĂ­: reverse geocoding pĹ™es Nominatim â€” zobrazĂ­ nĂˇzev mÄ›sta z detekovanĂ© polohy
- fallback Praha s popiskem

## v2.1.35 â€“ 11.06.2026 11:21
- Home: infobar pĹ™esunut do hero jako spodnĂ­ pruh (pill chipy)
- poÄŤasĂ­ Praha fallback kdyĹľ geolokace selĹľe

## v2.1.34 â€“ 11.06.2026 09:56
- Home: svĂˇtek/poÄŤasĂ­/nĂˇvĹˇtÄ›va v infobaru hero
- moduly menĹˇĂ­ + stavovĂ© tĹ™Ă­dy (available/coming/inactive) + hover animace
- geolokace bez fallbacku

## v2.1.33 â€“ 11.06.2026 09:48
- Home: 3 novĂ© moduly â€” SvĂˇtek dne (statickĂ˝ JS kalendĂˇĹ™), PoÄŤasĂ­ (Open-Meteo + geolokace), PoslednĂ­ nĂˇvĹˇtÄ›va (DB last_visit_at)

## v2.1.32 â€“ 11.06.2026 00:09
- UI: section-bar layout pro vĹˇechny zĂˇloĹľky, sort/filter na sloupcĂ­ch tabulek, Lidl ikony (SVG sprite), filiĂˇlky: deaktivace tlaÄŤĂ­tkem, manually_inactive pĹ™es sync

## v2.1.31 â€“ 10.06.2026 23:21
- Home: vĹˇechny moduly v designu boÄŤnĂ­ho pruhu s barevnĂ˝mi variantami
- globĂˇlnĂ­ busy overlay s rozmazĂˇnĂ­m a popisem akce u vĹˇech naÄŤĂ­tĂˇnĂ­

## v2.1.30 â€“ 10.06.2026 23:09
- Home: hero dvouĹ™ĂˇdkovĂˇ pravĂˇ strana, activity panel u spodnĂ­ho okraje, 6 novĂ˝ch designĹŻ modulĹŻ (boÄŤnĂ­ pruh, kruh, zĂˇvorky, diagonĂˇla, vstupenka, typo)

## v2.1.29 â€“ 10.06.2026 22:55
- Home: kompaktnĂ­ hero s ÄŤĂ­slem tĂ˝dne, 6 rozdĂ­lnĂ˝ch designĹŻ modulĹŻ (ÄŤtverce), kompaktnĂ­ activity panel, stat karta s poÄŤtem uĹľivatelĹŻ

## v2.1.28 â€“ 10.06.2026 22:39
- Home: footer fix, hero top-left + status, vokativ, 6 module designĹŻ, activity scroll nav, tooltip overflow fix, hover lift odstranÄ›n

## v2.1.27 â€“ 10.06.2026 22:11
- Home: redesign â€” odstranÄ›n topbar, hero s varovĂˇnĂ­m (bell/badge/tooltip), modul grid 6 sloupcĹŻ, activity list, changelog modal
- Sidebar: email uĹľivatele

## v2.1.26 â€“ 10.06.2026 21:44
- Wizard: sync krok skrytĂ˝ pĹ™i prĂˇzdnĂ© URL
- odstranÄ›n vĂ˝chozĂ­ podtitul 'WebovĂˇ aplikace'

## v2.1.25 â€“ 10.06.2026 21:37
- Wizard: DokonÄŤuji vĹľdy poslednĂ­ krok, sync krok jen pĹ™i potvrzenĂ©m pĹ™Ă­stupu ke sloĹľce

## v2.1.24 â€“ 10.06.2026 21:32
- Wizard: krok naÄŤĂ­tĂˇnĂ­ filiĂˇlek v progress panelu (zobrazĂ­ se jen pĹ™i potvrzenĂ©m pĹ™Ă­stupu ke sloĹľce)

## v2.1.23 â€“ 10.06.2026 21:27
- Wizard: oprava poĹ™adĂ­ volĂˇnĂ­ - disabled se nastavuje aĹľ po setButtonLoading

## v2.1.22 â€“ 10.06.2026 21:22
- Wizard: tlaÄŤĂ­tko PokraÄŤovat v kroku 1 aktivnĂ­ aĹľ po naÄŤtenĂ­ emailu superadmina

## v2.1.21 â€“ 10.06.2026 21:15
- Wizard: status pĹ™Ă­stupu ve ĹˇtĂ­tku pole, prvnĂ­ sync po init
- Home: varovĂˇnĂ­ o chybÄ›jĂ­cĂ­ konfiguraci

## v2.1.20 â€“ 10.06.2026 21:04
- Wizard: pĹ™edvyplnÄ›nĂˇ URL sync sloĹľky, automatickĂˇ kontrola pĹ™Ă­stupu ke sloĹľce

## v2.1.19 â€“ 10.06.2026 21:00
- Wizard: chyba validace jako placeholder v poli (zmizĂ­ po 3s), ĹľĂˇdnĂˇ zmÄ›na velikosti okna

## v2.1.18 â€“ 10.06.2026 20:56
- Wizard: validace povinnĂ˝ch polĂ­ bez zvÄ›tĹˇenĂ­ okna, ÄŤervenĂ© ohraniÄŤenĂ­ pĹ™i chybÄ›

## v2.1.17 â€“ 10.06.2026 20:52
- Wizard krok 2: ikony u polĂ­, oprava podtitulu (placeholder), lepĹˇĂ­ validace povinnĂ˝ch polĂ­, hint sync sloĹľky

## v2.1.16 â€“ 10.06.2026 17:29
- DB: dbDeserialize_ pĹ™evĂˇdĂ­ Date objekty na string pĹ™i ÄŤtenĂ­ (oprava ÄŤasovĂ˝ch hodnot)

## v2.1.15 â€“ 10.06.2026 17:22
- Debug: tlaÄŤĂ­tko a funkce apiDebugStores pro diagnostiku naÄŤĂ­tĂˇnĂ­ filiĂˇlek

## v2.1.14 â€“ 10.06.2026 17:19
- DB schema logistics: odstranÄ›n sloupec synced_at (LC se nesynchronizujĂ­)

## v2.1.13 â€“ 10.06.2026 17:17
- Sync: oprava formĂˇtu ÄŤasovĂ˝ch bunÄ›k z xlsx (Dateâ†’H:mm string)

## v2.1.12 â€“ 10.06.2026 17:13
- LC modal: placeholdery BNL/BrandĂ˝s
- placeholder barva svÄ›tle ĹˇedĂˇ globĂˇlnÄ›

## v2.1.11 â€“ 10.06.2026 17:05
- Sync: odstranÄ›na synchronizace LC z xlsx (LC se zaklĂˇdajĂ­ ruÄŤnÄ›)

## v2.1.10 â€“ 10.06.2026 17:01
- Sync: doÄŤasnĂ˝ Sheet se vytvoĹ™Ă­ ve sloĹľce skriptu, ne v koĹ™eni Disku

## v2.1.9 â€“ 10.06.2026 16:57
- Sync: konverze .xlsx na doÄŤasnĂ˝ Google Sheet pĹ™ed ÄŤtenĂ­m (Drive Advanced Service)

## v2.1.8 â€“ 10.06.2026 16:37
- Wizard: NĂˇzev a Podtitul vedle sebe v kroku 2 (form-row-2)

## v2.1.7 â€“ 10.06.2026 16:24
- SĂ­ĹĄ filiĂˇlek a log. center: CRUD, sync z xlsx
- wizard: pole sync sloĹľky
- CSS: modal-wide, form-hint, is-muted

## v2.1.6 â€“ 10.06.2026 14:45
- Redesign ĂşvodnĂ­ strĂˇnky: hero uvĂ­tacĂ­ banner s pozdravem a datem, oddÄ›lenĂ© status karty se stĂ­nem, zaoblenĂ© ikony, hover efekt na module kartĂˇch

## v2.1.5 â€“ 10.06.2026 14:32
- Wizard UX: symetrickĂ© kroky se spojovacĂ­ ÄŤarou, pĹ™echody mezi kroky, konstantnĂ­ vĂ˝Ĺˇka, progress panel pĹ™i inicializaci, loading na Spustit aplikaci

## v2.1.4 â€“ 10.06.2026 14:17
- Oprava naÄŤĂ­tĂˇnĂ­ brandu (APP_BOOTSTRAP pĹ™ed view includes)
- rastr na loader obrazovce
- skrytĂ­ loaderu pĹ™i navigaci menu
- SVG ikony v status kartĂˇch

## v2.1.3 â€“ 10.06.2026 14:00
- JmĂ©no a pĹ™Ă­jmenĂ­ vedle sebe i ve wizardu (form-row-2)

## v2.1.2 â€“ 10.06.2026 13:57
- JmĂ©no a pĹ™Ă­jmenĂ­ vedle sebe v modalu â€” CSS tĹ™Ă­da form-row-2

## v2.1.1 â€“ 10.06.2026 13:55
- JmĂ©no a pĹ™Ă­jmenĂ­ vedle sebe v modalu uĹľivatele

## v2.1.0 â€“ 10.06.2026 13:53
- Spustit aplikaci naviguje pĹ™es appUrl ze serveru
- jmĂ©no/pĹ™Ă­jmenĂ­ jako samostatnĂˇ pole v DB a UI
- rastr vĹľdy viditelnĂ˝ (padding 48px)
- userDisplayName_ helper

## v2.0.9 â€“ 10.06.2026 13:44
- Auth uĹľivatele pĹ™esunuta do klienta pĹ™es apiGetCurrentUser
- doGet uĹľ neĹ™eĹˇĂ­ identitu (getActiveUser nefunguje v doGet kontextu)

## v2.0.8 â€“ 10.06.2026 13:38
- isSetupDone_ ovÄ›Ĺ™uje existenci spreadsheetu
- pĹ™i smazĂˇnĂ­ DB se property automaticky vyÄŤistĂ­ a spustĂ­ se wizard

## v2.0.7 â€“ 10.06.2026 13:35
- Oprava auth: access DOMAIN (fix doGet, reload po wizardu, naÄŤtenĂ­ uĹľivatele)
- jemnÄ›jĹˇĂ­ rastr pozadĂ­

## v2.0.6 â€“ 10.06.2026 13:33
- Oprava auth: access ANYONE_WITH_GOOGLE_LINK (fix doGet, reload po wizardu, naÄŤtenĂ­ uĹľivatele)
- jemnÄ›jĹˇĂ­ rastr pozadĂ­

## v2.0.5 â€“ 10.06.2026 13:23
- SloĹľka skriptu naÄŤĂ­tĂˇna pĹ™es google.script.run (stejnĂ˝ fix jako email)

## v2.0.4 â€“ 10.06.2026 13:19
- Email ve wizardu naÄŤĂ­tĂˇn pĹ™es google.script.run mĂ­sto doGet bootstrapu

## v2.0.3 â€“ 10.06.2026 13:17
- Debug panel pro diagnostiku emailu ve wizardu

## v2.0.2 â€“ 10.06.2026 13:12
- Oprava centrovĂˇnĂ­ ikon ve wizardu (CSS specifiÄŤnost info-row span)
- email pĹ™es getEffectiveUser() jako primĂˇrnĂ­ zdroj

## v2.0.1 â€“ 10.06.2026 13:08
- Oprava zjiĹˇĹĄovĂˇnĂ­ emailu ve wizardu (fallback na getEffectiveUser)
- vycentrovĂˇnĂ­ ikon
- bodovĂ˝ rastr na pozadĂ­

## v2.0.0 â€“ 10.06.2026 12:55
- KompletnĂ­ pĹ™epracovĂˇnĂ­ Ĺˇablony: ĂşvodnĂ­ prĹŻvodce (superadmin + databĂˇze ve sloĹľce skriptu), role a oprĂˇvnÄ›nĂ­ pĹ™es list _users, DB vrstva nad Sheets, administrace (uĹľivatelĂ©, nastavenĂ­, audit), jednotnĂˇ odpovÄ›dnĂ­ obĂˇlka API.
