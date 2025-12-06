// src/pages/penyewa/Stand.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CheckCircle2, XCircle, X, Wrench, Clock } from "lucide-react";
import standIcon from "../../assets/stand.png";
import { getStands, createPengajuan, getPengajuan } from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  textSoft: "#4B5563",
  border: "#E5E7EB",
  maintenance: "#F97316",
};

const Stand = () => {
  const [loading, setLoading] = useState(true);
  const [stands, setStands] = useState([]);
  const [myPengajuan, setMyPengajuan] = useState([]);
  const [selectedStand, setSelectedStand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    nama_pengaju: "",
    no_hp: "",
    surat_pengajuan: null,
    tanggal_mulai_sewa: "",
    tanggal_selesai_sewa: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [standsRes, pengajuanRes] = await Promise.all([
        getStands(),
        getPengajuan(),
      ]);

      setStands(standsRes.data || standsRes);

      const userId = localStorage.getItem("userId");

      console.log("🔍 USER ID:", userId);
      console.log("📋 ALL PENGAJUAN:", pengajuanRes.data || pengajuanRes);

      const mySubmissions = (pengajuanRes.data || pengajuanRes).filter(
        (p) => p.user_id == userId && p.status === "pending"
      );

      console.log("✅ MY PENGAJUAN:", mySubmissions);
      setMyPengajuan(mySubmissions);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const isStandDiajukan = (standId) => {
    return myPengajuan.some((p) => p.stand_id === standId);
  };

  const openModal = (stand) => {
    if (stand.status_stand === "terisi" || stand.status_stand === "maintenance") {
      return;
    }

    if (isStandDiajukan(stand.id)) {
      return alert("Anda sudah mengajukan stand ini. Mohon tunggu persetujuan admin.");
    }

    setSelectedStand(stand);
    setForm({
      nama_pengaju: "",
      no_hp: "",
      surat_pengajuan: null,
      tanggal_mulai_sewa: "",
      tanggal_selesai_sewa: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStand(null);
    setIsModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitPengajuan = async () => {
    if (
      !form.nama_pengaju ||
      !form.no_hp ||
      !form.surat_pengajuan ||
      !form.tanggal_mulai_sewa ||
      !form.tanggal_selesai_sewa
    ) {
      return alert("Semua field harus diisi!");
    }

    // ✅ VALIDASI NO HP (Bahasa Indonesia)
    if (form.no_hp.length > 15) {
      return alert("Nomor HP maksimal 15 karakter!");
    }

    const start = new Date(form.tanggal_mulai_sewa);
    const end = new Date(form.tanggal_selesai_sewa);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return alert("Durasi sewa minimal 30 hari!");
    }

    const formData = new FormData();
    formData.append("stand_id", selectedStand.id);
    formData.append("nama_pengaju", form.nama_pengaju);
    formData.append("no_hp", form.no_hp);
    formData.append("surat_pengajuan", form.surat_pengajuan);
    formData.append("tanggal_mulai_sewa", form.tanggal_mulai_sewa);
    formData.append("tanggal_selesai_sewa", form.tanggal_selesai_sewa);

    setSubmitting(true);
    try {
      await createPengajuan(formData);
      alert("Pengajuan berhasil dikirim!");
      closeModal();
      fetchData();
    } catch (err) {
      console.error("ERROR DETAIL:", err.response?.data || err);

      // ✅ TANGANI ERROR BAHASA INDONESIA
      if (err.response?.data?.errors?.no_hp) {
        alert("Nomor HP maksimal 15 karakter!");
      } else if (err.response?.data?.message) {
        alert("Gagal mengajukan sewa: " + err.response.data.message);
      } else if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat().join("\n");
        alert("Gagal mengajukan sewa:\n" + messages);
      } else {
        alert("Gagal mengajukan sewa. Pastikan semua field sudah diisi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-4xl mx-auto">
          {/* TITLE */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2647]">
              Daftar Stand
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">
              Pilih stand yang tersedia untuk mengajukan sewa
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
                const isKosong = stand.status_stand === "kosong";
                const isTerisi = stand.status_stand === "terisi";
                const isMaintenance = stand.status_stand === "maintenance";
                const sudahDiajukan = isStandDiajukan(stand.id);

                let headerBg = THEME.navy;
                if (isTerisi) headerBg = THEME.cabernet;
                if (isMaintenance) headerBg = THEME.maintenance;
                if (sudahDiajukan) headerBg = THEME.gold;

                const isClickable = isKosong && !sudahDiajukan;

                return (
                  <div
                    key={stand.id}
                    onClick={() => isClickable && openModal(stand)}
                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden flex flex-col ${
                      isClickable
                        ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
                        : sudahDiajukan
                        ? "cursor-default"
                        : "cursor-not-allowed"
                    }`}
                    style={{ borderColor: THEME.border }}
                  >
                    {/* ✅ HEADER STAND - BADGE DIHAPUS */}
                    <div className="p-5 text-center" style={{ background: headerBg, color: "white" }}>
                      <img src={standIcon} alt="Stand Icon" className="w-12 h-12 mx-auto mb-2 filter brightness-0 invert" />
                      <h3 className="text-xl font-bold">{stand.kode_stand}</h3>
                      <p className="text-xs mt-1 opacity-90">Rp 750.000</p>
                    </div>

                    {/* Status */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                      {isKosong ? (
                        <>
                          {sudahDiajukan ? (
                            <>
                              <Clock className="w-12 h-12" style={{ color: THEME.gold }} />
                              <p className="text-sm font-bold text-center" style={{ color: THEME.gold }}>
                                Menunggu Persetujuan
                              </p>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-12 h-12" style={{ color: THEME.navy }} />
                              <p className="text-sm font-bold" style={{ color: THEME.navy }}>
                                Tersedia
                              </p>
                            </>
                          )}
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
                        </>
                      )}
                    </div>

                    {/* Button */}
                    {isKosong && !sudahDiajukan && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(stand);
                        }}
                        className="m-3 py-2 rounded-xl font-semibold text-white transition hover:opacity-90"
                        style={{ background: THEME.gold }}
                      >
                        Ajukan Sewa
                      </button>
                    )}

                    {sudahDiajukan && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Pengajuan Anda sedang diproses oleh admin.");
                        }}
                        className="m-3 py-2 rounded-xl font-semibold text-white transition hover:opacity-90"
                        style={{ background: THEME.gold }}
                      >
                        Sudah Diajukan
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL FORM */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border relative max-h-[90vh] overflow-y-auto" style={{ borderColor: THEME.border }}>
              <div className="sticky top-0 p-5 border-b flex items-center justify-between" style={{ background: THEME.navy, borderColor: THEME.border }}>
                <h2 className="text-xl font-bold text-white">
                  Ajukan Sewa Stand {selectedStand?.kode_stand}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Nama Penyewa
                  </label>
                  <input
                    type="text"
                    value={form.nama_pengaju}
                    onChange={(e) => handleFormChange("nama_pengaju", e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 outline-none text-sm"
                    style={{ borderColor: THEME.border }}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* INPUT NO HP DENGAN VALIDASI & COUNTER */}
                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Nomor HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.no_hp}
                    onChange={(e) => handleFormChange("no_hp", e.target.value)}
                    maxLength="15"
                    className="w-full p-2.5 border rounded-lg focus:ring-2 outline-none text-sm"
                    style={{ borderColor: THEME.border }}
                    placeholder="08xxxxxxxxxx"
                  />
                  <p className="text-xs mt-1" style={{ color: THEME.textSoft }}>
                    {form.no_hp.length}/15 karakter (maksimal 15)
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Tanggal Mulai Sewa
                  </label>
                  <input
                    type="date"
                    value={form.tanggal_mulai_sewa}
                    onChange={(e) => handleFormChange("tanggal_mulai_sewa", e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 outline-none text-sm"
                    style={{ borderColor: THEME.border }}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Tanggal Selesai Sewa
                  </label>
                  <input
                    type="date"
                    value={form.tanggal_selesai_sewa}
                    onChange={(e) => handleFormChange("tanggal_selesai_sewa", e.target.value)}
                    className="w-full p-2.5 border rounded-lg focus:ring-2 outline-none text-sm"
                    style={{ borderColor: THEME.border }}
                  />
                  <p className="text-xs mt-1" style={{ color: THEME.textSoft }}>
                    Minimal 30 hari
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-1" style={{ color: THEME.navy }}>
                    Upload Surat Permohonan
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFormChange("surat_pengajuan", e.target.files[0])}
                    className="w-full p-2.5 border rounded-lg bg-white text-sm"
                    style={{ borderColor: THEME.border }}
                  />
                  <a href="#" className="text-xs mt-1 block underline" style={{ color: THEME.gold }}>
                    Download Template Surat
                  </a>
                </div>
              </div>

              <div className="sticky bottom-0 p-5 border-t bg-gray-50" style={{ borderColor: THEME.border }}>
                <button
                  onClick={submitPengajuan}
                  disabled={submitting}
                  className="w-full py-2.5 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: THEME.gold }}
                >
                  {submitting ? "Mengirim..." : "Ajukan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Stand;
