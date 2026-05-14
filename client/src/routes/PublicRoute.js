import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (token && user) {
    // Redirect logged-in users to their role-specific dashboard
    const roleMap = {
      admin: "/admin",
      donar: "/donor",
      hospital: "/hospital",
      organisation: "/organisation",
    };
    return <Navigate to={roleMap[user.role] || "/"} replace />;
  }

  // If token exists but user hasn't loaded yet, let the page render
  // (getCurrentUser will load the user, PublicRoute will re-render)
  if (token && !user) {
    return children;
  }

  return children;
};

export default PublicRoute;
