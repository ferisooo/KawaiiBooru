@echo off
setlocal
title KawaiiBooru - Update
cd /d "%~dp0"

REM --- where to pull the latest version from ---
set "REPO_URL=https://github.com/ferisooo/KawaiiBooru.git"
set "BRANCH=main"

echo.
echo   =======================================
echo      KawaiiBooru - updating... (^o^)
echo   =======================================
echo.
echo   This will FORCE-PULL the latest version from the %BRANCH% branch
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

REM --- if this isn't a git clone yet (e.g. downloaded as a ZIP), turn it into
REM     one in place so we can pull. Nothing is moved or re-downloaded. ---
if not exist ".git\" (
  echo.
  echo   No git history here ^(looks like a ZIP download^) - setting it up...
  git init -q
  if errorlevel 1 (
    echo   [!] Couldn't initialise git in this folder.
    pause
    exit /b 1
  )
  git remote add origin "%REPO_URL%" 2>nul
  if errorlevel 1 git remote set-url origin "%REPO_URL%"
)

REM --- make sure the remote points where we expect ---
git remote get-url origin >nul 2>nul
if errorlevel 1 git remote add origin "%REPO_URL%"

echo.
echo   Fetching latest from origin/%BRANCH%...
git fetch origin %BRANCH%
if errorlevel 1 (
  echo.
  echo   [!] Couldn't reach the server. Check your internet connection.
  echo.
  pause
  exit /b 1
)

echo   Resetting this folder to match origin/%BRANCH%...
git reset --hard origin/%BRANCH%
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
