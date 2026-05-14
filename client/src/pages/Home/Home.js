import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/login";
    const map = { admin: "/admin", donar: "/donor", hospital: "/hospital", organisation: "/organisation" };
    return map[user.role] || "/login";
  };

  const stats = [
    {
      icon: "health_and_safety",
      value: "1,000+",
      label: "Lives Saved Annually",
      gradient: "from-rose-500 to-red-600",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      valueBg: "from-rose-600 to-red-700",
    },
    {
      icon: "domain",
      value: "50+",
      label: "Partner Hospitals",
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueBg: "from-blue-600 to-indigo-700",
    },
    {
      icon: "groups",
      value: "500+",
      label: "Active Donors",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueBg: "from-emerald-600 to-green-700",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
        }
        .silk-texture {
          background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBl5Z9PxtXjDxiCieY-GlNYCjZjQNNQVWefXDcK7tEykBSFEcQwHe2gWLrWMyEpG-OqqBNuKAh3Lua9A54pS_ukbNjDFP6ov5TbPHX6zg2-dHRyWNlz7_L03j1J_pyfvfWV95rgqmP_bd3CDKxXxhTA98FPNzYJbYtFt_X3itmom7xfjbiWiTmopfdjJ8m2Fu-HHemZIAZq21QR70WrxxZgla3nfxFZ1NoG9etGHaSWm4TglBtZQOpHHIGr9KzjlLEV0lHwUS6aAA);
          background-size: cover;
          background-position: center;
        }
        .stat-card:hover .stat-icon-ring {
          transform: scale(1.15);
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(220, 38, 38, 0); }
        }
        .urgent-badge { animation: pulse-ring 2s infinite; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl" style={{ height: '72px' }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>bloodtype</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Blood Bank Pro
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Home
            </Link>
            <a
              href="#mission"
              className="px-4 py-2 text-gray-400 font-medium text-sm rounded-lg hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              About
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-gray-400 font-medium text-sm rounded-lg hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              Contact
            </a>
            <div className="w-px h-5 bg-white/20 mx-2" />
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-gray-300 font-semibold text-sm rounded-lg hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40 transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-red-600 hover:shadow-red-500/50 active:scale-95 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-red-600 active:scale-95 transition-all duration-200"
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-lg hover:bg-white/10 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/98 border-t border-white/10 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-3">
                <Link
                  to="/"
                  className="px-4 py-3 text-white font-bold text-base rounded-xl hover:bg-white/10 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <a
                  href="#mission"
                  className="px-4 py-3 text-gray-400 font-medium text-base rounded-xl hover:text-white hover:bg-white/10 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="px-4 py-3 text-gray-400 font-medium text-base rounded-xl hover:text-white hover:bg-white/10 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
                <hr className="border-white/10 my-1" />
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-3 text-gray-300 font-semibold text-base rounded-xl border border-white/20 text-center hover:bg-white/10 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-base rounded-xl text-center shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-red-600 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    className="px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-base rounded-xl shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-red-600 transition-all"
                    onClick={() => { navigate(getDashboardPath()); setIsMenuOpen(false); }}
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow" style={{ paddingTop: '72px' }}>
        {/* ── HERO SECTION ── */}
        <section className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 silk-texture opacity-20 blur-sm scale-110" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#610000] via-[#8b0000] to-[#1a0000] opacity-93" />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="urgent-badge inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/25">
                <span className="material-symbols-outlined text-red-300 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                <span className="text-white text-xs font-bold uppercase tracking-widest">Urgent: Blood type O- needed</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Every Drop<br />Counts.{" "}
                <span className="text-red-300">Save a Life<br />Today.</span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-lg">
                Join our community of heroes and help ensure everyone has access to safe blood when they need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-red-700 font-bold text-base rounded-xl shadow-2xl hover:bg-gray-50 active:scale-95 transition-all duration-200 text-center"
                >
                  Donate Now
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-transparent border-2 border-white/50 text-white font-bold text-base rounded-xl hover:bg-white/10 hover:border-white/80 active:scale-95 transition-all duration-200 text-center"
                >
                  Find a Center
                </Link>
              </div>
            </motion.div>

            {/* Right — Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="hidden md:block"
            >
              <div className="bg-white/95 backdrop-blur-xl p-10 rounded-[32px] shadow-2xl border border-white/20">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 rounded-2xl flex items-center justify-center shadow-lg shadow-red-400/40">
                    <span className="material-symbols-outlined text-white text-[32px]">volunteer_activism</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Manrope', sans-serif" }}>Become a Donor</h3>
                    <p className="text-gray-500 mt-2 text-sm">Ready to make a difference? Sign in to schedule your first appointment.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 border-2 border-red-100 bg-red-50 rounded-xl flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-red-600">favorite</span>
                      <span className="text-sm font-bold text-red-700">Donor</span>
                    </div>
                    <div className="p-4 border-2 border-blue-100 bg-blue-50 rounded-xl flex flex-col items-center gap-2 cursor-pointer hover:border-blue-300 transition-colors">
                      <span className="material-symbols-outlined text-blue-600">local_hospital</span>
                      <span className="text-sm font-bold text-blue-700">Hospital</span>
                    </div>
                  </div>
                  <div className="w-full space-y-3">
                    <div className="h-12 bg-gray-50 rounded-xl border-2 border-gray-200 flex items-center px-4 gap-3">
                      <span className="material-symbols-outlined text-gray-400 text-[20px]">mail</span>
                      <span className="text-gray-400 text-sm">Enter your email</span>
                    </div>
                    <Link
                      to="/register"
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-400/30 flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── IMPACT STATS — Colorful ── */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Manrope', sans-serif" }}>
                Our Impact in Numbers
              </h2>
              <p className="text-gray-500 text-lg max-w-xl mx-auto">Together we are making the world a healthier, safer place — one donation at a time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="stat-card relative overflow-hidden rounded-3xl p-10 flex flex-col items-center text-center shadow-xl cursor-default"
                  style={{ background: "white", border: "1px solid #f0f0f0" }}
                >
                  {/* Colored top accent bar */}
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${stat.gradient}`} />
                  
                  {/* Icon ring */}
                  <div className={`stat-icon-ring w-24 h-24 rounded-full ${stat.iconBg} flex items-center justify-center mb-6 transition-transform duration-300`}>
                    <span className={`material-symbols-outlined ${stat.iconColor} text-[44px]`}>{stat.icon}</span>
                  </div>

                  {/* Value with colored gradient text */}
                  <h2 className={`text-5xl font-extrabold mb-2 bg-gradient-to-r ${stat.valueBg} bg-clip-text text-transparent`} style={{ fontFamily: "'Manrope', sans-serif" }}>
                    {stat.value}
                  </h2>
                  <p className="text-gray-500 font-semibold text-base">{stat.label}</p>

                  {/* Subtle colored background orb */}
                  <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.07]`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR MISSION ── */}
        <section id="mission" className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                  <img
                    alt="Laboratory environment"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-fH37X3gWEHEzHhCPb-Fhk9NTiUqDgJoB76P6PyjGxWTKW8Mvl-5H7eXgxDO7fiwyoUoWJnCyMcNIQRSH69KDwuca2mis57gCntvIVZgkRzzhvHFDlv1VnrfUvIHFve82wZX24i_Kn0AhoTQdS_uP1CIBTNxkH5awGiJbXQiIjBRTw5gk-FJGZ0PoIPwMEgK0Pi66Z_HIQa1aKp5uzE0AMOF5KrRL3UFQUTIdTN5Svr1CIzsM2b79pjqprfOXGQL8nY3D68lQsg"
                  />
                  <div className="absolute inset-0 bg-red-900/10 mix-blend-multiply" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl max-w-[260px] hidden md:block border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-600 text-[18px]">verified</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trusted by</span>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>50+ Healthcare Institutions</p>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6">
                <span className="inline-block text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-red-100">Our Mission</span>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: "'Manrope', sans-serif" }}>
                  Building a Bridge<br />of Hope.
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  At Blood Bank Pro, our mission is to provide a reliable, efficient, and compassionate bridge between selfless donors and those in urgent need of life-saving blood. We believe technology should empower humanity.
                </p>
                <p className="text-gray-500 leading-relaxed">
                  By ensuring a steady and safe supply of blood to our partner hospitals, we are not just managing a bank — we are safeguarding the health and future of our entire community.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-400/30 hover:from-red-700 hover:to-red-600 active:scale-95 transition-all text-center"
                  >
                    Join as a Donor
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-red-300 hover:text-red-600 active:scale-95 transition-all text-center"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>bloodtype</span>
                </div>
                <span className="text-white font-bold text-xl" style={{ fontFamily: "'Manrope', sans-serif" }}>Blood Bank Pro</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Connecting donors with recipients to ensure no life is lost due to blood shortage.
              </p>
            </div>
            {/* Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
              <a href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">About Us</a>
              <a href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">FAQ</a>
              <Link to="/register" className="block text-gray-500 text-sm hover:text-white transition-colors">Register</Link>
              <Link to="/login" className="block text-gray-500 text-sm hover:text-white transition-colors">Login</Link>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
              <a href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-500 text-sm hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-gray-600 text-sm">© 2026 Blood Bank Pro. All rights reserved.</span>
            <div className="flex gap-6">
              <span className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Global HQ
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm">
                <span className="material-symbols-outlined text-[16px]">call</span>
                +1-800-BLOOD-PRO
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* FAB (mobile) */}
      <Link
        to="/register"
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 text-white rounded-full shadow-2xl shadow-red-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 md:hidden"
      >
        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </Link>
    </div>
  );
};

export default Home;