// src/pages/admin/KelolaPengajuanStand.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CheckCircle2, XCircle, X, Download, Clock, AlertCircle, User } from "lucide-react";
import standIcon from "../../assets/stand.png";
import {
  getStands,
  getPengajuan,
  approvePengajuan,
  rejectPengajuan,
  downloadSuratPengajuan,
  getPenyewaan,
} from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  textSoft: "#4B5563",
  border: "#E5E7EB",
};

const KelolaPengajuanStand = () => {
  const [loading, setLoading] = useState(true);
  const [stands, setStands] = useState([]);
  const [pengajuan, setPengajuan] = useState([]);
  const [penyewaan, setPenyewaan] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ STATE UNTUK MODAL REJECT
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedPengajuanReject, setSelectedPengajuanReject] = useState(null);
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [submittingReject, setSubmittingReject] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [standData, pengajuanData, penyewaanData] = await Promise.all([
        getStands(),
        getPengajuan(),
        getPenyewaan(),
      ]);

      setStands(standData.data || standData);
      setPengajuan(pengajuanData.data || pengajuanData);
      setPenyewaan(penyewaanData || penyewaanData.data || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPengajuanByStand = (standId) => {
    const stand = stands.find((s) => s.id === standId);
    if (stand && stand.status_stand === "terisi") {
      return [];
    }
    return pengajuan.filter((p) => p.stand_id === standId && p.status === "pending");
  };

  const getPenyewaanByStand = (standId) => {
    return penyewaan.find(
      (p) =>
        p.stand_id === standId &&
        (p.status_sewa === "aktif" || p.status_sewa === "menunggu pembayaran")
    );
  };

  const openModal = (stand) => {
    const standPengajuan = getPengajuanByStand(stand.id);
    if (standPengajuan.length === 0) return;
    setSelectedStand(stand);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStand(null);
    setIsModalOpen(false);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Yakin ingin menyetujui pengajuan ini? Pengajuan lain untuk stand ini akan otomatis ditolak.")) return;
    try {
      await approvePengajuan(id);
      alert("Pengajuan berhasil disetujui! Pengajuan lain untuk stand ini otomatis ditolak.");
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menyetujui pengajuan!");
    }
  };

  // ✅ BUKA MODAL REJECT
  const openRejectModal = (pengajuan) => {
    setSelectedPengajuanReject(pengajuan);
    setAlasanPenolakan("");
    setIsRejectModalOpen(true);
  };

  // ✅ TUTUP MODAL REJECT
  const closeRejectModal = () => {
    setSelectedPengajuanReject(null);
    setAlasanPenolakan("");
    setIsRejectModalOpen(false);
  };

  // ✅ SUBMIT REJECT DENGAN ALASAN
  const handleRejectSubmit = async () => {
    if (!alasanPenolakan.trim()) {
      return alert("Alasan penolakan tidak boleh kosong!");
    }

    if (alasanPenolakan.length < 10) {
      return alert("Alasan penolakan minimal 10 karakter!");
    }

    setSubmittingReject(true);
    try {
      await rejectPengajuan(selectedPengajuanReject.id, alasanPenolakan);
      alert("Pengajuan berhasil ditolak!");
      closeRejectModal();
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menolak pengajuan!");
    } finally {
      setSubmittingReject(false);
    }
  };

  const handleDownload = async (id, nama) => {
    try {
      const blob = await downloadSuratPengajuan(id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Surat_${nama}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Gagal mendownload surat!");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-4xl mx-auto">
          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2647]">
              Kelola Pengajuan Stand
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Klik stand untuk melihat dan mengelola pengajuan
            </p>
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
                const standPengajuan = getPengajuanByStand(stand.id);
                const hasPengajuan = standPengajuan.length > 0;
                const isKosong = stand.status_stand === "kosong";
                const isTerisi = stand.status_stand === "terisi";
                const isMaintenance = stand.status_stand === "maintenance";

                const penyewaanData = getPenyewaanByStand(stand.id);

                let headerBg = THEME.navy;
                if (isTerisi) headerBg = THEME.cabernet;
                else if (isMaintenance) headerBg = "#F97316";
                else if (hasPengajuan) headerBg = THEME.gold;

                return (
                  <div
                    key={stand.id}
                    onClick={() => hasPengajuan && !isTerisi && openModal(stand)}
                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col ${
                      hasPengajuan && !isTerisi
                        ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
                        : "cursor-default"
                    }`}
                    style={{ borderColor: THEME.border }}
                  >
                    {/* Header Stand */}
                    <div className="p-5 text-center relative" style={{ background: headerBg, color: "white" }}>
                      {hasPengajuan && !isTerisi && (
                        <span className="absolute top-2 right-2 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow font-bold text-sm">
                          <span style={{ color: THEME.gold }}>{standPengajuan.length}</span>
                        </span>
                      )}
                      <img src={standIcon} alt="Stand Icon" className="w-12 h-12 mx-auto mb-2 filter brightness-0 invert" />
                      <h3 className="text-xl font-bold">{stand.kode_stand}</h3>
                      <p className="text-xs mt-1 opacity-90">Rp {stand.harga_sewa?.toLocaleString() || "0"}</p>
                    </div>

                    {/* Status */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                      {isTerisi ? (
                        <>
                          <XCircle className="w-12 h-12" style={{ color: THEME.cabernet }} />
                          <p className="text-sm font-bold" style={{ color: THEME.cabernet }}>Terisi</p>
                          {penyewaanData && (
                            <div className="flex items-center gap-1 mt-1">
                              <User className="w-3 h-3" style={{ color: THEME.textSoft }} />
                              <p className="text-xs text-center font-semibold" style={{ color: THEME.textSoft }}>
                                {penyewaanData.pengajuan?.nama_pengaju || penyewaanData.user?.name || "Unknown"}
                              </p>
                            </div>
                          )}
                        </>
                      ) : isMaintenance ? (
                        <>
                          <AlertCircle className="w-12 h-12" style={{ color: "#F97316" }} />
                          <p className="text-sm font-bold" style={{ color: "#F97316" }}>Maintenance</p>
                        </>
                      ) : hasPengajuan ? (
                        <>
                          <Clock className="w-12 h-12" style={{ color: THEME.gold }} />
                          <p className="text-sm font-bold" style={{ color: THEME.gold }}>{standPengajuan.length} Pengajuan</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-12 h-12" style={{ color: THEME.textSoft }} />
                          <p className="text-sm font-bold text-center px-2" style={{ color: THEME.textSoft }}>Belum Ada Pengajuan</p>
                        </>
                      )}
                    </div>

                    {hasPengajuan && !isTerisi && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(stand);
                        }}
                        className="m-3 py-2 rounded-xl font-semibold text-white transition hover:opacity-90"
                        style={{ background: THEME.gold }}
                      >
                        Lihat Pengajuan
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL LIST PENGAJUAN */}
        {isModalOpen && selectedStand && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border relative max-h-[90vh] overflow-y-auto" style={{ borderColor: THEME.border }}>
              {/* Header Modal */}
              <div className="sticky top-0 p-5 border-b flex items-center justify-between z-10" style={{ background: THEME.navy, borderColor: THEME.border }}>
                <div>
                  <h2 className="text-xl font-bold text-white">Pengajuan Stand {selectedStand.kode_stand}</h2>
                  <p className="text-sm text-white/80 mt-1">{getPengajuanByStand(selectedStand.id).length} pengajuan menunggu persetujuan</p>
                </div>
                <button onClick={closeModal} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* List Pengajuan */}
              <div className="p-5 space-y-4">
                {getPengajuanByStand(selectedStand.id).map((item) => (
                  <div key={item.id} className="p-5 rounded-xl border" style={{ borderColor: THEME.border }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold" style={{ color: THEME.navy }}>{item.nama_pengaju}</h3>
                        <p className="text-sm mt-1" style={{ color: THEME.textSoft }}>{item.no_hp}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${THEME.gold}20`, color: THEME.gold }}>Pending</span>
                    </div>

                    {/* Info Tanggal */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" style={{ color: THEME.textSoft }} />
                        <span style={{ color: THEME.textSoft }}>
                          Diajukan: <span className="font-semibold" style={{ color: THEME.navy }}>{formatDate(item.created_at)}</span>
                        </span>
                      </div>
                      <div className="text-sm" style={{ color: THEME.textSoft }}>
                        Periode Sewa: <span className="font-semibold" style={{ color: THEME.navy }}>
                          {new Date(item.tanggal_mulai_sewa).toLocaleDateString("id-ID")} - {new Date(item.tanggal_selesai_sewa).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white transition hover:opacity-90"
                        style={{ background: "#16A34A" }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Setujui
                      </button>
                      <button
                        onClick={() => openRejectModal(item)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-white transition hover:opacity-90"
                        style={{ background: THEME.cabernet }}
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </button>
                      <button
                        onClick={() => handleDownload(item.id, item.nama_pengaju)}
                        className="px-4 py-2.5 rounded-lg font-semibold transition"
                        style={{ background: `${THEME.navy}15`, color: THEME.navy }}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Modal */}
              <div className="sticky bottom-0 p-5 border-t bg-gray-50" style={{ borderColor: THEME.border }}>
                <button onClick={closeModal} className="w-full py-2.5 rounded-lg font-semibold transition" style={{ background: THEME.border, color: THEME.textSoft }}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ MODAL REJECT DENGAN INPUT ALASAN (UI MERAH) */}
        {isRejectModalOpen && selectedPengajuanReject && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border relative" style={{ borderColor: THEME.border }}>
              {/* Header Modal Reject - MERAH */}
              <div className="p-5 border-b flex items-center justify-between" style={{ background: THEME.cabernet, borderColor: THEME.border }}>
                <div>
                  <h2 className="text-xl font-bold text-white">Tolak Pengajuan</h2>
                  <p className="text-sm text-white/80 mt-1">{selectedPengajuanReject.nama_pengaju}</p>
                </div>
                <button onClick={closeRejectModal} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Form Input Alasan */}
              <div className="p-5">
                <label className="text-sm font-semibold block mb-2" style={{ color: THEME.navy }}>
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={alasanPenolakan}
                  onChange={(e) => setAlasanPenolakan(e.target.value)}
                  rows="5"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none resize-none"
                  style={{ borderColor: THEME.border }}
                  placeholder="Jelaskan alasan penolakan (minimal 10 karakter)"
                />
                <p className="text-xs mt-2" style={{ color: THEME.textSoft }}>
                  {alasanPenolakan.length}/500 karakter (minimal 10)
                </p>
              </div>

              {/* Footer Modal Reject */}
              <div className="p-5 border-t bg-gray-50 flex gap-3" style={{ borderColor: THEME.border }}>
                <button
                  onClick={closeRejectModal}
                  className="flex-1 py-3 rounded-lg font-semibold border transition"
                  style={{ borderColor: THEME.border, color: THEME.textSoft }}
                >
                  Batal
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={submittingReject || alasanPenolakan.length < 10}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: THEME.cabernet }}
                >
                  {submittingReject ? "Menolak..." : "Tolak Pengajuan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KelolaPengajuanStand;
