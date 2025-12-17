@echo off
REM Script batch pour mettre à jour automatiquement la date dans sitemap.xml
REM Utilise PowerShell en arrière-plan

powershell.exe -ExecutionPolicy Bypass -File "%~dp0update-sitemap.ps1"

pause
