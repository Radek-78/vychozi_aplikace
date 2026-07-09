<#
.SYNOPSIS
  Vydani nove verze aplikace.

.DESCRIPTION
  Provede cely release v jednom kroku:
    1. zmeni cislo verze a datum vydani v server/00_config.js (zobrazuje se i na splashscreenu),
    2. zapise zaznam s datem a casem do CHANGELOG.md,
    2b. z CHANGELOG.md vygeneruje server/changelog.js (modal "Historie zmen" v aplikaci) -
        CHANGELOG.md je jediny rucne udrzovany zdroj, changelog.js se needituje rucne,
    3. nahraje soubory do Apps Scriptu (clasp push),
    4. provede git commit, tag verze a push na GitHub.

.EXAMPLE
  .\tools\release.ps1 -Version v2.1.0 -Message "Pridan modul exportu; oprava ukladani nastaveni"
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Version,

  [Parameter(Mandatory = $true)]
  [string]$Message
)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

if ($Version -notmatch '^v\d+\.\d+\.\d+$') {
  throw "Verze musi mit tvar vX.Y.Z (napriklad v2.1.0)."
}

# 1) Cislo verze a datum vydani (CONFIG.version / CONFIG.releaseDate) - zobrazuje se na splashscreenu
$configPath = Join-Path $root 'server\00_config.js'
$config = Get-Content $configPath -Raw
if ($config -match [regex]::Escape("version: '$Version'")) {
  throw "Verze $Version uz je v konfiguraci nastavena - zvol vyssi cislo."
}
$releaseDate = Get-Date -Format 'd.M.yyyy'
$config = $config -replace "version: 'v[^']*'", "version: '$Version'"
$config = $config -replace "releaseDate: '[^']*'", "releaseDate: '$releaseDate'"
Set-Content $configPath $config -NoNewline -Encoding UTF8

# 2) Zaznam v changelogu s datem a casem
$stamp = Get-Date -Format 'dd.MM.yyyy HH:mm'
$bullets = ($Message -split ';') | ForEach-Object { "- $($_.Trim())" } | Where-Object { $_ -ne '- ' }
$changelogPath = Join-Path $root 'CHANGELOG.md'
$lines = Get-Content $changelogPath
$updated = @($lines[0], '', "## $Version - $stamp") + $bullets + $lines[1..($lines.Count - 1)]
Set-Content $changelogPath $updated -Encoding UTF8

# 2b) server/changelog.js se generuje z CHANGELOG.md - needituj ho rucne.
# Zaznamy se spatne rozpoznatelnou hlavickou (napr. starsi poskozene kodovani)
# se do modalu v aplikaci nezahrnou, ale v CHANGELOG.md zustavaji beze zmeny.
$entries = @()
$curVersion = $null
$curDate = $null
$curBullets = @()
$flush = {
  if ($curVersion) {
    $script:entries += [PSCustomObject]@{ version = $curVersion; date = $curDate; message = ($curBullets -join '; ') }
  }
}
foreach ($line in $updated) {
  if ($line -match '^## (v\d+\.\d+\.\d+) - (\d{2})\.(\d{2})\.(\d{4})') {
    & $flush
    $curVersion = $Matches[1]
    $curDate = "$([int]$Matches[2]).$([int]$Matches[3]).$($Matches[4])"
    $curBullets = @()
  } elseif ($line -match '^## ') {
    & $flush
    $curVersion = $null
    $curBullets = @()
  } elseif ($curVersion -and $line -match '^- (.+)$') {
    $curBullets += $Matches[1].Trim()
  }
}
& $flush

$jsEntries = $entries | ForEach-Object {
  $msg = $_.message.Replace('\', '\\').Replace("'", "\'")
  "  { version: '$($_.version)', date: '$($_.date)', message: '$msg' },"
}
$changelogJsPath = Join-Path $root 'server\changelog.js'
$changelogJsLines = @(
  '/**',
  ' * Historie verzi aplikace -- zobrazuje se v modalu po kliknuti na cislo verze.',
  ' * Generovano automaticky skriptem tools/release.ps1 z CHANGELOG.md -- needituj rucne.',
  ' * Nejnovejsi verze prvni.',
  ' */',
  'const CHANGELOG = ['
) + $jsEntries + @(
  '];',
  '',
  'function apiGetChangelog() {',
  '  return guard_(ROLES.USER, () => CHANGELOG);',
  '}',
  ''
)
Set-Content $changelogJsPath $changelogJsLines -Encoding UTF8

Write-Host "Verze nastavena na $Version ($stamp)."

Push-Location $root
try {
  # 3) Nahranie do Apps Scriptu
  npx clasp push -f
  if ($LASTEXITCODE -ne 0) { throw "clasp push selhal - release prerusen (zmeny verze a changelogu jsou jen lokalni, zkontroluj je)." }

  # 4) Zaloha na GitHub
  git add -A
  git commit -m "${Version}: $Message"
  if ($LASTEXITCODE -ne 0) { throw "git commit selhal." }
  git tag $Version
  git push origin main --tags
  if ($LASTEXITCODE -ne 0) { throw "git push selhal - commit je vytvoren lokalne, push opakuj rucne." }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Release $Version dokoncen: clasp push + git push + tag."
