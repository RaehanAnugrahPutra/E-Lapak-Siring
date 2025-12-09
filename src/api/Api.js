// src/api/Api.js
import apiClient from "./ApiClient";

/* ============================================================
   AUTHENTIKASI
============================================================ */

// LOGIN
export const login = async ({ email, password }) => {
  try {
    const res = await apiClient.post("/login", { email, password });
    const token = res.data.access_token || res.data.token || res.data.jwt;
    if (!token) throw new Error("Token tidak diterima dari server");

    localStorage.setItem("token", token);

    const userRes = await apiClient.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = userRes.data.data || userRes.data;
    
    // SIMPAN DATA USER KE LOCALSTORAGE
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", userData.role.toLowerCase());
    localStorage.setItem("userId", userData.id.toString());

    return userData;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};

// REGISTER
export const register = async ({ name, email, password, password_confirmation }) => {
  try {
    const res = await apiClient.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    return res.data;
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    throw err;
  }
};

// LUPA PASSWORD
export const forgotPassword = async (email) => {
  const res = await apiClient.post("/lupa-password", { email });
  return res.data;
};

// VERIFY RESET TOKEN
export const verifyResetToken = async ({ email, token }) => {
  const res = await apiClient.post("/verify-reset-token", { email, token });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async ({ email, token, password, password_confirmation }) => {
  const res = await apiClient.post("/ganti-password", {
    email,
    token,
    password,
    password_confirmation,
  });
  return res.data;
};

/* ============================================================
   GANTI PASSWORD
============================================================ */
export const changePassword = async ({ current_password, new_password, new_password_confirmation }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await apiClient.post(
      "/ganti-password-login",
      {
        current_password,
        password: new_password,
        password_confirmation: new_password_confirmation,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Ganti password error:", err.response?.data || err.message);
    throw err;
  }
};

// LOGOUT
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    await apiClient.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
  } catch (err) {
    console.warn("Logout error:", err.response?.data || err.message);
  } finally {
    // HAPUS SEMUA DATA LOCALSTORAGE
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  }
};

/* ============================================================
   EVENTS
============================================================ */
export const getEvents = async () => {
  const res = await apiClient.get("/events");
  return res.data.data;
};

export const createEvent = async (data) => {
  const res = await apiClient.post("/events", data);
  return res.data.data;
};

export const updateEvent = async (id, data) => {
  const res = await apiClient.put(`/events/${id}`, data);
  return res.data.data;
};

export const deleteEvent = async (id) => {
  const res = await apiClient.delete(`/events/${id}`);
  return res.data;
};

/* ============================================================
   NOTIFIKASI
============================================================ */
export const getNotifikasi = async () => {
  const res = await apiClient.get("/notifikasi");
  return res.data.data;
};

export const readNotifikasi = async (id) => {
  const res = await apiClient.post(`/notifikasi/${id}/read`);
  return res.data;
};

export const readAllNotifikasi = async () => {
  const res = await apiClient.post("/notifikasi/read-all");
  return res.data;
};

/* ============================================================
   PENGAJUAN STAND
============================================================ */
export const getPengajuan = async () => {
  const res = await apiClient.get("/pengajuan");
  return res.data;
};

export const createPengajuan = async (formData) => {
  const res = await apiClient.post("/pengajuan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getPengajuanById = async (id) => {
  const res = await apiClient.get(`/pengajuan/${id}`);
  return res.data.data;
};

export const approvePengajuan = async (id) => {
  const res = await apiClient.post(`/pengajuan/${id}/approve`);
  return res.data;
};

// ✅ HANYA INI YANG DIPERBAIKI
export const rejectPengajuan = async (id, alasanPenolakan) => {
  const res = await apiClient.post(`/pengajuan/${id}/reject`, {
    alasan_penolakan: alasanPenolakan,
  });
  return res.data;
};

export const downloadSuratPengajuan = async (id) => {
  const res = await apiClient.get(`/pengajuan/${id}/surat`, { responseType: "blob" });
  return res.data;
};

/* ============================================================
   STAND ADMIN CRUD
============================================================ */
export const getStands = async () => {
  const res = await apiClient.get("/stands");
  return res.data;
};

export const getStandById = async (id) => {
  const res = await apiClient.get(`/stands/${id}`);
  return res.data.data;
};

export const createStand = async (data) => {
  const res = await apiClient.post("/stands", data);
  return res.data.data;
};

export const updateStand = async (id, data) => {
  const res = await apiClient.put(`/stands/${id}`, data);
  return res.data.data;
};

export const deleteStand = async (id) => {
  const res = await apiClient.delete(`/stands/${id}`);
  return res.data;
};

/* ============================================================
   FITUR ADMIN – BATALKAN SEWA & PENGINGAT
============================================================ */
export const batalkanSewa = async (id, reason) => {
  return apiClient.post(`/stands/${id}/batalkan-sewa`, { alasan: reason });
};

export const kirimPengingat = async (penyewaanId) => {
  const res = await apiClient.post(`/stands/${penyewaanId}/kirim-pengingat`);
  return res.data;
};

/* ============================================================
   PENYEWAAN
============================================================ */
export const getPenyewaan = async () => {
  const res = await apiClient.get("/penyewaan");
  return res.data.data;
};

export const getPenyewaanById = async (id) => {
  const res = await apiClient.get(`/penyewaan/${id}`);
  console.log("RAW API /penyewaan/:id →", res.data);
  return res.data;
};

export const createMidtransPayment = async (penyewaanId) => {
  const res = await apiClient.post(`/penyewaan/${penyewaanId}/create-payment`);
  return res.data; // { success, snap_token, order_id, ... }
};

export const pilihMetodePembayaran = (id, metode) =>
  apiClient.post(`/penyewaan/${id}/metode-pembayaran`, { metode_pembayaran: metode });

export const bayarVA = async (id, va_number) =>
  apiClient.post("/penyewaan/bayar-va", { va_number, penyewaan_id: id });

export const bayarQris = async (id) =>
  apiClient.post("/penyewaan/bayar-qris", { penyewaan_id: id });

/* ============================================================
   LAPORAN ADMIN
============================================================ */
// ✅ DIPERBAIKI: Mendukung parameter filter (bulan, tahun)
export const getLaporanPenyewaan = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `/laporan-penyewaan?${queryString}`
    : `/laporan-penyewaan`;
  const res = await apiClient.get(url);
  return res.data;
};
