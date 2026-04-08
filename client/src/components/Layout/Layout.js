import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  // Get initial sidebar state from localStorage, default to true
  const getInitialSidebarState = () => {
    try {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    } catch (error) {
      console.warn('Failed to save sidebar state:', error);
    }
  }, [sidebarOpen]);

  // Memoize the setSidebarOpen function to prevent unnecessary re-renders
  const handleSidebarToggle = useCallback((newState) => {
    setSidebarOpen(newState);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50/50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={handleSidebarToggle} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => handleSidebarToggle(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={handleSidebarToggle} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
