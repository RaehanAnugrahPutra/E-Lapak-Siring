// src/pages/penyewa/DashboardPenyewa.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  Store,
  PartyPopper,
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
import { getEvents, getStands } from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  border: "#E5E7EB",
  textSoft: "#4B5563",
};

const DashboardPenyewa = () => {
  const [standTersedia, setStandTersedia] = useState(0); // ✅ TAMBAH STATE
  const [eventHariIni, setEventHariIni] = useState(0); // ✅ TAMBAH STATE
  const [pengunjungHariIni] = useState(150);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ FETCH STANDS - HITUNG YANG KOSONG
        const standData = await getStands();
        const stands = standData.data || standData;
        const kosong = stands.filter((s) => s.status_stand === "kosong").length;
        setStandTersedia(kosong);

        // ✅ FETCH EVENTS - HITUNG EVENT HARI INI
        const eventsData = await getEvents();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayEvents = eventsData.filter((event) => {
          const eventDate = new Date(event.tanggal_mulai);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });

        setEventHariIni(todayEvents.length);
      } catch (err) {
        console.error("Gagal fetch dashboard:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ UPDATE STATS DATA - 3 CARDS BARU
  const statsData = [
    {
      title: "Stand Tersedia",
      value: standTersedia,
      change: standTersedia > 0 ? `${standTersedia} stand` : "0",
      icon: Store,
      suffix: "stand",
    },
    {
      title: "Pengunjung Hari Ini",
      value: pengunjungHariIni,
      change: "+45%",
      icon: Users,
      suffix: "orang",
    },
    {
      title: "Event Hari Ini",
      value: eventHariIni,
      change: eventHariIni > 0 ? `+${eventHariIni}` : "0",
      icon: PartyPopper,
      suffix: "event",
    },
  ];

  const chartData = [
    { month: "Jan", value: 15000 },
    { month: "Feb", value: 20000 },
    { month: "Mar", value: 25000 },
    { month: "Apr", value: 30000 },
    { month: "Mei", value: 35000 },
    { month: "Jun", value: 40000 },
    { month: "Jul", value: 45000 },
    { month: "Agt", value: 48000 },
    { month: "Sep", value: 42000 },
    { month: "Okt", value: 46000 },
    { month: "Nov", value: 47000 },
    { month: "Des", value: 50000 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="px-3 py-2 rounded-lg shadow-lg text-xs"
          style={{
            background: "white",
            border: `1px solid ${THEME.border}`,
          }}
        >
          <p className="font-semibold" style={{ color: THEME.navy }}>
            {payload[0].payload.month}
          </p>
          <p className="font-bold mt-0.5" style={{ color: THEME.gold }}>
            {payload[0].value.toLocaleString()} pengunjung
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F7F7F7] py-6 px-4 sm:px-6 lg:px-8 font-poppins">
        <div className="max-w-6xl mx-auto space-y-5">
          {/* ✅ CARDS - 3 CARDS BARU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsData.map((card, index) => {
              const Icon = card.icon;
              const TrendIcon = ArrowUp;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border transition hover:shadow-md"
                  style={{ borderColor: THEME.border }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        background: THEME.navy,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "white" }} />
                    </div>

                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: `${THEME.gold}20`,
                        color: THEME.gold,
                      }}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {card.change}
                    </div>
                  </div>

                  <p className="text-xs font-medium" style={{ color: THEME.textSoft }}>
                    {card.title}
                  </p>

                  <p
                    className="text-2xl font-bold mt-1"
                    style={{ color: THEME.navy }}
                  >
                    {typeof card.value === "number"
                      ? card.value.toLocaleString("id-ID")
                      : card.value}
                  </p>

                  <p className="text-xs mt-0.5" style={{ color: THEME.textSoft }}>
                    {card.suffix}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ✅ CHART - COMPACT */}
          <div
            className="bg-white rounded-xl p-5 shadow-sm border"
            style={{ borderColor: THEME.border }}
          >
            <h2 className="text-lg font-bold mb-0.5" style={{ color: THEME.navy }}>
              Tren Pengunjung Tahunan
            </h2>
            <p className="mb-4 text-sm" style={{ color: THEME.textSoft }}>
              Statistik pengunjung sepanjang tahun 2025
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.navy} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={THEME.navy} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: THEME.textSoft, fontSize: 12 }} 
                  />
                  <YAxis
                    tick={{ fill: THEME.textSoft, fontSize: 12 }}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={THEME.navy}
                    strokeWidth={2}
                    fill="url(#chartFill)"
                    dot={{ r: 3, fill: THEME.navy }}
                    activeDot={{ r: 6, fill: THEME.gold }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ✅ SECTION "EVENT HARI INI" DIHAPUS */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPenyewa;
