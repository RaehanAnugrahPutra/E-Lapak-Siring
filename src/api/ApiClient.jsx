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
    // Cek apakah request itu bukan /login
    const isLoginRequest = error.config?.url?.includes("/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      window.location.href = "/#/login";
    }

    return Promise.reject(error);
  }
);


export default apiClient;
