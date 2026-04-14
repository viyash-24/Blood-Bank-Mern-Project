import React, { useState } from "react";
import { FiBell, FiX, FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";
import { timeAgo } from "../../utils/helpers";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    const icons = { urgent: FiAlertTriangle, warning: FiAlertTriangle, info: FiInfo, success: FiCheckCircle };
    return icons[type] || FiInfo;
  };

  const getIconColor = (type) => {
    const colors = { urgent: 'text-red-500 bg-red-50', warning: 'text-warning-500 bg-warning-50', info: 'text-info-500 bg-info-50', success: 'text-success-500 bg-success-50' };
    return colors[type] || 'text-gray-500 bg-gray-50';
  };

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blood-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-soft">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)} />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-dark-200">Notifications</h2>
            <p className="text-xs text-gray-500 mt-0.5">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-blood-600 hover:text-blood-700 px-3 py-1.5 rounded-lg hover:bg-blood-50 transition-colors">
                Mark all read
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto h-[calc(100%-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiBell size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification._id}
                  onClick={() => markAsRead(notification._id)}
                  className={`flex gap-3 p-5 border-b border-gray-50 cursor-pointer hover:bg-gray-50/80 transition-colors ${!notification.read ? 'bg-blood-50/20' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-dark-200' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-blood-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{timeAgo(notification.createdAt)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
  
};

export default NotificationPanel;
