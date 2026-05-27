import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", confirmColor = "blood", loading = false }) => {
  if (!isOpen) return null;

  const colorMap = {
    blood: "from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 shadow-blood-600/20",
    green: "from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-success-500/20",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20",
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-0">
            <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
              <FiAlertTriangle className="text-warning-500" size={20} />
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <FiX size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-dark-200 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r ${colorMap[confirmColor]} rounded-xl shadow-md transition-all duration-300 disabled:opacity-50`}
            >
              {loading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
