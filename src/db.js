import Dexie from 'dexie';

export const db = new Dexie('simku_db');
db.version(1).stores({
  students: '++id, nama, nis_nisn, kelas, ruang, status_spp, nomor_peserta',
  settings: 'key' // We'll store things like { key: 'config', logo: '...', kop: '...', ttd: '...', nama_ujian: '...' }
});
