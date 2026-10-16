@echo off
title Hentikan Server SIMKU
color 0c
echo ===================================================
echo.
echo    MEMATIKAN SERVER SIMKU (LATAR BELAKANG)
echo.
echo ===================================================
echo.
echo Mencari dan menghentikan proses Node.js...
taskkill /F /IM node.exe >nul 2>&1

if %errorlevel% equ 0 (
    echo.
    echo [BERHASIL] Server SIMKU telah dimatikan sepenuhnya.
) else (
    echo.
    echo [INFO] Tidak ada server SIMKU yang sedang berjalan.
)

echo.
echo Silakan tutup jendela ini.
pause
