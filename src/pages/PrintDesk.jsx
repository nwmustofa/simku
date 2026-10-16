import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Printer } from 'lucide-react';

export default function PrintDesk() {
  const rawStudents = useLiveQuery(() => db.students.toArray());
  const settings = useLiveQuery(() => db.settings.get('config').then(res => res || {}));

  const students = useMemo(() => {
    if (!rawStudents) return null;
    const sortConfig = JSON.parse(localStorage.getItem('simku_sort')) || { key: 'kelas', direction: 'asc' };
    
    let sortableItems = [...rawStudents];
    sortableItems.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [rawStudents]);

  if (rawStudents === undefined || settings === undefined) return <div className="p-8">Memuat data...</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Cetak Nomor Bangku</h1>
          <p className="text-gray-500 mt-1">Kartu berukuran 9.5cm x 7cm (Landscape). Dicetak untuk ditempel pada meja/bangku ujian.</p>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-sage hover:bg-sage/90 text-white px-6 py-2 rounded-lg transition shadow-sm font-medium">
          <Printer size={20} /> Cetak Sekarang
        </button>
      </div>

      <div className="bg-white p-8 border rounded-xl print:border-none print:p-0 print:bg-transparent overflow-auto">
        <div id="print-area" className="flex flex-wrap gap-4">
          {students.map((student, idx) => (
            <div key={student.id} className="print-card relative bg-white flex flex-col p-1 text-black overflow-hidden font-sans border-2 border-gray-900 rounded-md" style={{ width: '9.5cm', height: '6.8cm' }}>
              
              {/* Kop Surat */}
              <div className="flex items-center justify-between border-b-[1.5px] border-black pb-1 mb-1 relative">
                <div className="w-[1.6cm] h-[1.6cm] flex items-center justify-center flex-shrink-0">
                  {settings.logo ? (
                    <img src={settings.logo} className="max-w-full max-h-full object-contain" alt="Logo" />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                </div>
                
                <div className="flex-1 text-center leading-tight px-1">
                  <div className="font-bold text-[8px] uppercase">{settings.kop_baris1 || 'PEMERINTAH KABUPATEN'}</div>
                  <div className="font-bold text-[10px] uppercase">{settings.kop_baris2 || 'DINAS PENDIDIKAN'}</div>
                  <div className="font-bold text-[11px] uppercase">{settings.kop_baris3 || 'NAMA SEKOLAH'}</div>
                </div>

                <div className="w-[1.6cm] h-[1.6cm] flex-shrink-0">
                   {/* Spacer */}
                </div>
              </div>

              {/* Jenis Ujian */}
              <div className="text-center mt-0.5 mb-1 leading-tight">
                <div className="font-bold text-[9px] uppercase tracking-wider">{settings.nama_ujian || 'STS GANJIL'}</div>
              </div>

              {/* Middle Body: Nomor Peserta */}
              <div className="flex-1 flex flex-col items-center justify-start mt-[0.2cm] relative">
                <div className="font-bold text-[10px] uppercase underline mb-0.5 tracking-widest text-gray-800">NOMOR BANGKU</div>
                
                <div className="font-black tracking-widest text-center" style={{ fontSize: '1.8cm', lineHeight: '1.6cm' }}>
                  {student.nomor_peserta}
                </div>

                {/* Signature - Absolute Position di Kanan Bawah */}
                <div className="absolute bottom-0 right-1 w-[2.6cm] text-center flex flex-col justify-end">
                  <div className="text-[7px] mb-0.5">Kepala Sekolah</div>
                  <div className="h-[1.5cm] relative flex justify-center items-center">
                    {settings.ttd && (
                      <img src={settings.ttd} className="max-h-full max-w-full object-contain absolute z-0" alt="TTD" style={{ mixBlendMode: 'multiply' }} />
                    )}
                  </div>
                  <div className="font-bold text-[7px] underline relative z-10">{settings.nama_kepsek || 'NAMA KEPSEK'}</div>
                  <div className="text-[6px] relative z-10">NIP. {settings.nip_kepsek || '-'}</div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
