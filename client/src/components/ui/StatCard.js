import React from "react";

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = "blood", className = "" }) => {
  const colorMap = {
    blood: "from-blood-600 to-blood-500",
    blue: "from-info-500 to-info-600",
    green: "from-success-500 to-success-600",
    amber: "from-warning-500 to-warning-600",
    purple: "from-purple-500 to-purple-600",
    emerald: "from-emerald-500 to-emerald-600",
  };

  return (
    <div className={`bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 group ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-dark-200 tracking-tight animate-count-up">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${trend >= 0 ? 'text-success-600' : 'text-red-600'}`}>
              <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
              {trendLabel && <span className="text-gray-400 font-normal">{trendLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="text-white" size={22} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
