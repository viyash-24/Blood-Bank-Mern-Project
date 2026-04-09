import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../redux/features/auth/authActions";
import { Navigate } from "react-router-dom";

import Spinner from "../components/Spinner";
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && !user) {
      (async () => {
        try {
          const res = await dispatch(getCurrentUser());
          if (res.meta.requestStatus === "rejected") {
            localStorage.clear();
          }
        } catch (error) {
          localStorage.clear();
          console.log(error);
        }
      })();
    }
  }, [dispatch, token, user]);

  if (!token) return <Navigate to="/login" replace />;

  // Token exists but user not yet loaded (common after full page reload)
  if (!user) return <Spinner />;

  return children;
};

export default ProtectedRoute;
