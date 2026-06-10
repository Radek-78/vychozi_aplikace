<#
.SYNOPSIS
  Vytvoří nový Apps Script projekt z této šablony.

.DESCRIPTION
  Zkopíruje šablonu do sousední složky, založí nový standalone Apps Script
  projekt (clasp create-script) a nahraje soubory (clasp push).
  Nový projekt pak stačí nasadit jako web app a otevřít — spustí se
  úvodní průvodce.

.EXAMPLE
  .\tools\new-project.ps1 -Name "Plánování akcí"
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$Name
)

$ErrorActionPreference = 'Stop'

$template = Split-Path $PSScriptRoot -Parent
$destination = Join-Path (Split-Path $template -Parent) $Name

if (Test-Path $destination) {
  throw "Složka už existuje: $destination"
}

# Kopie šablony bez vazby na původní skript a bez lokálních artefaktů
robocopy $template $destination /E /XD .claude node_modules vzhled /XF .clasp.json | Out-Null
if ($LASTEXITCODE -ge 8) {
  throw "Kopírování selhalo (robocopy kód $LASTEXITCODE)."
}

Set-Location $destination

npx clasp create-script --type standalone --title $Name --rootDir .
if ($LASTEXITCODE -ne 0) {
  throw "clasp create-script selhal — zkontroluj přihlášení (npx clasp login)."
}

npx clasp push -f
if ($LASTEXITCODE -ne 0) {
  throw "clasp push selhal."
}

# Lokální git repo pro zálohování (remote doplň podle nového GitHub repa)
git init -b main | Out-Null
git add -A
git commit -m "Založení projektu '$Name' ze šablony Výchozí aplikace 2.0" | Out-Null

Write-Host ""
Write-Host "Hotovo. Projekt '$Name' je v: $destination"
Write-Host "Další kroky:"
Write-Host "  1. npx clasp open-script   — otevře editor Apps Script"
Write-Host "  2. V editoru spusť TOOLS_presunSkriptDoSlozky (vlož ID cílové složky Drive)"
Write-Host "     — tím se skript zařadí do složky a zároveň odsouhlasíš oprávnění."
Write-Host "  3. Nasaď: Deploy -> New deployment -> Web app (Execute as: Me)"
Write-Host "  4. Otevři URL aplikace — spustí se úvodní průvodce (superadmin + databáze)."
Write-Host "  5. Založ GitHub repo a napoj ho: git remote add origin <url>; git push -u origin main"
Write-Host "  6. Vydávej přes .\tools\release.ps1 (verze, changelog, clasp + git push)."
