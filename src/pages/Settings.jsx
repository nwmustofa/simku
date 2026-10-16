import { useState, useEffect } from 'react';
import { db } from '../db';
import { Save, Download, UploadCloud } from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState({
    nama_ujian: 'STS Ganjil 2026/2027',
    kop_baris1: 'PEMERINTAH KABUPATEN XYZ',
    kop_baris2: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
    kop_baris3: 'SMP NEGERI 1 CONTOH',
    nama_kepsek: 'Budi Santoso, M.Pd.',
    nip_kepsek: '19800101 200501 1 001',
    logo: '',
    ttd: ''
  });

  useEffect(() => {
    db.settings.get('config').then(data => {
      if (data) setConfig(data);
    });
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({ ...config, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async () => {
    await db.settings.put({ key: 'config', ...config });
    alert('Pengaturan berhasil disimpan!');
  };

  // --- LOGIKA BACKUP & RESTORE ---
  const handleExportBackup = async () => {
    try {
      const students = await db.students.toArray();
      const settings = await db.settings.toArray();
      
      const backupData = {
        version: 1,
        timestamp: new Date().toISOString(),
        data: { students, settings }
      };
      
      const blob = new Blob([JSON.stringify(backupData)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `SIMKU_Backup_${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Gagal membuat backup data.");
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if(confirm("PERINGATAN: Memulihkan data (restore) akan menimpa dan MENGHAPUS seluruh data siswa serta pengaturan saat ini! Anda yakin ingin melanjutkan?")) {
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
        if(!backup.data || !backup.data.students || !backup.data.settings) {
            throw new Error("Format file tidak valid");
        }
        
        await db.transaction('rw', db.students, db.settings, async () => {
          await db.students.clear();
          await db.settings.clear();
          if(backup.data.students.length > 0) await db.students.bulkAdd(backup.data.students);
          if(backup.data.settings.length > 0) await db.settings.bulkAdd(backup.data.settings);
        });
        
        alert("Data berhasil dipulihkan! Halaman akan dimuat ulang untuk memperbarui tampilan.");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Gagal memulihkan data. Pastikan file backup valid dan tidak rusak.");
      }
    }
    e.target.value = null; // Reset input
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan</h1>
        <p className="text-gray-500 mt-1">Atur Kop Surat, Ujian, Tanda Tangan, dan Backup Data</p>
      </div>

      {/* Bagian Pengaturan Teks & Gambar */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Informasi Ujian & Sekolah</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama / Jenis Ujian</label>
              <input type="text" name="nama_ujian" value={config.nama_ujian} onChange={handleChange} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-sage focus:border-sage outline-none" placeholder="Misal: STS Ganjil 2026/2027" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kop Surat Baris 1</label>
              <input type="text" name="kop_baris1" value={config.kop_baris1} onChange={handleChange} className="w-full border rounded-lg p-2 font-bold text-center outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kop Surat Baris 2</label>
              <input type="text" name="kop_baris2" value={config.kop_baris2} onChange={handleChange} className="w-full border rounded-lg p-2 font-bold text-center outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kop Surat Baris 3</label>
              <input type="text" name="kop_baris3" value={config.kop_baris3} onChange={handleChange} className="w-full border rounded-lg p-2 font-bold text-center text-xl outline-none" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Kepala Sekolah & Gambar</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Sekolah</label>
              <input type="text" name="nama_kepsek" value={config.nama_kepsek} onChange={handleChange} className="w-full border rounded-lg p-2 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIP Kepala Sekolah</label>
              <input type="text" name="nip_kepsek" value={config.nip_kepsek} onChange={handleChange} className="w-full border rounded-lg p-2 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo Sekolah (.png/.jpg)</label>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="w-full text-sm border p-2 rounded-lg" />
              {config.logo && <img src={config.logo} alt="Logo" className="h-16 mt-2 object-contain" />}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanda Tangan & Stempel (.png transparan)</label>
              <input type="file" accept="image/png" onChange={(e) => handleImageUpload(e, 'ttd')} className="w-full text-sm border p-2 rounded-lg" />
              {config.ttd && <img src={config.ttd} alt="TTD" className="h-16 mt-2 object-contain bg-gray-100 rounded" />}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button onClick={saveSettings} className="flex items-center gap-2 bg-sage hover:bg-sage/90 text-white px-6 py-2 rounded-lg transition font-medium">
            <Save size={18} /> Simpan Pengaturan
          </button>
        </div>
      </div>

      {/* Bagian Backup & Restore */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-10">
        <h2 className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">Backup & Restore Data Lokal</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Gunakan fitur ini untuk mem-backup <b>seluruh data Anda</b>. Fitur ini sudah mencakup Data Siswa, Pengaturan Ujian, termasuk <b>semua file Foto Siswa, Logo, dan Tanda Tangan</b>. <br/>
          Anda bisa menyimpan file hasil backup (<code className="bg-gray-100 px-1 py-0.5 rounded">.json</code>) ini ke dalam Google Drive, Flashdisk, atau WhatsApp Anda secara manual. Jika terjadi kerusakan/hilang data, Anda bisa memulihkannya menggunakan tombol Restore.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <button onClick={handleExportBackup} className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-100 transition shadow-sm font-medium">
            <Download size={18} /> Download File Backup
          </button>
          
          <label className="cursor-pointer flex items-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg hover:bg-orange-100 transition shadow-sm font-medium">
            <UploadCloud size={18} /> Restore dari File Backup
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* Footer Dukungan */}
      <div className="text-center text-xs text-gray-400 py-2">
        <span>SIMKU v1.0.0 by <b>SIGIE Lab</b> &bull; </span>
        <a 
          href="https://teer.id/nur_wahid_musthofa" 
          target="_blank" 
          rel="noreferrer" 
          className="text-sage hover:underline font-medium"
        >
          ☕ Traktir Kopi / Dukung Pengembang di Trakteer
        </a>
      </div>
      
    </div>
  );
}
