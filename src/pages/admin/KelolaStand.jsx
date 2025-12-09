// src/pages/admin/KelolaStand.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  CheckCircle2,
  XCircle,
  X,
  Plus,
  Edit2,
  Trash2,
  Ban,
  Bell,
  Wrench,
  User,
} from "lucide-react";
import standIcon from "../../assets/stand.png";
import {
  getStands,
  createStand,
  updateStand,
  deleteStand,
  batalkanSewa,
  kirimPengingat,
  getPenyewaan,
} from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  textSoft: "#4B5563",
  border: "#E5E7EB",
  maintenance: "#F97316",
};

const KelolaStand = () => {
  const [loading, setLoading] = useState(true);
  const [stands, setStands] = useState([]);
  const [penyewaan, setPenyewaan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatalModalOpen, setIsBatalModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStand, setSelectedStand] = useState(null);
  const [selectedStandForBatal, setSelectedStandForBatal] = useState(null);
  const [alasanBatal, setAlasanBatal] = useState("");
  const [form, setForm] = useState({
    kode_stand: "",
    status_stand: "kosong",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [standsRes, penyewaanRes] = await Promise.all([
        getStands(),
        getPenyewaan(),
      ]);

      setStands(standsRes.data || standsRes);
      setPenyewaan(penyewaanRes || penyewaanRes.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPenyewaanByStand = (standId) => {
    return penyewaan.find(
      (p) =>
        p.stand_id === standId &&
        (p.status_sewa === "aktif" || p.status_sewa === "menunggu pembayaran")
    );
  };

  const canShowPengingatButton = (penyewaanData) => {
    if (!penyewaanData) return false;

    const today = new Date();
    const mulaiSewa = new Date(penyewaanData.tanggal_mulai_sewa);
    const batasAkhir = new Date(mulaiSewa);
    batasAkhir.setDate(batasAkhir.getDate() + 7);

    return today >= mulaiSewa && today <= batasAkhir;
  };

  const openAddModal = () => {
    setIsEdit(false);
    setSelectedStand(null);
    setForm({
      kode_stand: "",
      status_stand: "kosong",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (stand) => {
    if (stand.status_stand === "terisi") {
      return alert("Stand yang sudah terisi tidak dapat diedit!");
    }

    setIsEdit(true);
    setSelectedStand(stand);
    setForm({
      kode_stand: stand.kode_stand,
      status_stand: stand.status_stand,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStand(null);
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const openBatalModal = (stand) => {
    setSelectedStandForBatal(stand);
    setAlasanBatal("");
    setIsBatalModalOpen(true);
  };

  const closeBatalModal = () => {
    setSelectedStandForBatal(null);
    setAlasanBatal("");
    setIsBatalModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
  // ✅ VALIDASI INPUT KOSONG
  if (!form.kode_stand || !form.status_stand) {
    return alert("Semua field harus diisi!");
  }

  // ✅ VALIDASI FORMAT KODE STAND (OPSIONAL)
  if (!/^[A-Z0-9]+$/i.test(form.kode_stand)) {
    return alert("Kode stand hanya boleh mengandung huruf dan angka (contoh: A01, B12, dst)");
  }

  setSubmitting(true);
  try {
    const payload = {
      kode_stand: form.kode_stand.toUpperCase(), // ✅ CONVERT KE UPPERCASE
      status_stand: form.status_stand,
    };

    if (isEdit) {
      await updateStand(selectedStand.id, payload);
      alert("Stand berhasil diupdate!");
    } else {
      await createStand(payload);
      alert("Stand berhasil ditambahkan!");
    }

    closeModal();
    fetchData();
  } catch (err) {
    console.error(err);
    
    // ✅ DETEKSI ERROR DARI BACKEND
    const errorMessage = err.response?.data?.message || "";
    const errorDetails = err.response?.data?.errors?.kode_stand?.[0] || "";
    
    // ✅ CEK APAKAH ERROR DUPLICATE KODE STAND
    if (
      errorMessage.toLowerCase().includes("kode_stand") || 
      errorMessage.toLowerCase().includes("duplicate") || 
      errorMessage.toLowerCase().includes("sudah ada") ||
      errorMessage.toLowerCase().includes("already been taken") ||
      errorDetails.toLowerCase().includes("already been taken")
    ) {
      alert(`Gagal menyimpan stand!\n\nKode stand "${form.kode_stand}" sudah digunakan. Silakan gunakan kode stand yang berbeda.`);
    } else {
      // ✅ ERROR LAINNYA
      alert(`Gagal menyimpan stand!\n\n${errorMessage || "Terjadi kesalahan pada server."}`);
    }
  } finally {
    setSubmitting(false);
  }
  };


  const handleDelete = async (id, stand) => {
    if (stand.status_stand === "terisi") {
      return alert("Stand yang sudah terisi tidak dapat dihapus!");
    }

    if (!window.confirm("Yakin ingin menghapus stand ini?")) return;

    try {
      await deleteStand(id);
      alert("Stand berhasil dihapus!");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus stand!");
    }
  };

  // ✅ VALIDASI MINIMAL 10 KARAKTER
  const handleBatalSewa = async () => {
    if (!alasanBatal.trim()) {
      return alert("Alasan pembatalan tidak boleh kosong!");
    }

    if (alasanBatal.length < 10) {
      return alert("Alasan pembatalan minimal 10 karakter!");
    }

    setSubmitting(true);
    try {
      await batalkanSewa(selectedStandForBatal.id, alasanBatal);
      alert("Sewa berhasil dibatalkan!");
      closeBatalModal();
      fetchData();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Gagal membatalkan sewa!";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKirimPengingat = async (standId) => {
    try {
      await kirimPengingat(standId);
      alert("Pengingat berhasil dikirim ke penyewa!");
      fetchData();
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.message || "Gagal mengirim pengingat!";
      alert(errorMsg);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2647]">
                Kelola Stand
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Tambah, edit, hapus, dan pengingat sewa
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: THEME.gold }}
            >
              <Plus className="w-4 h-4" />
              Tambah Stand
            </button>
          </div>

          {/* GRID STAND */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20" style={{ color: THEME.textSoft }}>
                <p>Memuat data stand...</p>
              </div>
            ) : stands.length === 0 ? (
              <div className="col-span-full text-center py-20" style={{ color: THEME.textSoft }}>
                <img src={standIcon} className="w-16 h-16 mx-auto mb-3 opacity-30" alt="Stand" />
                <p>Belum ada stand tersedia</p>
              </div>
            ) : (
              stands.map((stand) => {
                const isKosong = stand.status_stand === "kosong";
                const isTerisi = stand.status_stand === "terisi";
                const isMaintenance = stand.status_stand === "maintenance";

                const penyewaanData = getPenyewaanByStand(stand.id);
                const isMenungguPembayaran =
                  penyewaanData?.status_sewa === "menunggu pembayaran" &&
                  penyewaanData?.status_pembayaran === "menunggu pembayaran";

                const showPengingatButton =
                  isMenungguPembayaran && canShowPengingatButton(penyewaanData);

                let headerBg = THEME.navy;
                if (isTerisi) headerBg = THEME.cabernet;
                if (isMaintenance) headerBg = THEME.maintenance;

                return (
                  <div
                    key={stand.id}
                    className="bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col hover:shadow-lg"
                    style={{ borderColor: THEME.border }}
                  >
                    {/* Header Stand */}
                    <div className="p-5 text-center" style={{ background: headerBg, color: "white" }}>
                      <img src={standIcon} alt="Stand Icon" className="w-12 h-12 mx-auto mb-2 filter brightness-0 invert" />
                      <h3 className="text-xl font-bold">{stand.kode_stand}</h3>
                      <p className="text-xs mt-1 opacity-90">Rp 750.000</p>
                    </div>

                    {/* Status */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                      {isKosong ? (
                        <>
                          <CheckCircle2 className="w-12 h-12" style={{ color: THEME.navy }} />
                          <p className="text-sm font-bold" style={{ color: THEME.navy }}>
                            Tersedia
                          </p>
                        </>
                      ) : isMaintenance ? (
                        <>
                          <Wrench className="w-12 h-12" style={{ color: THEME.maintenance }} />
                          <p className="text-sm font-bold" style={{ color: THEME.maintenance }}>
                            Maintenance
                          </p>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-12 h-12" style={{ color: THEME.cabernet }} />
                          <p className="text-sm font-bold" style={{ color: THEME.cabernet }}>
                            Terisi
                          </p>
                          {penyewaanData && (
                            <>
                              {isMenungguPembayaran && (
                                <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: `${THEME.gold}20`, color: THEME.gold }}>
                                  Menunggu Bayar
                                </span>
                              )}
                              <div className="flex items-center gap-1 mt-1">
                                <User className="w-3 h-3" style={{ color: THEME.textSoft }} />
                                <p className="text-xs text-center font-semibold" style={{ color: THEME.textSoft }}>
                                  {penyewaanData.pengajuan?.nama_pengaju || penyewaanData.user?.name || "Unknown"}
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 space-y-2">
                      {!isTerisi && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(stand)}
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90"
                            style={{ background: `${THEME.navy}15`, color: THEME.navy }}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(stand.id, stand)}
                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90"
                            style={{ background: `${THEME.cabernet}15`, color: THEME.cabernet }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </div>
                      )}

                      {isTerisi && isMenungguPembayaran && (
                        <>
                          {showPengingatButton && (
                            <button
                              onClick={() => handleKirimPengingat(stand.id)}
                              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white transition hover:opacity-90"
                              style={{ background: THEME.gold }}
                            >
                              <Bell className="w-4 h-4" />
                              Pengingat
                            </button>
                          )}
                          <button
                            onClick={() => openBatalModal(stand)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white transition hover:opacity-90"
                            style={{ background: THEME.cabernet }}
                          >
                            <Ban className="w-4 h-4" />
                            Batal Sewa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL FORM ADD/EDIT */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border relative" style={{ borderColor: THEME.border }}>
              <div className="p-5 border-b flex items-center justify-between" style={{ background: THEME.navy, borderColor: THEME.border }}>
                <h2 className="text-xl font-bold text-white">
                  {isEdit ? "Edit Stand" : "Tambah Stand Baru"}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: THEME.navy }}>
                    Kode Stand
                  </label>
                  <input
                    type="text"
                    value={form.kode_stand}
                    onChange={(e) => handleFormChange("kode_stand", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 outline-none"
                    style={{ borderColor: THEME.border }}
                    placeholder="A01, A02, A03, dst"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: THEME.navy }}>
                    Harga Sewa
                  </label>
                  <input
                    type="text"
                    value="Rp 750.000"
                    disabled
                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                    style={{ borderColor: THEME.border, color: THEME.textSoft }}
                  />
                  <p className="text-xs mt-1" style={{ color: THEME.textSoft }}>
                    Harga sewa fixed dari sistem
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2" style={{ color: THEME.navy }}>
                    Status Stand
                  </label>
                  <select
                    value={form.status_stand}
                    onChange={(e) => handleFormChange("status_stand", e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 outline-none"
                    style={{ borderColor: THEME.border }}
                  >
                    <option value="kosong">Kosong</option>
                    <option value="terisi">Terisi</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="p-5 border-t bg-gray-50 flex gap-3" style={{ borderColor: THEME.border }}>
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-lg font-semibold border transition"
                  style={{ borderColor: THEME.border, color: THEME.textSoft }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"
                  style={{ background: THEME.gold }}
                >
                  {submitting ? "Menyimpan..." : isEdit ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ MODAL FORM BATAL SEWA (SAMA DENGAN REJECT PENGAJUAN) */}
        {isBatalModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border relative" style={{ borderColor: THEME.border }}>
              {/* Header Modal - MERAH */}
              <div className="p-5 border-b flex items-center justify-between" style={{ background: THEME.cabernet, borderColor: THEME.border }}>
                <div>
                  <h2 className="text-xl font-bold text-white">Batalkan Sewa Stand</h2>
                  <p className="text-sm text-white/80 mt-1">{selectedStandForBatal?.kode_stand}</p>
                </div>
                <button onClick={closeBatalModal} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Form Input Alasan */}
              <div className="p-5">
                <label className="text-sm font-semibold block mb-2" style={{ color: THEME.navy }}>
                  Alasan Pembatalan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={alasanBatal}
                  onChange={(e) => setAlasanBatal(e.target.value)}
                  rows="5"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none resize-none"
                  style={{ borderColor: THEME.border }}
                  placeholder="Jelaskan alasan pembatalan sewa (minimal 10 karakter)"
                />
                <p className="text-xs mt-2" style={{ color: THEME.textSoft }}>
                  {alasanBatal.length}/500 karakter (minimal 10)
                </p>
              </div>

              {/* Footer Modal */}
              <div className="p-5 border-t bg-gray-50 flex gap-3" style={{ borderColor: THEME.border }}>
                <button
                  onClick={closeBatalModal}
                  className="flex-1 py-3 rounded-lg font-semibold border transition"
                  style={{ borderColor: THEME.border, color: THEME.textSoft }}
                >
                  Batal
                </button>
                <button
                  onClick={handleBatalSewa}
                  disabled={submitting || alasanBatal.length < 10}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: THEME.cabernet }}
                >
                  {submitting ? "Membatalkan..." : "Batalkan Sewa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KelolaStand;
