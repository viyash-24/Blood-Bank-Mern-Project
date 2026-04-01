import React from "react";
import { BiDonateBlood, BiUserCircle } from "react-icons/bi";
import { FiLogOut, FiMenu, FiBarChart2, FiHome } from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // logout handler
  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-[70px] px-4 lg:px-8 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-soft">
      {/* Left — Toggle + Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all duration-200 lg:hidden"
        >
          <FiMenu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blood-600 to-blood-400 flex items-center justify-center shadow-glow">
            <BiDonateBlood className="text-white" size={20} />
          </div>
          <span className="hidden md:block text-lg font-bold text-dark-500 tracking-tight">
            Blood Bank
          </span>
        </div>
      </div>

      {/* Right — Nav Actions */}
      <div className="flex items-center gap-3">
        {/* Analytics / Home Toggle */}
        {location.pathname === "/" ||
        location.pathname === "/donar" ||
        location.pathname === "/hospital" ? (
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blood-600 bg-blood-50 hover:bg-blood-100 rounded-xl transition-all duration-200"
          >
            <FiBarChart2 size={16} />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blood-600 bg-blood-50 hover:bg-blood-100 rounded-xl transition-all duration-200"
          >
            <FiHome size={16} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        )}

        {/* User Info */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blood-500 to-blood-400 flex items-center justify-center">
            <BiUserCircle className="text-white" size={18} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-dark-200 leading-tight">
              {user?.name || user?.hospitalName || user?.organisationName}
            </p>
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-blood-600 bg-blood-50 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-xl shadow-md hover:shadow-glow transition-all duration-300"
          onClick={handleLogout}
        >
          <FiLogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
