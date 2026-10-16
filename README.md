# SIMKU (Sistem Informasi Manajemen Kartu Ujian)

<p align="center">
  <img src="icon.ico" alt="SIMKU Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Aplikasi Desktop Manajemen & Cetak Kartu Peserta Ujian Serta Nomor Bangku Siswa</strong><br>
  <em>Cepat, Ringan, Presisi, dan 100% Offline</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/Platform-Windows-0078D6.svg?logo=windows&logoColor=white" alt="Platform">
  <img src="https://img.shields.io/badge/Electron-Desktop-47848F.svg?logo=electron&logoColor=white" alt="Electron">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Dexie.js-IndexedDB-orange.svg" alt="Dexie.js">
</p>

---

## 📖 Tentang Aplikasi

**SIMKU (Sistem Informasi Manajemen Kartu Ujian)** adalah aplikasi desktop luring (*offline-first*) yang dirancang khusus untuk mempermudah Panitia Ujian Sekolah dalam mengelola data peserta, penataan ruang ujian, serta mencetak kartu peserta ujian dan kartu nomor bangku secara cepat, rapi, dan presisi.

Aplikasi ini mengutamakan kemudahan integrasi dengan data Dapodik (Excel), kecepatan upload foto siswa secara massal, serta keamanan privasi karena seluruh data (termasuk foto siswa dan tanda tangan) tersimpan secara lokal di komputer pengguna tanpa memerlukan koneksi internet maupun server eksternal seperti XAMPP.

---

## ✨ Fitur Unggulan

- 🔒 **100% Offline & Mandiri:**
  - Tidak membutuhkan koneksi internet maupun server web eksternal (Apache/XAMPP).
  - Seluruh data siswa, foto, logo, dan tanda tangan tersimpan aman di database lokal IndexedDB (Dexie.js).

- 📊 **Import Cepat Data Dapodik (Excel):**
  - Import data siswa sekaligus dengan deteksi kolom otomatis (Nama, NISN, Rombel/Kelas, Jenis Kelamin).
  - Penomoran peserta (001, 002, dst.) langsung otomatis terurut rapi berdasarkan Kelas dan Nama.

- 📸 **Upload Foto Massal (.zip):**
  - Upload seluruh foto siswa sekaligus dalam satu file `.zip`.
  - Sistem otomatis memetakan foto ke masing-masing siswa berdasarkan **NISN** sebagai nama file.

- 🏫 **Manajemen Ruang Ujian Fleksibel:**
  - Fitur satu klik: *Ruang = Kelas* (jika siswa menempati ruang belajar masing-masing).
  - Edit ruang langsung (*inline editing*) pada tabel per siswa.
  - Tombol reset untuk mengosongkan pembagian ruang ujian secara instan.

- 💳 **Validasi & Watermark SPP:**
  - Pemantauan status administrasi SPP (*Lunas* / *Terhutang*).
  - Kartu peserta siswa dengan status Terhutang otomatis tercetak dengan stempel watermark transparan **"DENGAN PERJANJIAN"**.

- 🖨️ **Tata Letak Cetak Kartu A4 Presisi (Grid 2x4):**
  - Ukuran kartu presisi: `9.5 cm x 6.8 cm` (Landscape).
  - Tata letak **8 kartu per lembar kertas A4** (2 kolom x 4 baris) yang pas tanpa terpotong ke halaman berikutnya.
  - Dilengkapi Kop Sekolah, Logo Sekolah, Foto Siswa, QR Code NISN, dan Tanda Tangan & Stempel Kepala Sekolah transparan.

- 🏷️ **Cetak Nomor Bangku Masal:**
  - Layout nomor bangku siap tempel di meja/bangku ujian dengan ukuran yang sama presisinya.
  - Menampilkan Kop Sekolah, Jenis Ujian, dan Nomor Peserta berukuran besar di bagian tengah kartu.

- 💾 **Backup & Restore Data Lokal:**
  - Ekspor seluruh database beserta semua foto siswa ke dalam satu file `.json`.
  - Kemudahan migrasi data saat berpindah laptop/komputer panitia.

---

## 🛠️ Teknologi yang Digunakan

- **Runtime & Desktop Wrapper:** [Electron](https://www.electronjs.org/)
- **Frontend Framework:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database Lokal:** [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [Dexie.js](https://dexie.org/)
- **Spreadsheet Engine:** [SheetJS (xlsx)](https://sheetjs.com/)
- **Archive Handler:** [JSZip](https://stuk.github.io/jszip/)
- **Icons & QR Code:** [Lucide React](https://lucide.dev/), [react-qr-code](https://github.com/rosskhanas/react-qr-code)
- **Packaging:** [electron-builder](https://www.electron.build/) (NSIS Windows Installer)

---

## 🚀 Memulai untuk Pengembangan (Development)

### Prasyarat
- [Node.js](https://nodejs.org/) (disarankan v18 ke atas)
- [Git](https://git-scm.com/)

### Langkah Instalasi

1. **Clone repository:**
   ```bash
   git clone https://github.com/nwmustofa/simku.git
   cd simku
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan aplikasi (Web Development mode):**
   ```bash
   npm run dev
   ```
   Aplikasi akan terbuka di browser pada alamat `http://localhost:5173`.

> **💡 Tips Cepat (Windows):**
> Anda juga dapat menggunakan file script siap pakai:
> - `setup.bat`: Menginstal dependensi dan menyalakan server otomatis.
> - `Mulai_SIMKU_Tersembunyi.vbs`: Menjalankan aplikasi di latar belakang tanpa jendela CMD hitam.
> - `Hentikan_SIMKU.bat`: Menghentikan server aplikasi di latar belakang.

---

## 📦 Membuat Installer Windows (.exe)

Untuk mem-build aplikasi menjadi file installer mandiri (`.exe`) yang siap dipasang di laptop/PC lain:

```bash
npm run build:exe
```
*(Atau cukup klik ganda file `Buat_Installer.bat`)*.

Hasil installer NSIS akan tersimpan di dalam folder `dist_installer/` dengan nama:
`Aplikasi SIMKU Setup 1.0.0.exe`

---

## 👨‍💻 Pengembang (Developer)

Dikembangkan dengan penuh dedikasi oleh:
**SIGIE Lab by Nur Wahid Mustofa**

### ☕ Dukung Pengembangan
Jika aplikasi ini bermanfaat dan membantu pekerjaan Anda di sekolah, Anda dapat mendukung pengembangan dan update fitur selanjutnya melalui:
👉 **[Traktir Kopi / Cendol di Trakteer](https://teer.id/nur_wahid_musthofa)**

---

## 📄 Lisensi

Didistribusikan di bawah lisensi ISC / MIT. Silakan gunakan dan kembangkan untuk kemajuan pendidikan.
