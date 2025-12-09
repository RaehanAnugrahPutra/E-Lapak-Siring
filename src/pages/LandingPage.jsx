// src/pages/LandingPage.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  Store,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Calendar,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeroBackground from "../assets/Menara-Pandang-Banjarmasin.jpeg";
import LogoKayuh from "../assets/Kayuh_Baimbai.png";

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// ============================================================
// LANDING PAGE
// ============================================================
export default function LandingPage() {
  const heroBgRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Parallax bg
  useEffect(() => {
    const handleScroll = () => {
      if (!heroBgRef.current) return;
      const offset = window.scrollY * 0.2;
      heroBgRef.current.style.transform = `translateY(${offset}px) scale(1.1)`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <div
      className="overflow-hidden font-poppins"
      style={{
        "--primary": "#0D2647",
        "--accent": "#D8B46A",
      }}
    >
      {/* NAVBAR */}
      <nav className="fixed inset-x-0 top-0 z-50 bg-[var(--primary)] shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
        <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src={LogoKayuh} alt="Logo" className="w-12 h-12 object-contain" />
            <div className="leading-tight">
              <div className="text-xl font-extrabold tracking-wide">
                <span className="text-[var(--accent)]">E-Lapak</span>{' '}
                <span className="text-white">Siring</span>
              </div>
              <div className="text-[var(--accent)]/80 text-sm font-medium text-white">
                Sistem Penyewaan Stand Resmi
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold tracking-wide">
            {["Beranda", "Event", "Statistik", "Kontak"].map((item, i) => (
              <button
                key={i}
                onClick={() => handleScrollTo(item.toLowerCase())}
                className="text-white hover:text-[var(--accent)] transition relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent)] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-md border border-white/50 text-white bg-[var(--primary)]"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[var(--primary)] border-t border-[var(--accent)]/20 shadow-lg"
          >
            <div className="px-6 py-5 flex flex-col gap-4 text-white font-semibold tracking-wide text-[15px]">
              {["Beranda", "Event", "Statistik", "Kontak"].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleScrollTo(item.toLowerCase())}
                  className="text-white hover:text-[var(--accent)] transition text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <header
        id="beranda"
        className="relative pt-24 min-h-[90vh] flex items-center scroll-mt-20"
      >
        <div
          ref={heroBgRef}
          className="absolute inset-0 bg-cover bg-center -z-20"
          style={{ backgroundImage: `url(${HeroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60 -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 relative z-30 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-extrabold leading-tight"
          >
            <span className="text-white">Kelola Stand </span>
            <span className="text-[var(--accent)]">E-Lapak Siring</span>
            <br />
            <span className="text-white">dengan Mudah & Efisien</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-white/90 max-w-3xl text-lg font-medium"
          >
            <strong className="text-[var(--accent)]">E-Lapak Siring</strong> mempermudah penyewaan, pembayaran, & monitoring stand.
            Sistem resmi untuk UMKM, event organizer, dan pengelola kawasan wisata.
          </motion.p>

          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--accent)] to-[#C8A354] text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Masuk ke E-Lapak <ArrowRight size={20} />
            </Link>
          </div>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-10 grid sm:grid-cols-2 gap-4 text-white text-sm font-medium"
          >
            {[
              "Reservasi stand online",
              "Pembayaran digital terintegrasi",
              "Laporan otomatis & transparan",
              "Dashboard monitoring real-time",
            ].map((item, i) => (
              <motion.li
                variants={sectionVariant}
                key={i}
                className="flex items-center gap-2"
              >
                <CheckCircle className="text-[var(--accent)]" size={20} />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </header>

      {/* WAVE: HERO → EVENT */}
      <div className="relative -mt-1">
        <svg
          className="w-full h-16 md:h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,64L60,96C120,128,240,192,360,192C480,192,600,128,720,96C840,64,960,64,1080,96C1200,128,1320,192,1380,224L1440,256L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* EVENTS */}
      <section id="event" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-4xl font-extrabold text-[var(--primary)]">
            Agenda & Kegiatan E-Lapak Siring
          </h2>
          <p className="mt-3 text-[var(--primary)]/70 max-w-2xl mx-auto font-medium text-base">
            Beragam kegiatan rutin dan event tematik di kawasan wisata Siring — mulai dari
            UMKM, seni budaya, hingga pertunjukan hiburan yang selalu dinantikan pengunjung.
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[{
              title: "Festival UMKM Siring",
              desc: "Pameran produk unggulan UMKM daerah, diikuti puluhan pelaku usaha lokal setiap bulan."
            },{
              title: "Pasar Kreatif Harian",
              desc: "Ruang berkarya bagi komunitas kreatif untuk menampilkan kerajinan, artwork, dan produk handmade."
            },{
              title: "Live Performance & Budaya",
              desc: "Pertunjukan musik, tarian daerah, dan hiburan keluarga yang menghidupkan suasana wisata malam."
            }].map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border border-[var(--accent)]/20 bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center mb-4">
                  <Calendar className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-bold text-[var(--primary)]">{ev.title}</h3>
                <p className="text-[var(--primary)]/70 mt-2 text-sm font-medium">{ev.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WAVE: EVENT → STATISTICS */}
      <div className="relative -mt-1 rotate-180">
        <svg
          className="w-full h-16 md:h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,64L60,96C120,128,240,192,360,192C480,192,600,128,720,96C840,64,960,64,1080,96C1200,128,1320,192,1380,224L1440,256L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* STATISTICS */}
      <section id="statistik" className="py-24 bg-[var(--primary)] text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-4xl font-extrabold text-[var(--accent)]">Statistik Pengunjung</h2>
          <p className="text-white/80 mt-2 max-w-xl mx-auto font-medium">
            Data rata-rata kunjungan kawasan wisata Siring sepanjang tahun.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-8">
            {[{ label: "Pengunjung Harian", value: "8.347+" },
              { label: "Pengunjung Bulanan", value: "129.211+" },
              { label: "Event / Tahun", value: "50+" }].map((s,i)=>(
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i*0.15 }}
                className="p-8 bg-white/10 rounded-2xl backdrop-blur border border-[var(--accent)]/30 hover:bg-white/20 transition"
              >
                <div className="text-4xl font-extrabold text-[var(--accent)]">{s.value}</div>
                <div className="text-sm text-white/90 font-medium mt-2">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WAVE: STATISTICS → CONTACT */}
      <div className="relative -mt-1">
        <svg
          className="w-full h-16 md:h-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="1"
            d="M0,64L60,96C120,128,240,192,360,192C480,192,600,128,720,96C840,64,960,64,1080,96C1200,128,1320,192,1380,224L1440,256L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* CONTACT */}
      <section id="kontak" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-4xl font-extrabold text-[var(--primary)]">
            Hubungi Kami
          </h2>
          <p className="text-[var(--primary)]/70 mt-2 max-w-2xl mx-auto font-medium text-base">
            Ada pertanyaan mengenai penyewaan stand atau kebutuhan acara?
            Tim E-Lapak Siring siap membantu Anda dengan cepat dan profesional.
          </p>

          <div className="mt-16 grid md:grid-cols-2 gap-14 items-start">
            {/* INFO CONTACT */}
            <div className="space-y-8 text-left">
              {[{ icon: Mail, title: "Email", text: "support@elapak-siring.id" },
                { icon: Phone, title: "Telepon", text: "0812-3456-7890 (Jam kerja 08.00–16.00 WITA)" },
                { icon: MapPin, title: "Lokasi", text: "E-Lapak Siring\nJl. Piere Tendean, Banjarmasin Tengah" }].map((c,i)=>(
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)]/20 flex items-center justify-center flex-shrink-0">
                    <c.icon className="text-[var(--primary)]" size={24}/>
                  </div>
                  <div>
                    <div className="font-bold text-[var(--primary)] text-lg">{c.title}</div>
                    <div className="text-[var(--primary)]/70 whitespace-pre-line font-medium mt-1">{c.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <form className="space-y-6 text-left">
              {[{ label: "Nama", placeholder: "Nama lengkap", type: "text" },
                { label: "Email", placeholder: "Email aktif", type: "email" }].map((f,i)=>(
                <div key={i}>
                  <label className="text-sm font-semibold text-[var(--primary)]">{f.label}</label>
                  <input
                    type={f.type}
                    className="w-full px-4 py-3 mt-1 border border-[var(--accent)]/30 rounded-lg focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none font-medium text-[var(--primary)] transition"
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-semibold text-[var(--primary)]">Pesan</label>
                <textarea
                  className="w-full px-4 py-3 mt-1 border border-[var(--accent)]/30 rounded-lg h-32 resize-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none font-medium text-[var(--primary)] transition"
                  placeholder="Tulis pesan Anda..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[var(--primary)] to-[#1a3a6b] text-white rounded-full font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--primary)] py-10 font-poppins">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center space-y-4">
          <img src={LogoKayuh} alt="Logo" className="w-12 h-12 mx-auto object-contain" />
          <h3 className="text-xl font-extrabold tracking-wide">
            <span className="text-[var(--accent)]">E-Lapak</span>{' '}
            <span className="text-white">Siring</span>
          </h3>
          <p className="text-white/80 text-sm font-medium">
            Sistem Penyewaan Stand Kawasan Wisata Banjarmasin
          </p>
          <div className="w-full h-px bg-white/20 my-4"></div>
          <p className="text-white/60 text-xs font-normal">
            © {new Date().getFullYear()} E-Lapak Siring. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
