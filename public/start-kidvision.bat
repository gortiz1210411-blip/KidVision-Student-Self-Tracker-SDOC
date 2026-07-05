@echo off
title KidVision Student App
color 1F

set "APP_ENTRY=KidVision_Local_App_Windows_v13_vocab\index.html"
set "APP_URL=http://localhost:8765/%APP_ENTRY%"

echo.
echo   ========================================
echo       KidVision Student App
echo   ========================================
echo.

:: Get the folder where this batch file lives
set "APPDIR=%~dp0"

:: Check that the packaged app exists
if not exist "%APPDIR%%APP_ENTRY%" (
    color 4F
    echo   ERROR: %APP_ENTRY% was not found!
    echo.
    echo   Make sure the packaged app folder is in the SAME
    echo   folder as this batch file.
    echo.
    pause
    exit /b 1
)

:: Check for the server script
if not exist "%APPDIR%kidvision-server.ps1" (
    color 4F
    echo   ERROR: kidvision-server.ps1 was not found!
    echo.
    echo   Make sure kidvision-server.ps1 is in the
    echo   SAME folder as this batch file.
    echo.
    pause
    exit /b 1
)

echo   Starting local server...
echo.

:: Start the PowerShell server in a minimized window
start /min "KidVision Server" powershell -ExecutionPolicy Bypass -NoProfile -File "%APPDIR%kidvision-server.ps1"

:: Wait for server to start
timeout /t 3 /nobreak >nul

:: Open KidVision in the default browser (Edge)
start "" "%APP_URL%"

echo   KidVision is running in your browser!
echo.
echo   If it didn't open automatically, open Edge
echo   and go to: %APP_URL%
echo.
echo   ========================================
echo      KEEP THIS WINDOW OPEN while students
echo      are using KidVision.
echo.
echo      Press any key to STOP the server.
echo   ========================================
echo.
pause >nul

:: When teacher presses a key, kill the server
echo.
echo   Shutting down server...
taskkill /fi "WINDOWTITLE eq KidVision Server*" /f >nul 2>nul
echo   Done! You can close this window.
timeout /t 2 /nobreak >nul
