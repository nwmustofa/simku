import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { Upload, Trash2, FolderSync, FileArchive, ImagePlus, ChevronUp, ChevronDown, ArrowUpDown, RotateCcw, Plus, X, ListOrdered } from 'lucide-react';

export default function Students() {
  const rawStudents = useLiveQuery(() => db.students.toArray(), []);
  const [loading, setLoading] = useState(false);
  
  // State untuk form Tambah Siswa Manual
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    nama: '', nis_nisn: '', gender: 'L', kelas: '', ruang: '-', status_spp: 'Lunas'
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState(() => {
    const saved = localStorage.getItem('simku_sort');
    return saved ? JSON.parse(saved) : { key: 'kelas', direction: 'asc' };
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const newConfig = { key, direction };
    setSortConfig(newConfig);
    localStorage.setItem('simku_sort', JSON.stringify(newConfig));
  };

  const sortedStudents = useMemo(() => {
    if (!rawStudents) return [];
    let sortableItems = [...rawStudents];
    sortableItems.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [rawStudents, sortConfig]);

  // Handle Tambah Siswa Manual
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama) return;
    setLoading(true);
    try {
      const existingCount = await db.students.count();
      const nextNo = existingCount + 1;
      await db.students.add({
        nomor_peserta: String(nextNo).padStart(3, '0'),
        nama: formData.nama.trim(),
        nis_nisn: formData.nis_nisn.trim() || '-',
        gender: formData.gender,
        kelas: formData.kelas.trim() || '-',
        ruang: formData.ruang.trim() || '-',
        status_spp: formData.status_spp,
        foto: ''
      });
      setShowAddModal(false);
      setFormData({ nama: '', nis_nisn: '', gender: 'L', kelas: '', ruang: '-', status_spp: 'Lunas' });
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data siswa baru.');
    }
    setLoading(false);
  };

  // Import Data Dapodik
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
      let headerRowIndex = 0;
      let headers = [];
      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      for (let i = 0; i < Math.min(20, rawData.length); i++) {
        if (rawData[i].includes('Nama') && rawData[i].includes('NISN')) {
          headerRowIndex = i;
          headers = rawData[i];
          break;
        }
      }

      if (headers.length === 0) {
        alert("Gagal menemukan kolom 'Nama' dan 'NISN' pada file Excel.");
        setLoading(false);
        return;
      }

      const rows = rawData.slice(headerRowIndex + 1).filter(row => row.length > 0 && row[headers.indexOf('Nama')]);

      const newStudents = rows.map(row => {
        const getVal = (colName) => row[headers.indexOf(colName)]?.toString()?.trim() || '';
        const rawKelas = getVal('Rombel Saat Ini') || getVal('Kelas') || '-';
        
        return {
          nomor_peserta: '999', // Sementara
          nama: getVal('Nama'),
          nis_nisn: getVal('NISN') || getVal('NIS') || '-',
          gender: getVal('JK') === 'L' ? 'L' : 'P',
          kelas: rawKelas,
          ruang: '-',
          status_spp: 'Lunas',
          foto: ''
        };
      });

      // 1. Simpan semua data baru ke database
      await db.students.bulkAdd(newStudents);
      
      // 2. Ambil seluruh data (lama + baru), lalu urutkan secara default berdasarkan Kelas -> Nama
      const allStudents = await db.students.toArray();
      allStudents.sort((a, b) => {
        if ((a.kelas || '') < (b.kelas || '')) return -1;
        if ((a.kelas || '') > (b.kelas || '')) return 1;
        if ((a.nama || '') < (b.nama || '')) return -1;
        if ((a.nama || '') > (b.nama || '')) return 1;
        return 0;
      });
      
      // 3. Update secara massal nomor peserta agar terurut mulai dari 001
      const updates = allStudents.map((s, index) => {
        const newNo = String(index + 1).padStart(3, '0');
        return db.students.update(s.id, { nomor_peserta: newNo });
      });
      await Promise.all(updates);

      alert(`Berhasil mengimport ${newStudents.length} data siswa. Nomor Peserta telah otomatis diurutkan berdasarkan Kelas.`);
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat import data.');
    }
    setLoading(false);
    e.target.value = null; 
  };

  // Upload Foto Massal via Zip
  const handleZipUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      const allStudents = await db.students.toArray();
      let updatedCount = 0;

      for (const relativePath of Object.keys(contents.files)) {
        const zipEntry = contents.files[relativePath];
        if (!zipEntry.dir) {
          const filename = zipEntry.name.split('/').pop();
          const extIndex = filename.lastIndexOf('.');
          const nameWithoutExt = extIndex !== -1 ? filename.substring(0, extIndex) : filename;
          
          const student = allStudents.find(s => s.nis_nisn === nameWithoutExt);
          if (student) {
            const blob = await zipEntry.async("blob");
            const reader = new FileReader();
            
            const base64 = await new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
            
            await db.students.update(student.id, { foto: base64 });
            updatedCount++;
          }
        }
      }
      alert(`Berhasil mengupload foto untuk ${updatedCount} siswa.`);
    } catch (err) {
      console.error(err);
      alert('Gagal memproses file zip.');
    }
    setLoading(false);
    e.target.value = null;
  };

  // Upload Foto Satuan
  const handlePhotoUpload = async (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      await db.students.update(id, { foto: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Ubah Ruang Inline
  const updateRuang = async (id, val) => {
    await db.students.update(id, { ruang: val });
  };

  const setRuangSamaDenganKelas = async () => {
    if(confirm('Otomatis isi "Ruang Ujian" dengan "Kelas" untuk SEMUA siswa?')) {
      setLoading(true);
      const allStudents = await db.students.toArray();
      const updates = allStudents.map(s => db.students.update(s.id, { ruang: s.kelas }));
      await Promise.all(updates);
      setLoading(false);
    }
  };

  const resetRuang = async () => {
    if(confirm('Yakin ingin mereset/mengosongkan "Ruang Ujian" untuk SEMUA siswa?')) {
      setLoading(true);
      const allStudents = await db.students.toArray();
      const updates = allStudents.map(s => db.students.update(s.id, { ruang: '-' }));
      await Promise.all(updates);
      setLoading(false);
    }
  };

  const urutkanUlangNomorPeserta = async () => {
    if(confirm('Nomor Peserta akan ditata ulang secara berurutan (001, 002, dst) berdasarkan Kelas lalu Nama. Lanjutkan?')) {
      setLoading(true);
      const allStudents = await db.students.toArray();
      
      allStudents.sort((a, b) => {
        if ((a.kelas || '') < (b.kelas || '')) return -1;
        if ((a.kelas || '') > (b.kelas || '')) return 1;
        if ((a.nama || '') < (b.nama || '')) return -1;
        if ((a.nama || '') > (b.nama || '')) return 1;
        return 0;
      });
      
      const updates = allStudents.map((s, index) => {
        const newNo = String(index + 1).padStart(3, '0');
        return db.students.update(s.id, { nomor_peserta: newNo });
      });
      await Promise.all(updates);
      setLoading(false);
    }
  };

  const clearAll = async () => {
    if (confirm('Yakin ingin menghapus semua data siswa?')) {
      await db.students.clear();
    }
  };

  const deleteStudent = async (id) => {
    await db.students.delete(id);
  }

  const toggleSPP = async (student) => {
    const newStatus = student.status_spp === 'Lunas' ? 'Terhutang' : 'Lunas';
    await db.students.update(student.id, { status_spp: newStatus });
  }

  const SortHeader = ({ label, sortKey, align = 'left' }) => (
    <th 
      className={`p-3 font-medium cursor-pointer hover:bg-gray-100 transition select-none ${align === 'center' ? 'text-center' : 'text-left'}`}
      onClick={() => requestSort(sortKey)}
      title={`Urutkan berdasarkan ${label}`}
    >
      <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : ''}`}>
        {label}
        {sortConfig.key === sortKey ? (
          sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-sage" /> : <ChevronDown size={14} className="text-sage" />
        ) : (
          <ArrowUpDown size={14} className="text-gray-300 opacity-50" />
        )}
      </div>
    </th>
  );

  return (
    <div className="max-w-[100%] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola data peserta ujian, ruang, foto, dan SPP</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setShowAddModal(true)} disabled={loading} className="flex items-center gap-2 bg-sage text-white px-3 py-2 rounded-lg hover:bg-sage/90 transition text-sm font-medium shadow-sm">
            <Plus size={16} /> Tambah Siswa
          </button>

          <label className={`cursor-pointer flex items-center gap-2 bg-white border border-sage text-sage px-3 py-2 rounded-lg hover:bg-sage/5 transition shadow-sm ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={16} />
            <span className="text-sm font-medium">Data Dapodik</span>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleImport} className="hidden" />
          </label>
          
          <label className={`cursor-pointer flex items-center gap-2 bg-white border border-blue-500 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition shadow-sm ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileArchive size={16} />
            <span className="text-sm font-medium">Foto Masal (.zip)</span>
            <input type="file" accept=".zip" onChange={handleZipUpload} className="hidden" />
          </label>

          <button onClick={setRuangSamaDenganKelas} disabled={loading} className="flex items-center gap-2 bg-mint/40 text-emerald-800 border border-mint px-3 py-2 rounded-lg hover:bg-mint/60 transition shadow-sm text-sm font-medium">
            <FolderSync size={16} /> Ruang = Kelas
          </button>

          <button onClick={resetRuang} disabled={loading} className="flex items-center gap-2 bg-orange-50 text-orange-600 border border-orange-200 px-3 py-2 rounded-lg hover:bg-orange-100 transition shadow-sm text-sm font-medium">
            <RotateCcw size={16} /> Reset Ruang
          </button>

          <button onClick={urutkanUlangNomorPeserta} disabled={loading} className="flex items-center gap-2 bg-purple-50 text-purple-600 border border-purple-200 px-3 py-2 rounded-lg hover:bg-purple-100 transition shadow-sm text-sm font-medium">
            <ListOrdered size={16} /> Re-urutkan No. Peserta
          </button>

          <button onClick={clearAll} disabled={loading} className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-100 transition shadow-sm text-sm font-medium">
            <Trash2 size={16} /> Kosongkan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b text-gray-600">
              <tr>
                <th className="p-3 font-medium text-center">Foto</th>
                <SortHeader label="No. Peserta" sortKey="nomor_peserta" />
                <SortHeader label="Nama" sortKey="nama" />
                <SortHeader label="L/P" sortKey="gender" />
                <SortHeader label="NISN" sortKey="nis_nisn" />
                <SortHeader label="Kelas" sortKey="kelas" />
                <SortHeader label="Ruang Ujian" sortKey="ruang" />
                <SortHeader label="Status SPP" sortKey="status_spp" align="center" />
                <th className="p-3 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {sortedStudents?.length === 0 && (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-500">Belum ada data siswa. Silakan import dari Excel atau tambahkan manual.</td>
                </tr>
              )}
              {sortedStudents?.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 text-left">
                  <td className="p-3 text-center">
                    <label className="cursor-pointer inline-block group relative">
                      <div className="w-10 h-10 bg-gray-100 border rounded overflow-hidden flex items-center justify-center">
                        {s.foto ? (
                          <img src={s.foto} className="w-full h-full object-cover" alt="Foto" />
                        ) : (
                          <ImagePlus size={16} className="text-gray-400" />
                        )}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(s.id, e)} />
                      <div className="absolute hidden group-hover:block bg-black/70 text-white text-[10px] px-1 py-0.5 rounded -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">Ubah</div>
                    </label>
                  </td>
                  <td className="p-3 font-mono text-gray-500">{s.nomor_peserta}</td>
                  <td className="p-3 font-medium max-w-[200px] truncate" title={s.nama}>{s.nama}</td>
                  <td className="p-3">{s.gender}</td>
                  <td className="p-3">{s.nis_nisn}</td>
                  <td className="p-3">{s.kelas}</td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      defaultValue={s.ruang} 
                      onBlur={(e) => updateRuang(s.id, e.target.value)}
                      className="w-full max-w-[100px] p-1.5 border border-gray-300 rounded text-sm text-left focus:ring-2 focus:ring-sage focus:border-sage outline-none bg-white transition" 
                      placeholder="-" 
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => toggleSPP(s)} 
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition ${s.status_spp === 'Lunas' ? 'bg-mint/30 text-emerald-700 hover:bg-mint/50' : 'bg-accent/30 text-yellow-700 hover:bg-accent/50'}`}
                    >
                      {s.status_spp}
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteStudent(s.id)} className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Siswa Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">Tambah Siswa Manual</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-800 transition"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-sage" placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NISN</label>
                  <input type="text" value={formData.nis_nisn} onChange={e => setFormData({...formData, nis_nisn: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-sage" placeholder="00912..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">L/P *</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-sage">
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <input type="text" value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-sage" placeholder="Misal: 9A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ruang Ujian</label>
                  <input type="text" value={formData.ruang} onChange={e => setFormData({...formData, ruang: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-sage" placeholder="-" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status SPP</label>
                <select value={formData.status_spp} onChange={e => setFormData({...formData, status_spp: e.target.value})} className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-sage">
                  <option value="Lunas">Lunas</option>
                  <option value="Terhutang">Terhutang (Dengan Perjanjian)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700">Batal</button>
                <button type="submit" disabled={loading} className="px-5 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition text-sm font-medium shadow-sm">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
