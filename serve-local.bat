@echo off
echo ====================================
echo Iniciando SPFx con gulp serve ...
echo ====================================

REM Abre el workbench del sitio con parámetros de debug
start "" "https://conalec365.sharepoint.com/sites/CONALECTEAM/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/build/manifests.js"

REM Ejecuta gulp serve
gulp serve
