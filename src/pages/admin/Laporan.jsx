// src/pages/admin/Laporan.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Wallet,
  Store,
  AlertCircle,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { getLaporanPenyewaan } from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  textSoft: "#4B5563",
  border: "#E5E7EB",
};

const Laporan = () => {
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState({});
  const [ringkasan, setRingkasan] = useState({});
  const [transaksi, setTransaksi] = useState([]);
  const [filterMode, setFilterMode] = useState("current");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getLaporanPenyewaan(params);

      setPeriode(data.periode);
      const r = data.ringkasan;
      setRingkasan({
        total_pendapatan: Number(r.total_pendapatan),
        total_transaksi_lunas: Number(r.total_transaksi_lunas),
        total_stand_disewa_periode: Number(r.total_stand_disewa_periode),
        stand_belum_bayar_periode: Number(r.stand_belum_bayar_periode),
      });

      setTransaksi(
        data.transaksi_terakhir.map((t) => ({
          ...t,
          total_pembayaran: Number(t.total_pembayaran),
        }))
      );
    } catch (err) {
      console.error("Gagal fetch laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (mode) => {
    setFilterMode(mode);
    if (mode === "current") {
      fetchLaporan();
    } else if (mode === "all") {
      fetchLaporan({ bulan: "all" });
    }
  };

  const handleCustomFilter = () => {
    fetchLaporan({
      tahun: selectedYear,
      bulan: selectedMonth,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cardData = [
    {
      title: "Total Pendapatan",
      value: ringkasan.total_pendapatan,
      icon: Wallet,
      color: THEME.navy,
      isCurrency: true,
    },
    {
      title: "Stand Disewa",
      value: ringkasan.total_stand_disewa_periode,
      icon: Store,
      color: THEME.gold,
      isCurrency: false,
    },
    {
      title: "Belum Bayar",
      value: ringkasan.stand_belum_bayar_periode,
      icon: AlertCircle,
      color: "#F97316",
      isCurrency: false,
    },
  ];

  const StatsCard = ({ title, value, icon: Icon, color, isCurrency = true }) => (
    <div
      className="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all duration-300"
      style={{ borderColor: THEME.border }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <h3 className="text-xs font-semibold mb-1" style={{ color: THEME.textSoft }}>
        {title}
      </h3>
      <p className="text-xl font-bold" style={{ color: THEME.navy }}>
        {isCurrency
          ? `Rp ${value.toLocaleString("id-ID")}`
          : value.toLocaleString("id-ID")}
      </p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-8 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* ✅ HEADER - CENTERED & COMPACT */}
          <div className="text-center">
            <h1 className="text-3xl font-extrabold" style={{ color: THEME.navy }}>
              Laporan Penyewaan
            </h1>
            <p className="mt-1 text-gray-600 text-sm">
              Periode: <span className="font-semibold">{periode.label}</span>
            </p>
          </div>

          {/* FILTER - COMPACT */}
          <div className="bg-white rounded-xl p-5 border shadow-sm" style={{ borderColor: THEME.border }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4" style={{ color: THEME.navy }} />
              <h3 className="text-base font-bold" style={{ color: THEME.navy }}>
                Filter Periode
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Button Bulan Sekarang */}
              <button
                onClick={() => handleFilterChange("current")}
                className={`p-3 rounded-lg border-2 font-semibold text-sm transition ${
                  filterMode === "current"
                    ? "border-[#0D2647] bg-[#0D2647] text-white"
                    : "border-gray-200 hover:border-[#0D2647]"
                }`}
              >
                <RefreshCw className="w-4 h-4 mx-auto mb-1" />
                Bulan Sekarang
              </button>

              {/* Button Semua Periode */}
              <button
                onClick={() => handleFilterChange("all")}
                className={`p-3 rounded-lg border-2 font-semibold text-sm transition ${
                  filterMode === "all"
                    ? "border-[#0D2647] bg-[#0D2647] text-white"
                    : "border-gray-200 hover:border-[#0D2647]"
                }`}
              >
                <Store className="w-4 h-4 mx-auto mb-1" />
                Semua Periode
              </button>

              {/* Button Custom */}
              <button
                onClick={() => setFilterMode("custom")}
                className={`p-3 rounded-lg border-2 font-semibold text-sm transition ${
                  filterMode === "custom"
                    ? "border-[#0D2647] bg-[#0D2647] text-white"
                    : "border-gray-200 hover:border-[#0D2647]"
                }`}
              >
                <Calendar className="w-4 h-4 mx-auto mb-1" />
                Pilih Bulan
              </button>
            </div>

            {/* Custom Filter Input */}
            {filterMode === "custom" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                      Tahun
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 outline-none"
                      style={{ borderColor: THEME.border }}
                    >
                      {[2024, 2025, 2026].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1" style={{ color: THEME.navy }}>
                      Bulan
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="w-full p-2 text-sm border rounded-lg focus:ring-2 outline-none"
                      style={{ borderColor: THEME.border }}
                    >
                      {[
                        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
                      ].map((month, idx) => (
                        <option key={idx} value={idx + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleCustomFilter}
                  className="w-full py-2 rounded-lg font-semibold text-sm text-white transition hover:opacity-90"
                  style={{ background: THEME.gold }}
                >
                  Terapkan Filter
                </button>
              </div>
            )}
          </div>

          {/* LOADING */}
          {loading ? (
            <div className="text-center py-16">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-3" style={{ color: THEME.gold }} />
              <p className="text-sm" style={{ color: THEME.textSoft }}>Memuat laporan...</p>
            </div>
          ) : (
            <>
              {/* CARD RINGKASAN - COMPACT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardData.map((item, i) => (
                  <StatsCard key={i} {...item} />
                ))}
              </div>

              {/* TABEL TRANSAKSI - COMPACT */}
              <div
                className="bg-white rounded-xl p-5 border shadow-sm"
                style={{ borderColor: THEME.border }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: THEME.navy }}>
                  Transaksi Terakhir ({transaksi.length})
                </h3>

                {transaksi.length === 0 ? (
                  <div className="text-center py-10">
                    <Store className="w-14 h-14 mx-auto mb-3 opacity-30" style={{ color: THEME.textSoft }} />
                    <p className="text-sm" style={{ color: THEME.textSoft }}>Belum ada transaksi di periode ini</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2" style={{ borderColor: THEME.border }}>
                          <th className="text-left py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                            No
                          </th>
                          <th className="text-left py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                            Penyewa
                          </th>
                          <th className="text-left py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                            Stand
                          </th>
                          <th className="text-left py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                            Durasi
                          </th>
                          <th className="text-left py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                            Waktu Bayar
                          </th>
                          <th className="text-right py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaksi.map((t, i) => (
                          <tr
                            key={i}
                            className="border-b hover:bg-gray-50 transition"
                            style={{ borderColor: THEME.border }}
                          >
                            <td className="py-3 px-3" style={{ color: THEME.textSoft }}>
                              {i + 1}
                            </td>
                            <td className="py-3 px-3 font-semibold" style={{ color: THEME.navy }}>
                              {t.nama_penyewa}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className="px-2 py-1 rounded-md font-semibold text-xs"
                                style={{
                                  background: `${THEME.gold}20`,
                                  color: THEME.gold,
                                }}
                              >
                                {t.kode_stand}
                              </span>
                            </td>
                            <td className="py-3 px-3" style={{ color: THEME.textSoft }}>
                              {t.durasi_sewa_hari} hari
                            </td>
                            <td className="py-3 px-3 text-xs" style={{ color: THEME.textSoft }}>
                              {formatDate(t.waktu_pembayaran)}
                            </td>
                            <td className="py-3 px-3 text-right font-bold" style={{ color: "#16A34A" }}>
                              Rp {t.total_pembayaran.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2" style={{ borderColor: THEME.navy }}>
                          <td colSpan="5" className="py-3 px-3 text-right font-bold" style={{ color: THEME.navy }}>
                            Total Pendapatan:
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-lg" style={{ color: "#16A34A" }}>
                            Rp {ringkasan.total_pendapatan.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Laporan;
