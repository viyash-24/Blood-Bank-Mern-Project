import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../redux/features/auth/authActions";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  //get user current
  const getUser = async () => {
    try {
      const res = await dispatch(getCurrentUser());
      if (res.meta.requestStatus === "rejected") {
        localStorage.clear();
      }
    } catch (error) {
      localStorage.clear();
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, dispatch]); // Include user and dispatch

  if (localStorage.getItem("token")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
