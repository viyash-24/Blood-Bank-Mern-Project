import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiDonateBlood } from "react-icons/bi";
import {
  FiPackage,
  FiHeart,
  FiActivity,
  FiUsers,
  FiList,
  FiGrid,
  FiGift,
  FiChevronLeft,
} from "react-icons/fi";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ to, icon: Icon, label, active }) => (
    <Link
      to={to}
      className={`group flex items-center gap-3 px-4 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-blood-600 to-blood-500 text-white shadow-lg shadow-blood-600/20"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon
        size={20}
        className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
          active ? "text-white" : ""
        }`}
      />
      {isOpen && (
        <span className="whitespace-nowrap animate-fade-in">{label}</span>
      )}
    </Link>
  );

  return (
    <aside
      className={`fixed lg:relative z-30 flex flex-col h-screen bg-dark-500 transition-all duration-300 ease-in-out ${
        isOpen ? "w-[260px]" : "w-[72px]"
      } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-[70px] px-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blood-600 to-blood-400 flex items-center justify-center shadow-glow animate-blood-drop">
            <BiDonateBlood className="text-white" size={22} />
          </div>
          {isOpen && (
            <div className="animate-fade-in">
              <h1 className="text-white font-bold text-base leading-tight tracking-tight">
                Blood Bank
              </h1>
              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">
                Management
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all duration-200"
        >
          <FiChevronLeft
            size={18}
            className={`transition-transform duration-300 ${
              !isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {isOpen && (
          <p className="px-7 mb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600 animate-fade-in">
            Navigation
          </p>
        )}

        {/* Organisation Menu */}
        {user?.role === "organisation" && (
          <>
            <MenuItem
              to="/"
              icon={FiPackage}
              label="Inventory"
              active={isActive("/")}
            />
            <MenuItem
              to="/donar"
              icon={FiHeart}
              label="Donor"
              active={isActive("/donar")}
            />
            <MenuItem
              to="/hospital"
              icon={FiActivity}
              label="Hospital"
              active={isActive("/hospital")}
            />
          </>
        )}

        {/* Admin Menu */}
        {user?.role === "admin" && (
          <>
            <MenuItem
              to="/donar-list"
              icon={FiUsers}
              label="Donor List"
              active={isActive("/donar-list")}
            />
            <MenuItem
              to="/hospital-list"
              icon={FiList}
              label="Hospital List"
              active={isActive("/hospital-list")}
            />
            <MenuItem
              to="/org-list"
              icon={FiGrid}
              label="Organisation List"
              active={isActive("/org-list")}
            />
          </>
        )}

        {/* Donor & Hospital shared menu */}
        {(user?.role === "donar" || user?.role === "hospital") && (
          <MenuItem
            to="/orgnaisation"
            icon={FiGrid}
            label="Organisation"
            active={isActive("/orgnaisation")}
          />
        )}

        {/* Hospital only */}
        {user?.role === "hospital" && (
          <MenuItem
            to="/consumer"
            icon={FiUsers}
            label="Consumer"
            active={isActive("/consumer")}
          />
        )}

        {/* Donor only */}
        {user?.role === "donar" && (
          <MenuItem
            to="/donation"
            icon={FiGift}
            label="Donation"
            active={isActive("/donation")}
          />
        )}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-5 border-t border-white/5 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blood-500 to-blood-400 flex items-center justify-center text-white text-sm font-bold">
              {(
                user?.name ||
                user?.hospitalName ||
                user?.organisationName ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || user?.hospitalName || user?.organisationName}
              </p>
              <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
