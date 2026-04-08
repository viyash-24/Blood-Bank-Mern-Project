import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    // Redirect to user's own dashboard
    const dashboardMap = {
      admin: "/admin",
      donar: "/donor",
      hospital: "/hospital",
      organisation: "/organisation",
    };
    return <Navigate to={dashboardMap[user.role] || "/"} replace />;
  }

  return children;
};

export default RoleRoute;
