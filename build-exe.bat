@echo off
setlocal
title KawaiiBooru - build .exe
cd /d "%~dp0"

set "ELECTRON_SKIP_BINARY_DOWNLOAD="
set "ELECTRON_SKIP_BINARY="
set "npm_config_ignore_scripts="

echo.
echo   =========================================
echo      KawaiiBooru - building installer (.exe)
echo   =========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   [!] Node.js not found. Install it from https://nodejs.org first.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo   Installing base packages...
  echo.
  call npm install
)

REM --- electron-builder is only needed for packaging, so install on demand ---
if not exist "node_modules\electron-builder\" (
  echo   Installing the packaging tool ^(first time only, ~1-2 min^)...
  echo.
  call npm install --no-save electron-builder
  if errorlevel 1 (
    echo.
    echo   [!] Couldn't install electron-builder. Check your internet connection.
    pause
    exit /b 1
  )
)

echo   Compiling UI from source...
call npm run build

echo.
echo   Packaging into a Windows installer... ^(this can take a few minutes^)
echo.
call npx --no-install electron-builder --win

if errorlevel 1 (
  echo.
  echo   [!] Build failed. If it mentions a download being blocked, your
  echo       network/antivirus may be blocking github.com - try a VPN.
  echo.
  pause
  exit /b 1
)

echo.
echo   =========================================
echo      DONE! Your installer is in the  dist\  folder:
echo        dist\KawaiiBooru Setup 1.0.0.exe
echo   =========================================
echo.
echo   Hand that .exe to anyone - they double-click to install,
echo   no Node.js or terminal needed. ^(^o^)
echo.
pause
