import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { FaBell, FaCheckCircle, FaStoreAlt } from "react-icons/fa";

const KelolaPembayaran = () => {
  const [stands] = useState([
    { id: "A1", penyewa: "Toko Bunda", progress: 90 },
    { id: "A2", penyewa: "Warung Hijau", progress: 50 },
    { id: "A3", penyewa: null, progress: 0 },
    { id: "A4", penyewa: null, progress: 0 },
    { id: "A5", penyewa: "Roti Manis", progress: 100 },
    { id: "B1", penyewa: null, progress: 0 },
    { id: "B2", penyewa: "Snack Enak", progress: 70 },
    { id: "B3", penyewa: "Kedai Kopi", progress: 30 },
  ]);

  const sendNotification = (penyewa, standId) => {
    alert(`Notifikasi terkirim ke ${penyewa}\nStand ${standId} — Segera lunasi pembayaran!`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white font-poppins relative overflow-hidden">
        {/* MOTIF SASIRANGAN 100% MANUAL SVG — Bikin sendiri, mirip kain asli */}
        <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="sasirangan-manual" width="600" height="600" patternUnits="userSpaceOnUse">
                {/* Gigi Yu khas Sasirangan */}
                <path d="M100,300 Q150,250 200,300 T300,300 T400,300 T500,300" 
                      stroke="#991b1b" strokeWidth="18" fill="none" strokeLinecap="round"/>
                <path d="M100,320 Q150,370 200,320 T300,320 T400,320 T500,320" 
                      stroke="#991b1b" strokeWidth="18" fill="none" strokeLinecap="round"/>

                {/* Bunga Teratai / Kembang Setangi */}
                <g transform="translate(300,150)">
                  <circle cx="0" cy="0" r="50" fill="#7c2d12"/>
                  <circle cx="0" cy="0" r="35" fill="#991b1b"/>
                  <circle cx="0" cy="0" r="20" fill="#fbbf24"/>
                  {[...Array(12)].map((_, i) => (
                    <path key={i} d={`M0,0 L${60 * Math.cos(i * 30 * Math.PI / 180)},${60 * Math.sin(i * 30 * Math.PI / 180)}`}
                          stroke="#451a03" strokeWidth="12" fill="none"/>
                  ))}
                </g>

                {/* Daun Sirih */}
                <path d="M150,450 Q200,400 250,450 Q200,500 150,450 Z" fill="#854d0e"/>
                <path d="M350,450 Q400,400 450,450 Q400,500 350,450 Z" fill="#854d0e"/>

                {/* Ornamen Kecil */}
                <circle cx="200" cy="200" r="15" fill="#dc2626"/>
                <circle cx="400" cy="400" r="15" fill="#dc2626"/>
                <circle cx="200" cy="400" r="10" fill="#f59e0b"/>
                <circle cx="400" cy="200" r="10" fill="#f59e0b"/>

                {/* Lengkung Khas Banjar */}
                <path d="M50,100 Q300,50 550,100" stroke="#451a03" strokeWidth="14" fill="none"/>
                <path d="M50,500 Q300,550 550,500" stroke="#451a03" strokeWidth="14" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sasirangan-manual)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {stands.map((stand) => {
                const isTerisi = !!stand.penyewa;
                const isLunas = stand.progress === 100;

                return (
                  <div
                    key={stand.id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 
                               hover:shadow-xl hover:border-amber-700/40 transition-all duration-300"
                  >
                    <div className="p-7 text-center">
                      <div className="text-5xl mb-4">
                        {isLunas ? (
                          <FaCheckCircle className="mx-auto text-emerald-600" />
                        ) : (
                          <FaStoreAlt className={`mx-auto ${isTerisi ? "text-amber-800" : "text-gray-400"}`} />
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-800 mb-1">{stand.id}</h3>

                      {isTerisi ? (
                        <p className="text-slate-700 font-medium text-lg mb-5">{stand.penyewa}</p>
                      ) : (
                        <p className="text-gray-400 text-sm italic mb-5">Kosong</p>
                      )}

                      <div className="relative w-28 h-28 mx-auto mb-5">
                        <svg className="w-28 h-28 -rotate-90">
                          <circle cx="56" cy="56" r="48" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                          <circle
                            cx="56" cy="56" r="48"
                            stroke={isLunas ? "#10b981" : stand.progress >= 70 ? "#d97706" : "#dc2626"}
                            strokeWidth="10" fill="none"
                            strokeDasharray={2 * Math.PI * 48}
                            strokeDashoffset={2 * Math.PI * 48 * (1 - stand.progress / 100)}
                            className="transition-all duration-1000"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-slate-800">{stand.progress}%</span>
                        </div>
                      </div>

                      <p className={`font-semibold text-sm mb-5 ${
                        isLunas ? "text-emerald-600" :
                        stand.progress >= 70 ? "text-amber-700" : "text-red-600"
                      }`}>
                        {isLunas ? "LUNAS" : stand.progress >= 70 ? "Hampir Lunas" : "Belum Lunas"}
                      </p>

                      {isTerisi && !isLunas && (
                        <button
                          onClick={() => sendNotification(stand.penyewa, stand.id)}
                          className="w-full flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-900 
                                   text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-sm"
                        >
                          <FaBell className="text-sm" />
                          Kirim Pengingat
                        </button>
                      )}

                      {isLunas && (
                        <div className="text-emerald-600 font-semibold">
                          Pembayaran Selesai
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KelolaPembayaran;