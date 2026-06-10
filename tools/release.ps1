<#
.SYNOPSIS
  Vydání nové verze aplikace.

.DESCRIPTION
  Provede celý release v jednom kroku:
    1. změní číslo verze v server/00_config.js (zobrazuje se ve footeru),
    2. zapíše záznam s datem a časem do CHANGELOG.md,
    3. nahraje soubory do Apps Scriptu (clasp push),
    4. provede git commit, tag verze a push na GitHub.

.EXAMPLE
  .\tools\release.ps1 -Version v2.1.0 -Message "Přidán modul exportů; oprava ukládání nastavení"
  (více položek changelogu odděl středníkem)
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
  throw "Verze musí mít tvar vX.Y.Z (například v2.1.0)."
}

# 1) Číslo verze ve footeru (CONFIG.version)
$configPath = Join-Path $root 'server\00_config.js'
$config = Get-Content $configPath -Raw
if ($config -match [regex]::Escape("version: '$Version'")) {
  throw "Verze $Version už je v konfiguraci nastavená — zvol vyšší číslo."
}
$config = $config -replace "version: 'v[^']*'", "version: '$Version'"
Set-Content $configPath $config -NoNewline -Encoding utf8NoBOM

# 2) Záznam v changelogu s datem a časem
$stamp = Get-Date -Format 'dd.MM.yyyy HH:mm'
$bullets = ($Message -split ';') | ForEach-Object { "- $($_.Trim())" } | Where-Object { $_ -ne '- ' }
$changelogPath = Join-Path $root 'CHANGELOG.md'
$lines = Get-Content $changelogPath
$updated = @($lines[0], '', "## $Version – $stamp") + $bullets + $lines[1..($lines.Count - 1)]
Set-Content $changelogPath $updated -Encoding utf8NoBOM

Write-Host "Verze nastavena na $Version ($stamp)."

Push-Location $root
try {
  # 3) Nahrání do Apps Scriptu
  npx clasp push -f
  if ($LASTEXITCODE -ne 0) { throw "clasp push selhal — release přerušen (změny verze a changelogu jsou jen lokální, zkontroluj je)." }

  # 4) Záloha na GitHub
  git add -A
  git commit -m "${Version}: $Message"
  if ($LASTEXITCODE -ne 0) { throw "git commit selhal." }
  git tag $Version
  git push origin main --tags
  if ($LASTEXITCODE -ne 0) { throw "git push selhal — commit je vytvořen lokálně, push opakuj ručně." }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Release $Version dokončen: clasp push + git push + tag."
