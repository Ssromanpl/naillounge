@echo off
chcp 65001 >nul 2>nul
cd /d "%~dp0"
cls

where node >nul 2>nul
if errorlevel 1 goto no_node

node tools\serve-phone.mjs
if errorlevel 1 goto failed

echo.
pause
exit /b 0

:no_node
echo.
echo   Node.js is not installed - see START-EDITOR-WINDOWS.bat first.
echo.
pause
exit /b 1

:failed
echo.
echo   Could not start. The message is printed above.
echo.
pause
exit /b 1
