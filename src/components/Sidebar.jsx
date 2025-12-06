// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaStore,
  FaFileAlt,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

import logo from "../assets/Kayuh_Baimbai.png";

const THEME = {
  navy: "#0D2647",
  gold: "#D8B46A",
};

const Sidebar = ({ isOpen, role }) => {
  const userRole = role?.toLowerCase() || "";

  const menuItems =
    userRole === "admin"
      ? [
          { name: "Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> },
          { name: "Kelola Event", path: "/admin/kelola-event", icon: <FaCalendarAlt /> },
          { name: "Pengajuan Stand", path: "/admin/pengajuan-stand", icon: <FaClipboardList /> },
          { name: "Kelola Stand", path: "/admin/kelola-stand", icon: <FaStore /> },
          { name: "Laporan", path: "/admin/laporan", icon: <FaFileAlt /> },
        ]
      : [
          { name: "Dashboard", path: "/penyewa/dashboard", icon: <FaTachometerAlt /> },
          { name: "Event", path: "/penyewa/events", icon: <FaCalendarAlt /> },
          { name: "Stand", path: "/penyewa/stand", icon: <FaStore /> },
          { name: "Stand Anda", path: "/penyewa/stand-anda", icon: <FaUsers /> },
        ];

  const sidebarWidth = isOpen ? "240px" : "80px";

  return (
    <>
      <style jsx>{`
        /* Custom Scrollbar untuk Menu */
        .sidebar-menu::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-menu::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin: 8px 0;
        }

        .sidebar-menu::-webkit-scrollbar-thumb {
          background: rgba(216, 180, 106, 0.3);
          border-radius: 10px;
          transition: background 0.3s;
        }

        .sidebar-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(216, 180, 106, 0.5);
        }

        /* Firefox */
        .sidebar-menu {
          scrollbar-width: thin;
          scrollbar-color: rgba(216, 180, 106, 0.3) rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <aside
        className="fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out flex flex-col z-50 shadow-xl"
        style={{
          width: sidebarWidth,
          background: THEME.navy,
          color: "white",
          overflow: "hidden",
        }}
      >
        {/* LOGO + TEXT - FIXED AREA */}
        <div
          className={`w-full border-b border-white/10 py-6 px-4 flex flex-shrink-0 ${
            isOpen ? "flex-row items-center gap-4" : "flex-col items-center justify-center"
          }`}
        >
          <img
            src={logo}
            alt="Kayuh Baimbai"
            className="drop-shadow transition-all duration-300 w-20"
          />

          {isOpen && (
            <div className="flex flex-col text-white leading-tight">
              <span className="text-sm font-bold tracking-widest">UPTD</span>
              <span className="text-xs">Kawasan Wisata</span>
              <span className="text-xs">Kota Banjarmasin</span>
            </div>
          )}
        </div>

        {/* MENU - SCROLLABLE AREA */}
        <nav 
          className="sidebar-menu flex-1 px-3 py-5 space-y-2 overflow-y-auto overflow-x-hidden"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-xl h-14 px-3 text-[15px] font-medium transition-all duration-200
                hover:bg-[rgba(216,180,106,0.16)] hover:text-white
                ${
                  isActive
                    ? "bg-[rgba(216,180,106,0.95)] text-[#0D2647] shadow-md"
                    : "text-white/85"
                }`
              }
              title={!isOpen ? item.name : ""}
            >
              <span
                className={`text-xl transition-all duration-300 flex-shrink-0 ${
                  isOpen ? "mr-3" : "mx-auto block"
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isOpen ? "opacity-100 translate-x-0" : "opacity-0 w-0 pointer-events-none overflow-hidden"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

      </aside>
    </>
  );
};

export default Sidebar;
