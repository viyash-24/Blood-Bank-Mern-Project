import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiDonateBlood } from "react-icons/bi";
import {
  FiPackage, FiHeart, FiActivity, FiUsers, FiList, FiGrid,
  FiGift, FiChevronLeft, FiBarChart2, FiFileText, FiBell,
  FiDroplet, FiHome, FiUser, FiClipboard, FiShield,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ to, icon: Icon, label, active, badge }) => (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-4 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-blood-600 to-blood-500 text-white shadow-lg shadow-blood-600/20"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={20} className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-white" : ""}`} />
      {isOpen && (
        <span className="whitespace-nowrap animate-fade-in flex-1">{label}</span>
      )}
      {isOpen && badge && (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-blood-500 text-white rounded-full">{badge}</span>
      )}
    </Link>
  );

  const SectionLabel = ({ label }) => isOpen ? (
    <p className="px-7 mb-3 mt-6 text-[10px] font-semibold uppercase tracking-widest text-gray-600 animate-fade-in">{label}</p>
  ) : <div className="my-3 mx-5 h-px bg-white/5" />;

  return (
    <aside className={`fixed lg:relative z-30 flex flex-col h-screen bg-dark-500 transition-all duration-300 ease-in-out ${
      isOpen ? "w-[260px]" : "w-[72px]"
    } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
      {/* Brand Header */}
      <div className="flex items-center justify-between h-[70px] px-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blood-600 to-blood-400 flex items-center justify-center shadow-glow animate-blood-drop">
            <BiDonateBlood className="text-white" size={22} />
          </div>
          {isOpen && (
            <div className="animate-fade-in">
              <h1 className="text-white font-bold text-base leading-tight tracking-tight">Blood Bank</h1>
              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">Management</p>
            </div>
          )}
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all duration-200">
          <FiChevronLeft size={18} className={`transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {/* ========== ADMIN MENU ========== */}
        {user?.role === "admin" && (
          <>
            <SectionLabel label="Dashboard" />
            <MenuItem to="/admin" icon={FiHome} label="Overview" active={isActive("/admin")} />

            <SectionLabel label="Management" />
            <MenuItem to="/admin/users" icon={FiUsers} label="User Management" active={isActive("/admin/users")} />
            <MenuItem to="/admin/inventory" icon={FiDroplet} label="Blood Inventory" active={isActive("/admin/inventory")} />
            <MenuItem to="/admin/requests" icon={FiClipboard} label="Blood Requests" active={isActive("/admin/requests")} badge="3" />
          </>
        )}

        {/* ========== DONOR MENU ========== */}
        {user?.role === "donar" && (
          <>
            <SectionLabel label="Dashboard" />
            <MenuItem to="/donor" icon={FiHome} label="Overview" active={isActive("/donor")} />

            <SectionLabel label="Blood" />
            <MenuItem to="/donor/availability" icon={FiDroplet} label="Blood Availability" active={isActive("/donor/availability")} />
            <MenuItem to="/donor/history" icon={FiGift} label="Donation History" active={isActive("/donor/history")} />
          </>
        )}

        {/* ========== HOSPITAL MENU ========== */}
        {user?.role === "hospital" && (
          <>
            <SectionLabel label="Dashboard" />
            <MenuItem to="/hospital" icon={FiHome} label="Overview" active={isActive("/hospital")} />

            <SectionLabel label="Blood" />
            <MenuItem to="/hospital/availability" icon={FiDroplet} label="Blood Availability" active={isActive("/hospital/availability")} />
            <MenuItem to="/hospital/request" icon={FiFileText} label="Request Blood" active={isActive("/hospital/request")} />
            <MenuItem to="/hospital/requests" icon={FiClipboard} label="My Requests" active={isActive("/hospital/requests")} />
          </>
        )}

        {/* ========== ORGANISATION MENU ========== */}
        {user?.role === "organisation" && (
          <>
            <SectionLabel label="Dashboard" />
            <MenuItem to="/organisation" icon={FiHome} label="Overview" active={isActive("/organisation")} />

            <SectionLabel label="Blood" />
            <MenuItem to="/organisation/availability" icon={FiDroplet} label="Blood Availability" active={isActive("/organisation/availability")} />
            <MenuItem to="/organisation/inventory" icon={FiPackage} label="Inventory" active={isActive("/organisation/inventory")} />
          </>
        )}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-5 border-t border-white/5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blood-500 to-blood-400 flex items-center justify-center text-white text-sm font-bold">
              {(user?.name || user?.hospitalName || user?.organisationName || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || user?.hospitalName || user?.organisationName}
              </p>
              <p className="text-gray-500 text-xs capitalize">{user?.role === 'donar' ? 'Donor' : user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
