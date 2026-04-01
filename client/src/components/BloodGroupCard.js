import React from "react";
import { FiDroplet, FiArrowUpRight, FiArrowDownLeft, FiAlertTriangle } from "react-icons/fi";
import { getBloodGroupColor } from "../utils/helpers";

const BloodGroupCard = ({ bloodGroup, totalIn = 0, totalOut = 0, available = 0, expiryWarning = false, onClick }) => {
  const gradientColor = getBloodGroupColor(bloodGroup);

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-elevated transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Expiry Warning */}
      {expiryWarning && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center shadow-md animate-pulse-soft">
          <FiAlertTriangle size={12} className="text-white" />
        </div>
      )}

      {/* Blood Group Badge */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <span className="text-white text-lg font-bold">{bloodGroup}</span>
      </div>

      {/* Available */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-dark-200">{available}<span className="text-sm text-gray-400 font-normal ml-1">ML</span></p>
        <p className="text-xs text-gray-500 mt-0.5">Available</p>
      </div>

      {/* In/Out Stats */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <FiArrowDownLeft size={12} className="text-success-500" />
          <span className="text-xs font-medium text-gray-600">{totalIn}</span>
          <span className="text-[10px] text-gray-400">In</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiArrowUpRight size={12} className="text-red-500" />
          <span className="text-xs font-medium text-gray-600">{totalOut}</span>
          <span className="text-[10px] text-gray-400">Out</span>
        </div>
      </div>
    </div>
  );
};

export default BloodGroupCard;
