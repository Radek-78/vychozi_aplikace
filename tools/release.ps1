<#
.SYNOPSIS
  Vydani nove verze aplikace.

.DESCRIPTION
  Provede cely release v jednom kroku:
    1. zmeni cislo verze v server/00_config.js,
    2. zapise zaznam s datem a casem do CHANGELOG.md,
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

# 1) Cislo verze ve footeru (CONFIG.version)
$configPath = Join-Path $root 'server\00_config.js'
$config = Get-Content $configPath -Raw
if ($config -match [regex]::Escape("version: '$Version'")) {
  throw "Verze $Version uz je v konfiguraci nastavena - zvol vyssi cislo."
}
$config = $config -replace "version: 'v[^']*'", "version: '$Version'"
Set-Content $configPath $config -NoNewline -Encoding UTF8

# 2) Zaznam v changelogu s datem a casem
$stamp = Get-Date -Format 'dd.MM.yyyy HH:mm'
$bullets = ($Message -split ';') | ForEach-Object { "- $($_.Trim())" } | Where-Object { $_ -ne '- ' }
$changelogPath = Join-Path $root 'CHANGELOG.md'
$lines = Get-Content $changelogPath
$updated = @($lines[0], '', "## $Version - $stamp") + $bullets + $lines[1..($lines.Count - 1)]
Set-Content $changelogPath $updated -Encoding UTF8

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
