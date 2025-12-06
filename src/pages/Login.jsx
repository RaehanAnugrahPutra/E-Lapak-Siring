// src/pages/Login.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Menara-Pandang-Banjarmasin.jpeg";
import logoSmall from "../assets/Kayuh_Baimbai.png";
import bgLogin from "../assets/bg.png";
import { 
  login, 
  register, 
  forgotPassword, 
  verifyResetToken,
  resetPassword 
} from "../api/Api";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [verifiedToken, setVerifiedToken] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingLogin, setLoadingLogin] = useState(false);

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // ✅ VALIDASI LOGIN DENGAN ERROR HANDLING SPESIFIK
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);

    try {
      await login({ email, password });

      setTimeout(() => {
        const role = localStorage.getItem("userRole");
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/penyewa/dashboard");
      }, 900);
    } catch (err) {
      setLoadingLogin(false);
      
      // ✅ DETEKSI ERROR SPESIFIK
      const errorMessage = err.response?.data?.message || "";
      const statusCode = err.response?.status;

      if (statusCode === 401) {
        // Password salah
        if (errorMessage.toLowerCase().includes("password")) {
          alert("❌ Password yang Anda masukkan salah!\n\nSilakan coba lagi atau klik 'Lupa Password' jika Anda lupa.");
        } 
        // Email tidak terdaftar
        else if (errorMessage.toLowerCase().includes("email") || 
                 errorMessage.toLowerCase().includes("tidak ditemukan") ||
                 errorMessage.toLowerCase().includes("tidak terdaftar")) {
          alert("❌ Email tidak terdaftar!\n\nSilakan daftar terlebih dahulu dengan klik tombol 'Daftar Akun'.");
        }
        // Kredensial salah (umum)
        else {
          alert("❌ Email atau password salah!\n\nPastikan Anda sudah terdaftar.");
        }
      } 
      else if (statusCode === 404) {
        alert("❌ Email tidak terdaftar!\n\nSilakan daftar terlebih dahulu dengan klik tombol 'Daftar Akun'.");
      }
      else if (statusCode === 422) {
        alert("❌ Data login tidak valid!\n\nPastikan email dan password sudah diisi dengan benar.");
      }
      else {
        alert(errorMessage || "❌ Login gagal! Silakan coba lagi.");
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({
        name: nama,
        email: regEmail,
        password: regPassword,
        password_confirmation: regPassword,
      });
      alert("✅ Registrasi berhasil!\n\nSilakan login dengan akun yang baru Anda buat.");
      setIsRegister(false);
      // Reset form
      setNama("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "";
      
      if (errorMessage.toLowerCase().includes("email") && 
          errorMessage.toLowerCase().includes("sudah")) {
        alert("❌ Email sudah terdaftar!\n\nSilakan gunakan email lain atau login dengan email tersebut.");
      } else {
        alert(errorMessage || "❌ Registrasi gagal! Silakan coba lagi.");
      }
    }
  };

  const handleSendForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return alert("❌ Masukkan email terlebih dahulu!");
    try {
      await forgotPassword(forgotEmail);
      alert("✅ Kode reset telah dikirim ke email Anda.\n\nSilakan cek inbox atau folder spam.");
      setIsChangePassword(true);
      setIsForgot(false);
      setResetStep(0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "";
      
      if (err.response?.status === 404 || 
          errorMessage.toLowerCase().includes("tidak ditemukan")) {
        alert("❌ Email tidak terdaftar!\n\nPastikan email yang Anda masukkan sudah terdaftar.");
      } else {
        alert(errorMessage || "❌ Gagal mengirim kode reset! Silakan coba lagi.");
      }
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const token = otp.join("");
    
    if (token.length !== 6) {
      return alert("❌ Masukkan 6 digit kode reset!");
    }

    try {
      await verifyResetToken({
        email: forgotEmail,
        token: token
      });

      alert("✅ Kode valid!\n\nSilakan masukkan password baru Anda.");
      setVerifiedToken(token);
      setResetStep(1);
      
    } catch (err) {
      alert(err.response?.data?.message || "❌ Kode reset tidak valid atau sudah expired!");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return alert("❌ Password dan konfirmasi password tidak sama!");
    }

    if (newPassword.length < 8) {
      return alert("❌ Password minimal 8 karakter!");
    }

    try {
      await resetPassword({
        email: forgotEmail,
        token: verifiedToken,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      alert("✅ Password berhasil direset!\n\nSilakan login dengan password baru Anda.");
      setIsChangePassword(false);
      setResetStep(0);
      setForgotEmail("");
      setOtp(["", "", "", "", "", ""]);
      setVerifiedToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "❌ Reset password gagal! Silakan coba lagi.");
      setResetStep(0);
      setOtp(["", "", "", "", "", ""]);
      setVerifiedToken("");
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255,255,255,0.35);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin .8s linear infinite;
          margin-right: 10px;
        }

        body {
          margin: 0;
          font-family: "Poppins", sans-serif;
          background: url(${bgLogin}) no-repeat center center fixed;
          background-size: cover;
        }

        .login-container { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh; 
          padding: 20px; 
          animation: fadeIn 1.3s ease;
        }

        .login-card { 
          display: flex; 
          background: white; 
          border-radius: 20px; 
          overflow: hidden; 
          box-shadow: 0 10px 35px rgba(0,0,0,0.20); 
          width: 800px; 
          max-width: 95%; 
          height: 480px; 
          color: #0D2647;
          position: relative; 
          animation: fadeSlide .9s ease-out;
        }

        .login-left { 
          flex: 1; 
          background: url(${logo}) no-repeat center center; 
          background-size: cover; 
          filter: brightness(0.92); 
        }

        .login-right { 
          flex: 1; 
          padding: 35px 45px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          background: #ffffff;
        }

        .logo-top { 
          display: block; 
          width: 90px; 
          height: 90px; 
          margin: 0 auto 15px auto; 
          object-fit: contain;
        }

        h2 { 
          text-align: center; 
          margin-bottom: 20px; 
          font-size: 18px; 
          font-weight: 600; 
          color: #1F2937;
          line-height: 1.5;
        }

        .brand-name {
          display: block;
          font-size: 22px;
          font-weight: 800;
          margin-top: 5px;
        }

        .brand-navy {
          color: #0D2647;
        }

        .brand-gold {
          color: #D8B46A;
        }

        form { 
          display: flex; 
          flex-direction: column; 
          gap: 10px;
        }

        input { 
          width: 100%; 
          padding: 10px 12px; 
          border: 1.5px solid #D1D5DB; 
          border-radius: 8px; 
          background: #F9FAFB; 
          font-size: 14px; 
          color: #0D2647;
          transition: 0.3s;
        }

        input:hover {
          border-color: #D8B46A;
          background: white;
        }

        input:focus { 
          border-color: #D8B46A; 
          background: white;
          box-shadow: 0 0 0 3px rgba(216,180,106,0.15);
          outline: none;
        }

        .otp-container {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin: 12px 0;
        }

        .otp-input {
          width: 42px;
          height: 42px;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          border: 2px solid #D1D5DB;
          border-radius: 8px;
          transition: .2s;
          margin: 0;
          padding: 0;
          background: #F9FAFB;
        }

        .otp-input:focus {
          border-color: #D8B46A;
          background: white;
          box-shadow: 0 0 0 3px rgba(216,180,106,0.15);
        }

        button { 
          width: 100%; 
          padding: 11px; 
          border: none; 
          border-radius: 8px; 
          font-weight: 600; 
          font-size: 14px; 
          cursor: pointer; 
          transition: 0.25s ease;
        }

        .btn-primary { 
          background: linear-gradient(135deg, #0D2647 0%, #1a3a6b 100%); 
          color: white; 
          box-shadow: 0 4px 12px rgba(13,38,71,0.3);
        }
        .btn-primary:hover { 
          background: linear-gradient(135deg, #1a3a6b 0%, #0D2647 100%); 
          transform: translateY(-2px); 
          box-shadow: 0 6px 18px rgba(13,38,71,0.4);
        }
        .btn-primary:active {
          transform: translateY(0);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary { 
          background: linear-gradient(135deg, #D8B46A 0%, #C8A354 100%); 
          color: white; 
          box-shadow: 0 4px 12px rgba(216,180,106,0.3);
        }
        .btn-secondary:hover { 
          background: linear-gradient(135deg, #C8A354 0%, #B89344 100%); 
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(216,180,106,0.4);
        }
        .btn-secondary:active {
          transform: translateY(0);
        }

        .link-small { 
          font-size: 13px; 
          color: #D8B46A; 
          cursor: pointer; 
          margin-top: -3px;
          margin-bottom: 5px;
          text-align: right;
          font-weight: 600;
        }

        .link-small:hover {
          text-decoration: underline;
          color: #C8A354;
        }

        .register-section { 
          text-align: center; 
          margin-top: 15px; 
          display: flex; 
          flex-direction: column; 
          gap: 8px;
          color: #0D2647;
          font-size: 13px;
        }

        .btn-loading-content {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .login-card {
            flex-direction: column;
            height: auto;
            width: 100%;
            max-width: 420px;
          }

          .login-left {
            min-height: 180px;
          }

          .login-right {
            padding: 30px 25px;
          }

          .logo-top {
            width: 70px;
            height: 70px;
          }

          h2 {
            font-size: 16px;
          }

          .brand-name {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">

          <div className="login-left" />

          <div className="login-right">

            {/* ============ LOGIN ============ */}
            {!isRegister && !isForgot && !isChangePassword && (
              <>
                <img src={logoSmall} alt="Logo" className="logo-top" />
                <h2>
                  Selamat Datang<br/>
                  Di Sistem Penyewaan
                  <span className="brand-name">
                    <span className="brand-navy">E-Lapak</span>{' '}
                    <span className="brand-gold">Siring</span>
                  </span>
                </h2>

                <form onSubmit={handleLogin}>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                  />

                  <span className="link-small" onClick={() => setIsForgot(true)}>
                    Lupa Password?
                  </span>

                  <button type="submit" className="btn-primary" disabled={loadingLogin}>
                    {loadingLogin ? (
                      <div className="btn-loading-content">
                        <div className="spinner"></div>
                        Memproses...
                      </div>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </form>

                <div className="register-section">
                  <span>Belum punya akun?</span>
                  <button className="btn-secondary" onClick={() => setIsRegister(true)}>
                    Daftar Akun
                  </button>
                </div>
              </>
            )}

            {/* ============ REGISTER ============ */}
            {isRegister && (
              <>
                <img src={logoSmall} alt="Logo" className="logo-top" />
                <h2>
                  Daftar Akun Baru
                  <span className="brand-name">
                    <span className="brand-navy">E-Lapak</span>{' '}
                    <span className="brand-gold">Siring</span>
                  </span>
                </h2>

                <form onSubmit={handleRegister}>
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    value={nama} 
                    onChange={e => setNama(e.target.value)} 
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    value={regEmail} 
                    onChange={e => setRegEmail(e.target.value)} 
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Password (min. 8 karakter)" 
                    value={regPassword} 
                    onChange={e => setRegPassword(e.target.value)} 
                    required
                    minLength="8"
                  />

                  <button type="submit" className="btn-primary">Daftar</button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setIsRegister(false)}
                  >
                    Kembali ke Login
                  </button>
                </form>
              </>
            )}

            {/* ============ LUPA PASSWORD (KIRIM EMAIL) ============ */}
            {isForgot && (
              <>
                <img src={logoSmall} alt="Logo" className="logo-top" />
                <h2>Lupa Password</h2>

                <form onSubmit={handleSendForgot}>
                  <input 
                    type="email" 
                    placeholder="Email Terdaftar" 
                    value={forgotEmail} 
                    onChange={e => setForgotEmail(e.target.value)} 
                    required
                  />

                  <button type="submit" className="btn-primary">Kirim Kode Reset</button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setIsForgot(false)}
                  >
                    Kembali ke Login
                  </button>
                </form>
              </>
            )}

            {/* ============ GANTI PASSWORD ============ */}
            {isChangePassword && (
              <>
                <img src={logoSmall} alt="Logo" className="logo-top" />
                
                {resetStep === 0 ? (
                  <>
                    <h2>Masukkan Kode Reset</h2>

                    <form onSubmit={handleVerifyOtp}>
                      <div className="otp-container">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={otpRefs[index]}
                            type="text"
                            maxLength="1"
                            className="otp-input"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            autoFocus={index === 0}
                          />
                        ))}
                      </div>

                      <button type="submit" className="btn-primary">
                        Verifikasi Kode
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => {
                          setIsChangePassword(false);
                          setResetStep(0);
                          setOtp(["", "", "", "", "", ""]);
                          setVerifiedToken("");
                        }}
                      >
                        Batal
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2>Buat Password Baru</h2>

                    <form onSubmit={handleResetPassword}>
                      <input 
                        type="password" 
                        placeholder="Password Baru (min. 8 karakter)" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        required
                        minLength="8"
                      />
                      <input 
                        type="password" 
                        placeholder="Konfirmasi Password Baru" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        required
                        minLength="8"
                      />

                      <button type="submit" className="btn-primary">
                        Reset Password
                      </button>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => {
                          setResetStep(0);
                          setOtp(["", "", "", "", "", ""]);
                          setVerifiedToken("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Kembali
                      </button>
                    </form>
                  </>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
