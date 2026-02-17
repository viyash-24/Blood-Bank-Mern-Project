import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../redux/features/auth/authActions";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }, [user, dispatch]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
