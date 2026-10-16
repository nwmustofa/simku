@echo off
echo ===================================================
echo Menginstal dependensi aplikasi SIMKU...
echo ===================================================
call npm install
echo.
echo ===================================================
echo Menjalankan aplikasi secara lokal...
echo ===================================================
call npm run dev
pause
