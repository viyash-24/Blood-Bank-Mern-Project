import React from "react";
import { FiAlertTriangle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const AlertBanner = ({ type = "warning", title, message, onDismiss, className = "" }) => {
  const config = {
    warning: { icon: FiAlertTriangle, bg: 'bg-warning-50 border-warning-100', text: 'text-warning-700', iconColor: 'text-warning-500' },
    error: { icon: FiAlertCircle, bg: 'bg-red-50 border-red-200', text: 'text-red-700', iconColor: 'text-red-500' },
    info: { icon: FiInfo, bg: 'bg-info-50 border-info-100', text: 'text-info-700', iconColor: 'text-info-500' },
    success: { icon: FiInfo, bg: 'bg-success-50 border-success-100', text: 'text-success-700', iconColor: 'text-success-500' },
  };

  const { icon: Icon, bg, text, iconColor } = config[type] || config.warning;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${bg} animate-fade-in ${className}`}>
      <Icon className={`flex-shrink-0 mt-0.5 ${iconColor}`} size={18} />
      <div className="flex-1 min-w-0">
        {title && <p className={`text-sm font-semibold ${text}`}>{title}</p>}
        {message && <p className={`text-xs ${text} opacity-80 mt-0.5`}>{message}</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/5 ${text} transition-colors`}>
          <FiX size={14} />
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
