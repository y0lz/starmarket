@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   Git Push Script - StarMarket
echo ========================================
echo.

echo Checking git status...
git status
echo.

echo Adding all files...
git add .
echo.

echo Committing changes...
git commit -m "Security fixes and documentation update - v2.0.0"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ========================================
echo   Done! Check GitHub for updates
echo ========================================
pause
