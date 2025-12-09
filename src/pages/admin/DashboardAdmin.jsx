// src/pages/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Store,
  Users,
  PartyPopper,
  TrendingUp,
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
import { getStands, getEvents } from "../../api/Api";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
  cabernet: "#7A2E3A",
  border: "#E5E7EB",
  textSoft: "#4B5563",
  maintenance: "#F97316",
};

const DashboardAdmin = () => {
  const [totalStand, setTotalStand] = useState(0);
  const [penyewaanAktif, setPenyewaanAktif] = useState(0);
  const [standKosong, setStandKosong] = useState(0);
  const [standMaintenance, setStandMaintenance] = useState(0);
  const [pengunjungHariIni] = useState(150);
  const [eventHariIni, setEventHariIni] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stands Data
        const standData = await getStands();
        const stands = standData.data || standData;
        setTotalStand(stands.length);

        const terisi = stands.filter((s) => s.status_stand === "terisi").length;
        const kosong = stands.filter((s) => s.status_stand === "kosong").length;
        const maintenance = stands.filter((s) => s.status_stand === "maintenance").length;

        setPenyewaanAktif(terisi);
        setStandKosong(kosong);
        setStandMaintenance(maintenance);

        // Fetch Events Data - Hitung Event Hari Ini
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
          {/* ✅ CARDS - SEMUA TINGGI SAMA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: STATUS STAND - HORIZONTAL LAYOUT */}
            <div
              className="bg-white rounded-xl p-4 shadow-sm border transition hover:shadow-md"
              style={{ borderColor: THEME.border }}
            >
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: THEME.navy }}
                >
                  <Store className="w-4 h-4 text-white" />
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: THEME.navy }}
                >
                  Status Stand
                </p>
              </div>

              {/* ✅ LAYOUT HORIZONTAL: Total Stand | Detail Status */}
              <div className="flex items-center gap-4">
                {/* TOTAL STAND - KIRI */}
                <div className="flex-shrink-0">
                  <p className="text-xs mb-1" style={{ color: THEME.textSoft }}>
                    Total Stand
                  </p>
                  <p className="text-3xl font-bold" style={{ color: THEME.navy }}>
                    {totalStand}
                  </p>
                </div>

                {/* DIVIDER VERTIKAL */}
                <div
                  className="h-16 w-px"
                  style={{ background: THEME.border }}
                ></div>

                {/* DETAIL STATUS - KANAN */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: THEME.textSoft }}>
                      Terisi
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {penyewaanAktif}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: THEME.textSoft }}>
                      Kosong
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: THEME.gold }}
                    >
                      {standKosong}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: THEME.textSoft }}>
                      Maintenance
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: THEME.maintenance }}
                    >
                      {standMaintenance}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: PENGUNJUNG HARI INI */}
            <div
              className="bg-white rounded-xl p-4 shadow-sm border transition hover:shadow-md"
              style={{ borderColor: THEME.border }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: THEME.navy }}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>

                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: `${THEME.gold}20`,
                    color: THEME.gold,
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                  +45%
                </div>
              </div>

              <p
                className="text-xs font-medium mb-1"
                style={{ color: THEME.textSoft }}
              >
                Pengunjung Hari Ini
              </p>

              <p className="text-3xl font-bold" style={{ color: THEME.navy }}>
                {pengunjungHariIni.toLocaleString("id-ID")}
              </p>

              <p className="text-xs mt-1" style={{ color: THEME.textSoft }}>
                orang
              </p>
            </div>

            {/* CARD 3: EVENT HARI INI */}
            <div
              className="bg-white rounded-xl p-4 shadow-sm border transition hover:shadow-md"
              style={{ borderColor: THEME.border }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: THEME.navy }}
                >
                  <PartyPopper className="w-4 h-4 text-white" />
                </div>

                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: `${THEME.gold}20`,
                    color: THEME.gold,
                  }}
                >
                  <TrendingUp className="w-3 h-3" />
                  {eventHariIni > 0 ? `+${eventHariIni}` : "0"}
                </div>
              </div>

              <p
                className="text-xs font-medium mb-1"
                style={{ color: THEME.textSoft }}
              >
                Event Hari Ini
              </p>

              <p className="text-3xl font-bold" style={{ color: THEME.navy }}>
                {eventHariIni}
              </p>

              <p className="text-xs mt-1" style={{ color: THEME.textSoft }}>
                event
              </p>
            </div>
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
                      <stop
                        offset="5%"
                        stopColor={THEME.navy}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={THEME.navy}
                        stopOpacity={0.01}
                      />
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardAdmin;
