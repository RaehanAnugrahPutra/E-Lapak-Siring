import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://e-lapak-siring.ti-6b.my.id/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ======================================================
// AUTO SET TOKEN DI SETIAP REQUEST
// ======================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================================
// AUTO LOGOUT JIKA TOKEN EXPIRED / INVALID
// ======================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika token invalid saat user sedang login di dashboard
    if (error.response?.status === 401) {
      // Tapi jika URL bukan /login, lakukan logout otomatis
      const isLoginRequest = error.config?.url?.includes("/login");
      if (!isLoginRequest) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        window.location.href = "/login"; // atau "/#/login" sesuai routing
      }
    }

    // Tetap lempar error agar bisa ditangkap oleh .catch() di Login.jsx
    return Promise.reject(error);
  }
);



export default apiClient;
