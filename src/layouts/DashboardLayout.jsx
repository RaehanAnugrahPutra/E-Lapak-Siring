// src/layouts/DashboardLayout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import apiClient from "../api/ApiClient";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/me");
        const role = res.data.role.toLowerCase();
        localStorage.setItem("userRole", role);
        setUserRole(role);
      } catch (err) {
        console.log("Gagal load user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        navigate("/login");
      }
    };

    if (!userRole) fetchUser();
  }, [navigate, userRole]);

  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-screen text-sm opacity-60">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} role={userRole} />

      {/* Main Content */}
      <div
        className="transition-all duration-300 ease-in-out relative z-10"
        style={{ marginLeft: sidebarOpen ? "240px" : "80px" }}
      >
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* padding top 112px: 64px header + 40px banner + 8px spacings */}
        <main className="pt-28 p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
