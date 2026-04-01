import React from "react";
import { BiDonateBlood } from "react-icons/bi";
import { FiUser, FiCalendar, FiHash } from "react-icons/fi";
import { getUserDisplayName, getRoleLabel, formatDate, generateMembershipId } from "../utils/helpers";

const MembershipCard = ({ user, className = "" }) => {
  if (!user) return null;
  const membershipId = generateMembershipId(user.role, user._id);
  const displayName = getUserDisplayName(user);
  const roleLabel = getRoleLabel(user.role);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-dark-500 via-dark-400 to-dark-600 text-white shadow-elevated ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white" />
        <div className="absolute top-8 right-8 w-24 h-24 rounded-full border border-white" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border-2 border-white" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blood-500 to-blood-400 flex items-center justify-center shadow-glow">
              <BiDonateBlood className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Blood Bank</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Membership Card</p>
            </div>
          </div>
          <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            {roleLabel}
          </span>
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold tracking-tight mb-4">{displayName}</h2>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <FiHash size={14} className="text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Member ID</p>
              <p className="text-xs font-semibold tracking-wider">{membershipId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiUser size={14} className="text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Role</p>
              <p className="text-xs font-semibold">{roleLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar size={14} className="text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Joined</p>
              <p className="text-xs font-semibold">{formatDate(user.createdAt || new Date())}</p>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-2">
              <FiUser size={14} className="text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Contact</p>
                <p className="text-xs font-semibold">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
        <p className="text-[10px] text-gray-500">Valid Member • Blood Bank Management System</p>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blood-500 to-blood-400 opacity-60" />
      </div>
    </div>
  );
};

export default MembershipCard;
