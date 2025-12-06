import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Halaman umum
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";

// Halaman Admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import KelolaEvent from "./pages/admin/KelolaEvent";
import KelolaStand from "./pages/admin/KelolaStand";
import KelolaPengajuanStand from "./pages/admin/KelolaPengajuanStand";
import RekapPengunjung from "./pages/admin/RekapPengunjung";
import Laporan from "./pages/admin/Laporan";
import KelolaPembayaran from "./pages/admin/KelolaPembayaran";

// Halaman Penyewa
import DashboardPenyewa from "./pages/penyewa/DashboardPenyewa";
import Events from "./pages/penyewa/Events";
import Stand from "./pages/penyewa/Stand";
import StandAnda from "./pages/penyewa/StandAnda";

// Halaman pembayaran
import Pay from "./pages/Pay";

function App() {
  return (
    <Router>
      <Routes>

        {/* Halaman Umum */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Halaman Admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/kelola-event" element={<KelolaEvent />} />
        <Route path="/admin/kelola-stand" element={<KelolaStand />} />
        <Route path="/admin/pengajuan-stand" element={<KelolaPengajuanStand />} />
        <Route path="/admin/kelola-pembayaran" element={<KelolaPembayaran />} />
        <Route path="/admin/rekap-pengunjung" element={<RekapPengunjung />} />
        <Route path="/admin/laporan" element={<Laporan />} />

        {/* Halaman Penyewa */}
        <Route path="/penyewa/dashboard" element={<DashboardPenyewa />} />
        <Route path="/penyewa/events" element={<Events />} />
        <Route path="/penyewa/stand" element={<Stand />} />
        <Route path="/penyewa/stand-anda" element={<StandAnda />} />

        {/* QRIS embedded payment */}
        <Route path="/pay" element={<Pay />} />

      </Routes>
    </Router>
  );
}

export default App;
