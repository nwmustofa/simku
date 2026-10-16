import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Users, FileImage, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const studentsCount = useLiveQuery(() => db.students.count(), []);
  const settings = useLiveQuery(() => db.settings.get('config'));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang di Sistem Informasi Manajemen Kartu Ujian</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-sage/10 text-sage rounded-lg"><Users size={24} /></div>
          <div>
            <div className="text-2xl font-bold">{studentsCount ?? 0}</div>
            <div className="text-sm text-gray-500">Total Siswa</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-mint/20 text-mint rounded-lg"><FileImage size={24} /></div>
          <div>
            <div className="text-2xl font-bold">{settings?.nama_ujian || 'Belum diset'}</div>
            <div className="text-sm text-gray-500">Ujian Aktif</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm flex items-start gap-4">
          <div className="p-3 bg-accent/20 text-yellow-600 rounded-lg"><Settings2 size={24} /></div>
          <div>
            <div className="text-lg font-bold mt-1 text-gray-800">
              {settings?.logo ? 'Logo Tersimpan' : 'Logo Kosong'}
            </div>
            <div className="text-sm text-gray-500">Status Konfigurasi</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">Langkah Selanjutnya</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Mulai dengan mengatur Kop Surat dan Tanda Tangan pada menu Pengaturan, kemudian import data siswa dari Excel Dapodik.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/settings" className="px-6 py-2 bg-white border border-sage text-sage font-medium rounded-lg hover:bg-sage/5 transition">Pengaturan</Link>
          <Link to="/students" className="px-6 py-2 bg-sage text-white font-medium rounded-lg hover:bg-sage/90 transition">Kelola Data Siswa</Link>
        </div>
      </div>
    </div>
  );
}
