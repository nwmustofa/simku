@echo off
title Pembuat Installer SIMKU
color 0a

:: Perbaikan Darurat: Menambahkan lokasi PowerShell ke jalur sistem sementara
:: Ini akan mengatasi error "spawn powershell.exe ENOENT"
set PATH=%PATH%;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32;C:\Windows

echo =======================================================
echo     MEMBUAT INSTALLER (.EXE) UNTUK APLIKASI SIMKU
echo =======================================================
echo.
echo Langkah 1/3: Mengunduh komponen pembuat installer (Electron)...
echo Proses ini membutuhkan koneksi internet dan waktu beberapa menit.
call npm install electron electron-builder --save-dev

echo.
echo Langkah 2/3: Membangun aset web SIMKU...
call npm run build

echo.
echo Langkah 3/3: Mengemas menjadi file Installer (Setup.exe)...
call npm run build:exe

echo.
echo =======================================================
echo                     SELESAI!
echo =======================================================
echo Silakan buka folder "dist_installer" di dalam folder SIMKU Anda.
echo Anda akan menemukan file "Aplikasi SIMKU Setup 1.0.0.exe".
echo File inilah yang bisa Anda salin ke Flashdisk dan install di 
echo PC/Laptop lain dengan sangat mudah!
echo =======================================================
pause
