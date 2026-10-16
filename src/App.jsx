import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings as SettingsIcon, Printer, Hash } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Settings from './pages/Settings';
import PrintPreview from './pages/PrintPreview';
import PrintDesk from './pages/PrintDesk';

function Sidebar() {
  const location = useLocation();
  const menus = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/students', label: 'Data Siswa', icon: <Users size={20} /> },
    { path: '/print', label: 'Cetak Kartu', icon: <Printer size={20} /> },
    { path: '/print-desk', label: 'Cetak Bangku', icon: <Hash size={20} /> },
    { path: '/settings', label: 'Pengaturan', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col print:hidden">
      <div className="p-4 border-b bg-sage/10 text-sage font-bold text-2xl text-center">
        SIMKU
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menus.map(menu => {
          const active = location.pathname === menu.path;
          return (
            <Link key={menu.path} to={menu.path} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-sage text-white shadow-sm' : 'text-gray-600 hover:bg-mint/20'}`}>
              {menu.icon}
              <span className="font-medium">{menu.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-center text-gray-400 border-t">
        Offline Mode
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/print" element={<PrintPreview />} />
          <Route path="/print-desk" element={<PrintDesk />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
