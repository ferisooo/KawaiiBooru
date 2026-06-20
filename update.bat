@echo off
setlocal
title KawaiiBooru - Update
cd /d "%~dp0"

echo.
echo   =======================================
echo      KawaiiBooru - updating... (^o^)
echo   =======================================
echo.
echo   This will FORCE-PULL the latest version from the main branch
echo   and OVERWRITE every change in this folder:
echo.
echo       "%~dp0"
echo.
echo   Anything you edited here will be lost. Your saved login
echo   (auth.json) and downloaded packages (node_modules) are kept.
echo.
set /p "ok=  Continue? (Y/N) "
if /i not "%ok%"=="Y" (
  echo.
  echo   Cancelled. Nothing was changed.
  echo.
  pause
  exit /b 0
)

where git >nul 2>nul
if errorlevel 1 (
  echo.
  echo   [!] Git not found. Install it from https://git-scm.com first.
  echo.
  pause
  exit /b 1
)

REM --- make sure we're inside a git clone ---
if not exist ".git\" (
  echo.
  echo   [!] This folder isn't a git clone, so there's nothing to pull.
  echo       Re-download KawaiiBooru with:  git clone ^<repo-url^>
  echo.
  pause
  exit /b 1
)

echo.
echo   Fetching latest from origin/main...
git fetch origin main
if errorlevel 1 (
  echo.
  echo   [!] Couldn't reach the server. Check your internet connection.
  echo.
  pause
  exit /b 1
)

echo   Resetting this folder to match origin/main...
git reset --hard origin/main
if errorlevel 1 (
  echo.
  echo   [!] Reset failed.
  echo.
  pause
  exit /b 1
)

echo   Removing leftover files not tracked by git...
REM    -d folders, -f force, -x also nuke ignored files BUT keep the two
REM    things you actually want to survive an update.
git clean -dfx -e node_modules -e auth.json

echo.
echo   =======================================
echo      Update complete! You're on the latest. (^_^)
echo   =======================================
echo.
pause
