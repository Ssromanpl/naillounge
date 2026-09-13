@echo off
chcp 65001 >nul 2>nul
cd /d "%~dp0"
cls

where node >nul 2>nul
if errorlevel 1 goto no_node

node tools\editor.mjs
if errorlevel 1 goto failed

echo.
pause
exit /b 0

:no_node
echo.
echo   Node.js is not installed - the editor cannot start.
echo.
echo   1. Open https://nodejs.org
echo   2. Click the big green LTS button and install it
echo   3. Restart the computer
echo   4. Run this file again
echo.
pause
exit /b 1

:failed
echo.
echo   The editor stopped with an error. The message is printed above.
echo   Send it to the developer if it is not clear.
echo.
pause
exit /b 1
