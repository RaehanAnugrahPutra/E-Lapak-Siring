// src/pages/penyewa/StandAnda.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Store } from "lucide-react";
import { getPenyewaan, createMidtransPayment } from "../../api/Api";

/* ---------- Tema ---------- */
const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  border: "#E5E7EB",
  textSoft: "#4B5563",
  bgSoft: "#F7F7F7",
};

/* ---------- Helpers ---------- */
function formatRupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function StandAnda() {
  const [stands, setStands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStands();
  }, []);

  const fetchStands = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) return setLoading(false);

      const res = await getPenyewaan();
      const data = res?.data || res?.penyewaan || res || [];

      const userStands = data.filter((item) => item.user_id === user.id);
      setStands(userStands);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fungsi bayar pakai Midtrans Snap
  const handleBayarMidtrans = async (stand) => {
    try {
      // 1. Minta snap_token ke backend
      const res = await createMidtransPayment(stand.id);
      if (!res.success) {
        alert(res.message || "Gagal membuat transaksi pembayaran");
        return;
      }

      const snapToken = res.snap_token;

      if (!window.snap) {
        alert("Midtrans Snap belum terload. Coba refresh halaman.");
        return;
      }

      // 2. Buka popup Midtrans
      window.snap.pay(snapToken, {
        onSuccess: async (result) => {
          console.log("Success:", result);
          alert("Pembayaran berhasil.");
          await fetchStands(); // refresh status
        },
        onPending: (result) => {
          console.log("Pending:", result);
          alert("Menunggu pembayaran. Silakan selesaikan pembayaran Anda.");
        },
        onError: (result) => {
          console.log("Error:", result);
          alert("Terjadi kesalahan saat pembayaran.");
        },
        onClose: () => {
          console.log("Popup ditutup");
          // optional: alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Gagal memulai pembayaran.");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
          <div
            className="max-w-4xl mx-auto text-center py-16"
            style={{ color: THEME.textSoft }}
          >
            <p className="text-sm">Memuat data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (stands.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <Store
                className="w-14 h-14 mx-auto mb-3 opacity-30"
                style={{ color: THEME.textSoft }}
              />
              <p className="text-base" style={{ color: THEME.textSoft }}>
                Anda belum memiliki penyewaan aktif.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div
        className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-poppins"
        style={{ backgroundColor: THEME.bgSoft }}
      >
        <div className="max-w-4xl mx-auto">
          {/* TITLE */}
          <div className="mb-6 text-center">
            <h1
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ color: THEME.navy }}
            >
              Stand Anda
            </h1>
            <p
              className="mt-1 text-xs sm:text-sm"
              style={{ color: THEME.textSoft }}
            >
              Lihat status pembayaran dan informasi stand yang Anda sewa.
            </p>
          </div>

          {/* LIST STAND */}
          <div className="space-y-5">
            {stands.map((stand) => {
              const isPaid =
                stand.status_pembayaran === "lunas" ||
                stand.status_pembayaran === "berhasil" ||
                stand.status_pembayaran === "dibayar";
              const isMenunggu =
                stand.status_pembayaran === "menunggu pembayaran";

              return (
                <div key={stand.id}>
                  {/* MAIN CARD */}
                  <div
                    className="bg-white border rounded-xl shadow-sm p-5 mb-4"
                    style={{ borderColor: THEME.border }}
                  >
                    {/* Header */}
                    <div
                      className="rounded-lg mb-5 px-4 py-3 flex justify-between items-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(13,38,71,0.96), rgba(13,38,71,0.85))",
                        color: "#FFFFFF",
                      }}
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide opacity-80">
                          INFORMASI STAND
                        </p>
                        <h2 className="text-xl font-bold mt-0.5">
                          Stand {stand.stand?.kode_stand || "-"}
                        </h2>
                        <p className="text-xs mt-0.5 opacity-90">
                          Kontrak: {formatDate(stand.tanggal_mulai_sewa)} —{" "}
                          {formatDate(stand.tanggal_selesai_sewa)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs opacity-80">Status Sewa</p>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5"
                          style={{
                            backgroundColor:
                              stand.status_sewa === "aktif"
                                ? "rgba(34,197,94,0.15)"
                                : stand.status_sewa === "dibatalkan"
                                ? "rgba(239,68,68,0.15)"
                                : "rgba(251,191,36,0.15)",
                            color:
                              stand.status_sewa === "aktif"
                                ? "#16A34A"
                                : stand.status_sewa === "dibatalkan"
                                ? "#DC2626"
                                : "#D97706",
                          }}
                        >
                          {stand.status_sewa}
                        </span>
                      </div>
                    </div>

                    {/* INFO PEMBAYARAN */}
                    <div>
                      <p
                        className="text-xs mb-3 font-medium flex items-center justify-between"
                        style={{ color: THEME.textSoft }}
                      >
                        <span>Status Pembayaran</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: isPaid
                              ? "rgba(34,197,94,0.15)"
                              : "rgba(239,68,68,0.15)",
                            color: isPaid ? "#16A34A" : "#DC2626",
                          }}
                        >
                          {isPaid ? "berhasil" : stand.status_pembayaran}
                        </span>
                      </p>

                      {/* Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p
                            className="text-xs uppercase tracking-wide mb-0.5"
                            style={{ color: THEME.textSoft }}
                          >
                            TOTAL TAGIHAN
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{ color: THEME.navy }}
                          >
                            {formatRupiah(stand.total_pembayaran)}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: THEME.textSoft }}
                          >
                            Durasi: {stand.durasi_sewa} hari
                          </p>
                        </div>

                        <div>
                          <p
                            className="text-xs uppercase tracking-wide mb-0.5"
                            style={{ color: THEME.textSoft }}
                          >
                            HARGA SEWA
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{ color: THEME.navy }}
                          >
                            {formatRupiah(stand.harga_sewa)}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: THEME.textSoft }}
                          >
                            per bulan
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Bayar */}
                    {isMenunggu && (
                      <div className="mt-5">
                        <button
                          onClick={() => handleBayarMidtrans(stand)}
                          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
                          style={{ background: THEME.navy }}
                        >
                          Bayar Sekarang
                        </button>
                      </div>
                    )}

                    {isPaid && (
                      <button
                        disabled
                        className="w-full mt-5 py-2.5 rounded-lg font-bold text-sm transition disabled:opacity-70"
                        style={{
                          backgroundColor: THEME.navy,
                          color: "white",
                        }}
                      >
                        ✓ Pembayaran Lunas
                      </button>
                    )}
                  </div>

                  {/* DETAIL CARD */}
                  <div
                    className="bg-white border rounded-xl shadow-sm p-5"
                    style={{ borderColor: THEME.border }}
                  >
                    <h2
                      className="text-base font-bold mb-3"
                      style={{ color: THEME.navy }}
                    >
                      Detail Penyewaan
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p
                          className="text-xs uppercase tracking-wide mb-0.5"
                          style={{ color: THEME.textSoft }}
                        >
                          NAMA Penyewa
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: THEME.navy }}
                        >
                          {stand.pengajuan?.nama_pengaju || "-"}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-xs uppercase tracking-wide mb-0.5"
                          style={{ color: THEME.textSoft }}
                        >
                          NO. HP
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: THEME.navy }}
                        >
                          {stand.pengajuan?.no_hp || "-"}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-xs uppercase tracking-wide mb-0.5"
                          style={{ color: THEME.textSoft }}
                        >
                          STATUS STAND
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: THEME.navy }}
                        >
                          {stand.stand?.status_stand || "-"}
                        </p>
                      </div>

                      <div>
                        <p
                          className="text-xs uppercase tracking-wide mb-0.5"
                          style={{ color: THEME.textSoft }}
                        >
                          METODE PEMBAYARAN
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: THEME.navy }}
                        >
                          {stand.payment_type
                            ? stand.payment_type.toUpperCase()
                            : "Belum Memilih"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
