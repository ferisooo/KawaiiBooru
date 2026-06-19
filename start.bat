@echo off
setlocal
title KawaiiBooru
cd /d "%~dp0"

REM --- the real culprit: clear skip flags for this session ---
set "ELECTRON_SKIP_BINARY_DOWNLOAD="
set "ELECTRON_SKIP_BINARY="
set "npm_config_ignore_scripts="

echo.
echo   =======================================
echo      KawaiiBooru - starting up... (^o^)
echo   =======================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   [!] Node.js not found. Install it from https://nodejs.org first.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo   First launch - installing packages, one moment...
  echo.
  call npm install
)

REM --- verify the Electron BINARY actually downloaded ---
if not exist "node_modules\electron\path.txt" (
  echo.
  echo   Fetching Electron binary ^(skip-flag now cleared^)...
  echo.
  call node "node_modules\electron\install.js"
)

REM --- backup: download the binary directly with PowerShell ---
if not exist "node_modules\electron\path.txt" (
  echo.
  echo   Installer still skipped it - grabbing binary directly...
  echo.
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; try { $v=(Get-Content 'node_modules\electron\package.json' -Raw | ConvertFrom-Json).version; $url='https://github.com/electron/electron/releases/download/v'+$v+'/electron-v'+$v+'-win32-x64.zip'; Write-Host ('  -> '+$url); Invoke-WebRequest $url -OutFile 'electron.zip'; if(!(Test-Path 'node_modules\electron\dist')){New-Item -ItemType Directory 'node_modules\electron\dist' | Out-Null}; Expand-Archive 'electron.zip' -DestinationPath 'node_modules\electron\dist' -Force; 'electron.exe' | Out-File -Encoding ascii -NoNewline 'node_modules\electron\path.txt'; Remove-Item 'electron.zip'; Write-Host '  -> done' } catch { Write-Host ('  [!] '+$_.Exception.Message) }"
)

REM --- last resort: clean reinstall ---
if not exist "node_modules\electron\path.txt" (
  echo.
  echo   Still missing - doing a clean reinstall...
  echo.
  rmdir /s /q node_modules
  call npm install
)

if not exist "node_modules\electron\path.txt" (
  echo.
  echo   [!] Electron still won't download. Your network or antivirus is
  echo       likely blocking github.com. Try a VPN, or run this by hand:
  echo           node node_modules\electron\install.js
  echo.
  pause
  exit /b 1
)

REM --- make sure the build tool is present (for older installs too) ---
if not exist "node_modules\esbuild\" (
  echo   Installing build tool...
  call npm install
)

REM --- compile the readable source (app.jsx) into app.js ON YOUR machine ---
REM    so you run exactly the code you can read. If it fails, the included
REM    app.js is used as a fallback.
echo   Building UI from source...
call npm run build

echo   Launching gallery...
call npm start

if errorlevel 1 (
  echo.
  echo   [!] The app exited with an error.
  pause
)
