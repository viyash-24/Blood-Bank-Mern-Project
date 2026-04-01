import React from "react";
import { getStatusStyle } from "../../utils/helpers";

const StatusBadge = ({ status, label, dot = true, className = "" }) => {
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  const dotColors = {
    pending: 'bg-warning-500',
    approved: 'bg-success-500',
    rejected: 'bg-red-500',
    expired: 'bg-red-500',
    'near-expiry': 'bg-warning-500',
    active: 'bg-success-500',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(status)} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[status] || 'bg-gray-500'}`} />}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
