@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   StarMarket - Git Push Script
echo ========================================
echo.

:: Переходим в директорию скрипта
cd /d "%~dp0"

echo [1/5] Checking git repository...
if not exist ".git" (
    echo ERROR: Not a git repository!
    echo Please initialize git first:
    echo   git init
    echo   git remote add origin YOUR_GITHUB_URL
    pause
    exit /b 1
)

echo [2/5] Checking git status...
git status
echo.

echo [3/5] Adding all files...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo [4/5] Committing changes...
git commit -m "Security fixes and documentation update - v2.0.0"
if errorlevel 1 (
    echo WARNING: Nothing to commit or commit failed
    echo This might be OK if there are no changes
)

echo [5/5] Pushing to GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo Trying 'master' branch instead...
    git push origin master
    if errorlevel 1 (
        echo.
        echo ERROR: Push failed!
        echo.
        echo Possible reasons:
        echo   1. No remote repository configured
        echo   2. Authentication failed
        echo   3. Branch name is different
        echo.
        echo Try manually:
        echo   git remote -v
        echo   git branch
        echo   git push origin YOUR_BRANCH_NAME
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Next steps:
echo   1. Check GitHub repository
echo   2. Replace compromised keys (see SETUP_AFTER_SECURITY_FIX.md)
echo   3. Configure Vercel environment variables
echo   4. Redeploy project
echo.
pause
