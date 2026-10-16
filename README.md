# 📋 SIMKU (Sistem Informasi Manajemen Kartu Ujian)

**SIMKU** adalah aplikasi manajemen kartu ujian sekolah berbasis desktop & offline-first. Aplikasi ini dirancang untuk memudahkan panitia ujian sekolah dalam mengelola data peserta, penomoran peserta otomatis, pembagian ruang ujian, hingga pencetakan kartu ujian dan nomor bangku yang presisi pada kertas A4.

---

## ✨ Fitur Utama

- **📂 Import Data Dapodik (Excel)**:
  - Mendukung import langsung file Excel/Dapodik (`.xlsx`, `.xls`, `.csv`).
  - Otomatis memetakan kolom Nama, NISN/NIS, Jenis Kelamin, dan Rombel/Kelas.

- **🔢 Penomoran Peserta Otomatis**:
  - Penomoran peserta (001, 002, dst.) otomatis disortir berdasarkan Kelas dan Nama saat data diimport.
  - Tersedia tombol *Re-urutkan No. Peserta* untuk merapikan urutan kapan saja.

- **📸 Upload Foto Massal (.zip)**:
  - Mendukung upload seluruh foto siswa sekaligus dalam satu file `.zip`.
  - Sistem otomatis mencocokkan foto dengan data siswa berdasarkan **NISN** sebagai nama file foto.

- **🏫 Manajemen Ruang Ujian Fleksibel**:
  - Fitur satu klik: *Ruang = Kelas* (jika siswa ujian di ruang kelasnya masing-masing).
  - Edit ruang langsung (*inline editing*) pada tabel per siswa.
  - Tombol reset ruang ujian untuk mengosongkan pembagian ruang secara cepat.

- **💳 Validasi & Watermark SPP**:
  - Status pembayaran SPP (*Lunas* / *Terhutang*).
  - Siswa dengan status Terhutang otomatis mendapatkan cap watermark transparan **"DENGAN PERJANJIAN"** pada kartu ujiannya.

- **🖨️ Cetak Kartu Peserta Ujian**:
  - Ukuran presisi: `9.5 cm x 6.8 cm` (Landscape).
  - Tata letak **Grid 2 Kolom x 4 Baris** yang muat pas **8 kartu per lembar kertas A4** tanpa terpotong.
  - Dilengkapi Kop Sekolah resmi, Logo Sekolah, Foto Siswa, QR Code NISN, dan Tanda Tangan & Stempel Kepala Sekolah.

- **🏷️ Cetak Nomor Bangku**:
  - Ukuran presisi yang sama dengan kartu peserta.
  - Menampilkan Kop Sekolah, Jenis Ujian, dan Nomor Peserta berukuran besar di bagian tengah kartu untuk ditempel pada meja/bangku ujian.

- **💾 100% Offline (IndexedDB via Dexie.js)**:
  - Tidak memerlukan koneksi internet maupun web server lokal seperti XAMPP/Apache.
  - Semua data dan gambar (foto siswa, logo, tanda tangan) tersimpan aman di penyimpanan lokal komputer pengguna.

- **📦 Backup & Restore Lokal**:
  - Ekspor seluruh data (termasuk semua gambar) ke dalam satu file `.json`.
  - Kemudahan restore kapan saja saat aplikasi dipindahkan ke komputer/laptop lain.

- **🖥️ Aplikasi Desktop Windows (.exe)**:
  - Dikemas menggunakan Electron sehingga dapat di-install dan dijalankan layaknya aplikasi native Windows.

---

## 🛠️ Teknologi yang Digunakan

- **Framework & UI**: [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Desktop Wrapper**: [Electron](https://www.electronjs.org/), [electron-builder](https://www.electron.build/)
- **Database Lokal**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) dengan wrapper [Dexie.js](https://dexie.org/)
- **Ikon & Komponen**: [Lucide React](https://lucide.dev/), [react-qr-code](https://github.com/rosskhanas/react-qr-code)
- **Pemrosesan File**: [SheetJS (xlsx)](https://sheetjs.com/), [JSZip](https://stuk.github.io/jszip/)

---

## 🚀 Panduan Memulai (Development)

### Prasyarat
- [Node.js](https://nodejs.org/) (Versi 18 LTS atau lebih baru disarankan)
- [Git](https://git-scm.com/)

### Instalasi & Menjalankan Aplikasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/nwmustofa/simku.git
   cd simku
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Web):**
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:5173`.

> **Catatan (Pengguna Windows):**
> Anda juga dapat menggunakan script siap pakai yang sudah disediakan:
> - `setup.bat`: Menginstal dependensi dan langsung menjalankan aplikasi.
> - `Mulai_SIMKU_Tersembunyi.vbs`: Menjalankan aplikasi di latar belakang tanpa jendela CMD hitam.
> - `Hentikan_SIMKU.bat`: Menghentikan server SIMKU yang berjalan di latar belakang.

---

## 📦 Membangun Paket Installer Windows (.exe)

Untuk membuat file installer mandiri agar dapat dipasang di komputer lain tanpa perlu menginstal Node.js:

1. Pastikan Anda memiliki koneksi internet untuk mengunduh paket Electron saat pertama kali build.
2. Jalankan perintah:
   ```bash
   npm run build:exe
   ```
   *(Atau cukup klik ganda file `Buat_Installer.bat`)*.
3. Setelah proses selesai, file installer akan tersedia di folder:
   ```
   dist_installer/Aplikasi SIMKU Setup 1.0.0.exe
   ```

---

## 📁 Struktur Folder Proyek

```
SIMKU/
├── dist/                      # Hasil kompilasi web statis
├── dist_installer/            # Hasil build installer Windows (.exe)
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx      # Halaman ringkasan statistik siswa & kartu
│   │   ├── Students.jsx       # Manajemen data siswa, import Excel, upload Zip, SPP
│   │   ├── PrintPreview.jsx   # Layout & cetak kartu peserta ujian
│   │   ├── PrintDesk.jsx      # Layout & cetak nomor bangku
│   │   └── Settings.jsx       # Pengaturan kop surat, logo, ttd, & backup/restore
│   ├── App.jsx                # Routing & Layout sidebar (HashRouter)
│   ├── db.js                  # Konfigurasi database Dexie.js (IndexedDB)
│   ├── index.css              # Styling Tailwind & CSS Grid print rules
│   └── main.jsx               # Titik masuk utama React
├── electron-main.cjs          # Skrip utama Electron untuk desktop window
├── package.json               # Konfigurasi dependensi dan electron-builder
├── vite.config.js             # Konfigurasi Vite
└── .gitignore                 # Konfigurasi pengecualian file Git
```

---

## 📄 Lisensi

Proyek ini dikembangkan untuk kebutuhan internal manajemen administrasi ujian sekolah. Bebas dimodifikasi dan dikembangkan sesuai kebutuhan masing-masing sekolah.

