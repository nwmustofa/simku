# 📢 Catatan Rilis (Release Notes) - SIMKU

## [v1.0.0] - Rilis Perdana (Initial Release)
*Tanggal Rilis: 16 Oktober 2026*

Selamat datang di versi perdana **SIMKU (Sistem Informasi Manajemen Kartu Ujian)**! Aplikasi desktop *offline-first* ini hadir sebagai solusi praktis, cepat, dan presisi bagi Panitia Ujian Sekolah dalam mengelola data peserta ujian, penataan ruang, serta pencetakan kartu ujian dan nomor bangku.

---

### 🌟 Fitur Utama & Pembaruan

#### 📊 1. Integrasi & Pengelolaan Data Siswa
- **Import Data Dapodik (Excel):** Import file data siswa format `.xlsx`, `.xls`, maupun `.csv` dengan pemetaan otomatis kolom Nama, NISN/NIS, Jenis Kelamin, dan Rombel/Kelas.
- **Penomoran Peserta Otomatis:** Sistem secara otomatis menyortir siswa berdasarkan urutan Kelas dan Nama, lalu menetapkan Nomor Peserta berurutan mulai dari `001`, `002`, dst.
- **Input Siswa Manual:** Fitur tambah data siswa secara mandiri untuk mengakomodasi siswa yang belum terdata di Dapodik.
- **Sorting Dinamis:** Kemudahan mengurutkan data tabel siswa berdasarkan kolom apa pun hanya dengan satu klik.

#### 📸 2. Pengelolaan Foto Peserta Massal
- **Upload Massal via File `.zip`:** Kemampuan mengunggah ratusan foto siswa sekaligus dalam satu arsip `.zip`.
- **Pencocokan Cerdas (NISN Matching):** Sistem otomatis mendeteksi dan menautkan foto ke profil siswa berdasarkan nomor NISN sebagai nama file foto.
- **Upload Foto Satuan:** Fleksibilitas mengubah atau menambahkan foto per siswa secara langsung dari tabel.

#### 🏫 3. Manajemen Ruang Ujian Fleksibel
- **Fitur "Ruang = Kelas":** Tombol satu klik untuk otomatis menempatkan siswa pada ruang ujian yang sama dengan kelas belajarnya masing-masing.
- **Inline Editing Ruang:** Mengubah pembagian ruang ujian langsung pada kolom tabel tanpa membuka modal/halaman baru.
- **Reset Ruang:** Tombol instan untuk mengosongkan kembali seluruh data ruang ujian.

#### 💳 4. Validasi Administrasi & Watermark SPP
- **Pengawasan Status SPP:** Penanda status *Lunas* atau *Terhutang* per peserta.
- **Watermark "DENGAN PERJANJIAN":** Kartu peserta ujian bagi siswa dengan status Terhutang secara otomatis dicetak dengan cap watermark transparan di latar belakang kartu.

#### 🖨️ 5. Mesin Cetak Presisi (Hemat Kertas A4)
- **Tata Letak Kartu Ujian (Grid 2 Kolom x 4 Baris):**
  - Ukuran kartu presisi: `9.5 cm x 6.8 cm` (Landscape).
  - Muat pas **8 kartu per halaman A4** tanpa terpotong ke halaman berikutnya.
  - Memuat Kop Surat Resmi, Logo Sekolah, Foto Peserta, QR Code berbasis NISN, dan Tanda Tangan & Stempel Kepala Sekolah (PNG transparan).
- **Cetak Nomor Bangku:**
  - Layout nomor bangku siap tempel di meja ujian dengan ukuran yang sama presisinya.
  - Menampilkan Kop Sekolah, Jenis Ujian, dan Nomor Peserta berukuran besar di bagian tengah kartu.

#### 💾 6. Keamanan Data & Portabilitas
- **100% Offline-First (IndexedDB):** Seluruh data, logo, tanda tangan, dan foto tersimpan lokal di komputer pengguna menggunakan Dexie.js tanpa memerlukan server web (Apache/XAMPP) atau koneksi internet.
- **Backup & Restore Data Lokal:** Fitur ekspor dan impor seluruh basis data (termasuk semua foto siswa) ke dalam satu file cadangan `.json`.

#### 🖥️ 7. Paket Desktop Windows Native
- **Standalone Windows Installer (.exe):** Dikemas menggunakan Electron dan NSIS installer dengan pembuatan shortcut desktop dan Start Menu otomatis.
- **Operasional di Latar Belakang:** Dukungan file script (`Mulai_SIMKU_Tersembunyi.vbs` dan `Hentikan_SIMKU.bat`) untuk menjalankan aplikasi tanpa tampilan jendela CMD hitam.

---

### 📦 Panduan Instalasi Pengguna Baru
1. Unduh file **`Aplikasi SIMKU Setup 1.0.0.exe`** dari bagian [Assets/Releases](https://github.com/nwmustofa/simku/releases).
2. Klik ganda pada file installer dan ikuti instruksi pemasangan di layar (*Next -> Next -> Install*).
3. Setelah proses selesai, buka aplikasi melalui ikon jalan pintas di **Desktop** atau **Start Menu**.

---

### 👨‍💻 Pengembang
Dikembangkan oleh **SIGIE Lab by Nur Wahid Mustofa**.
Dukung pengembangan lebih lanjut melalui: [Trakteer](https://teer.id/nur_wahid_musthofa)

