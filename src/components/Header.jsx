// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle, FaBell, FaTimes, FaCheckDouble, FaLock } from "react-icons/fa";
import { getNotifikasi, readNotifikasi, readAllNotifikasi, changePassword } from "../api/Api";

const Header = ({ sidebarOpen, toggleSidebar }) => {
  const [userName, setUserName] = useState("Pengguna");
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notifikasi, setNotifikasi] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // ✅ STATE FORM GANTI PASSWORD
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const dropdownRef = useRef(null);
  const sidebarWidth = sidebarOpen ? 240 : 80;

  const fetchUser = () => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserName(user.name || user.nama || "Pengguna");
    }
  };

  const fetchNotifikasi = async () => {
    try {
      const response = await getNotifikasi();
      const dataNotif = response.data || response;
      
      setNotifikasi(dataNotif);
      const unread = dataNotif.filter(n => !n.read_at).length;
      setUnreadCount(response.unread_count || unread);
      
      console.log("📬 Notifikasi fetched:", dataNotif.length, "| Unread:", unread);
    } catch (err) {
      console.error("Gagal mengambil notifikasi:", err);
    }
  };

  const handleReadNotif = async (id) => {
    try {
      await readNotifikasi(id);
      fetchNotifikasi();
    } catch (err) {
      console.error("Gagal menandai notifikasi:", err);
    }
  };

  const handleReadAllNotif = async () => {
    try {
      await readAllNotifikasi();
      fetchNotifikasi();
    } catch (err) {
      console.error("Gagal menandai semua notifikasi:", err);
    }
  };

  // ✅ HANDLE GANTI PASSWORD
  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.new_password_confirmation) {
      return alert("Semua field harus diisi!");
    }

    if (passwordForm.new_password.length < 8) {
      return alert("Password baru minimal 8 karakter!");
    }

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      return alert("Konfirmasi password tidak cocok!");
    }

    setSubmitting(true);
    try {
      await changePassword(passwordForm);
      alert("Password berhasil diubah!");
      setChangePasswordOpen(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      console.error("Gagal ganti password:", err);
      const errorMsg = err.response?.data?.message || "Gagal mengubah password!";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchUser();
    fetchNotifikasi();

    const interval = setInterval(fetchNotifikasi, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          10% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .animate-slide-up { animation: slideUp 8s ease-in-out infinite; }
        
        .notif-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .notif-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .notif-scroll::-webkit-scrollbar-thumb {
          background: #D8B46A;
          border-radius: 10px;
        }
        .notif-scroll::-webkit-scrollbar-thumb:hover {
          background: #C8A354;
        }
      `}</style>

      <header
        className="fixed top-0 z-40 transition-all duration-300"
        style={{ left: `${sidebarWidth}px`, right: 0 }}
      >
        {/* HEADER ATAS */}
        <div
          className="h-16 flex items-center justify-between shadow-md bg-white px-6"
          style={{ color: "#0D2A5C" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition hover:bg-[#0D2A5C]/10"
            >
              <FaBars size={22} className="text-[#0D2A5C]" />
            </button>

            <h1 className="text-lg md:text-xl font-extrabold tracking-wide text-[#0D2A5C]">
              E-Lapak <span className="text-[#D8B46A]">Siring</span>
            </h1>
          </div>

          {/* NOTIF & PROFIL */}
          <div ref={dropdownRef} className="flex items-center gap-6">
            {/* NOTIFIKASI */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-full hover:bg-[#0D2A5C]/10 transition"
              >
                <FaBell size={22} className="text-[#0D2A5C]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN NOTIF */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="bg-[#0D2A5C] p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        Notifikasi
                      </h3>
                      <p className="text-white/70 text-xs mt-0.5">
                        {unreadCount > 0
                          ? `${unreadCount} belum dibaca`
                          : "Semua sudah dibaca"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleReadAllNotif}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#D8B46A] hover:bg-[#C8A354] rounded-lg text-xs font-semibold text-[#0D2A5C] transition"
                      >
                        <FaCheckDouble />
                        Baca Semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto notif-scroll">
                    {notifikasi.length === 0 ? (
                      <div className="p-8 text-center">
                        <FaBell className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-gray-500 text-sm">
                          Tidak ada notifikasi
                        </p>
                      </div>
                    ) : (
                      notifikasi.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => !n.read_at && handleReadNotif(n.id)}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${
                            !n.read_at ? "bg-blue-50/30" : "bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                n.data?.tipe === "pembatalan_sewa"
                                  ? "bg-red-100"
                                  : "bg-amber-100"
                              }`}
                            >
                              {n.data?.tipe === "pembatalan_sewa" ? (
                                <FaTimes className="text-red-600" size={18} />
                              ) : (
                                <FaBell className="text-amber-600" size={18} />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-relaxed ${
                                  !n.read_at
                                    ? "text-gray-900 font-semibold"
                                    : "text-gray-600"
                                }`}
                              >
                                {n.data?.pesan || "Pemberitahuan baru"}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-gray-500">
                                  {formatDate(n.created_at)}
                                </span>
                                {!n.read_at && (
                                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* USER PROFILE */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:bg-[#0D2A5C]/10 rounded-lg px-2 py-1 transition"
              >
                <FaUserCircle size={38} className="text-[#0D2A5C]" />
                <div className="hidden md:block text-right">
                  <p className="text-xs text-gray-500">Selamat Datang</p>
                  <p className="font-bold text-sm text-[#0D2A5C]">
                    {userName}
                  </p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200">
                  {/* ✅ GANTI PENGATURAN JADI GANTI PASSWORD */}
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-2"
                    onClick={() => {
                      setChangePasswordOpen(true);
                      setDropdownOpen(false);
                    }}
                  >
                    <FaLock className="text-[#0D2A5C]" />
                    Ganti Password
                  </button>
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-red-50 transition text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BANNER ANIMASI */}
        <div
          className="h-10 flex items-center justify-center px-6 shadow-sm overflow-hidden"
          style={{ backgroundColor: "#D8B46A", color: "#0D2647" }}
        >
          <p className="text-sm font-semibold animate-slide-up">
            Selamat datang di website E-Lapak Siring
          </p>
        </div>
      </header>

      {/* ✅ MODAL GANTI PASSWORD */}
      {changePasswordOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-200 overflow-hidden">
            {/* Header Modal */}
            <div className="bg-[#0D2A5C] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaLock className="text-white" size={20} />
                <h2 className="text-xl font-bold text-white">Ganti Password</h2>
              </div>
              <button
                onClick={() => setChangePasswordOpen(false)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2 text-[#0D2A5C]">
                  Password Lama <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8B46A] outline-none text-sm"
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2 text-[#0D2A5C]">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8B46A] outline-none text-sm"
                  placeholder="Minimal 8 karakter"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2 text-[#0D2A5C]">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D8B46A] outline-none text-sm"
                  placeholder="Ulangi password baru"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => setChangePasswordOpen(false)}
                className="flex-1 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 transition text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleChangePassword}
                disabled={submitting}
                className="flex-1 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#D8B46A" }}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
