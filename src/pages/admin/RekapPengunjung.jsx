// src/pages/admin/RekapPengunjung.jsx
import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  Calendar,
  TrendingUp,
  ArrowUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Palet warna selaras dengan Dashboard
const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  border: "#E5E7EB",
  textSoft: "#4B5563",
};

const RekapPengunjung = () => {
  // Data statistik
  const statsData = [
    { 
      title: "Pengunjung Hari Ini", 
      value: 324, 
      change: "+12%", 
      trend: "up", 
      icon: Users,
      suffix: "orang"
    },
    { 
      title: "Total Bulan Ini", 
      value: "8.72K", 
      change: "+23%", 
      trend: "up", 
      icon: Calendar,
      suffix: "pengunjung"
    },
    { 
      title: "Rata-rata per Hari", 
      value: 291, 
      change: "+8%", 
      trend: "up", 
      icon: TrendingUp,
      suffix: "orang"
    },
  ];

  // Data chart mingguan
  const chartData = [
    { day: "Senin", value: 280 },
    { day: "Selasa", value: 310 },
    { day: "Rabu", value: 295 },
    { day: "Kamis", value: 350 },
    { day: "Jumat", value: 400 },
    { day: "Sabtu", value: 500 },
    { day: "Minggu", value: 420 },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-4 py-3 rounded-lg shadow-lg"
          style={{
            background: "white",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: THEME.navy }}>
            {payload[0].payload.day}
          </p>
          <p className="text-base font-bold" style={{ color: THEME.gold }}>
            {payload[0].value.toLocaleString()} pengunjung
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-10 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-7xl mx-auto">
          {/* TITLE */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-[#0D2647]">Rekap Pengunjung</h1>
            <p className="mt-2 text-gray-600">
              Statistik dan tren pengunjung kawasan wisata
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsData.map((card, index) => {
              const Icon = card.icon;
              const TrendIcon = ArrowUp;

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border transition hover:shadow-md"
                  style={{ borderColor: THEME.border }}
                >
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon */}
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        background: THEME.navy,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "white" }} />
                    </div>

                    {/* Badge dengan warna gold */}
                    <div
                      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `${THEME.gold}20`,
                        color: THEME.gold,
                      }}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {card.change}
                    </div>
                  </div>

                  <p className="text-sm font-medium" style={{ color: THEME.textSoft }}>
                    {card.title}
                  </p>

                  <p
                    className="text-3xl font-bold mt-1"
                    style={{ color: THEME.navy }}
                  >
                    {typeof card.value === 'number' 
                      ? card.value.toLocaleString("id-ID") 
                      : card.value}
                  </p>

                  <p className="text-xs mt-1" style={{ color: THEME.textSoft }}>
                    {card.suffix}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CHART */}
          <div
            className="bg-white rounded-2xl p-8 shadow-sm border"
            style={{ borderColor: THEME.border }}
          >
            <h2 className="text-xl font-bold mb-1" style={{ color: THEME.navy }}>
              Tren Pengunjung 7 Hari Terakhir
            </h2>
            <p className="mb-6" style={{ color: THEME.textSoft }}>
              Data pengunjung kawasan wisata dalam seminggu terakhir
            </p>

            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.navy} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={THEME.navy} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fill: THEME.textSoft }} />
                  <YAxis
                    tick={{ fill: THEME.textSoft }}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={THEME.navy}
                    strokeWidth={3}
                    fill="url(#chartFill)"
                    dot={{ r: 4, fill: THEME.navy }}
                    activeDot={{ r: 8, fill: THEME.gold }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RekapPengunjung;
