Set objShell = CreateObject("WScript.Shell")

' Jalankan NPM di latar belakang (angka 0 berarti jendela CMD disembunyikan)
objShell.Run "cmd /c npm run dev", 0, False

' Tunggu sekitar 3 detik agar server Node.js / Vite siap berjalan
WScript.Sleep 3000

' Buka otomatis browser ke alamat lokal aplikasi
objShell.Run "http://localhost:5173"

' Tampilkan pesan informasi kepada pengguna
MsgBox "Sistem Informasi Manajemen Kartu Ujian (SIMKU) sedang berjalan di latar belakang!" & vbCrLf & vbCrLf & "Aplikasi sudah dibuka di browser Anda." & vbCrLf & vbCrLf & "Catatan:" & vbCrLf & "- Anda bisa menutup browser jika sudah selesai." & vbCrLf & "- Jendela hitam (CMD) tidak akan muncul lagi." & vbCrLf & "- Untuk benar-benar mematikan server aplikasi ini, silakan klik ganda pada file 'Hentikan_SIMKU.bat'.", 64, "SIMKU Berjalan"
