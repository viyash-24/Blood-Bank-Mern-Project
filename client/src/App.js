import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import RoleRoute from "./routes/RoleRoute";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import InventoryManagement from "./pages/Admin/InventoryManagement";
import RequestManagement from "./pages/Admin/RequestManagement";
import BloodRequestForm from "./pages/Admin/BloodRequestForm";

// Donor Pages
import DonorDashboard from "./pages/Donor/DonorDashboard";
import DonationHistory from "./pages/Donor/DonationHistory";

// Hospital Pages
import HospitalDashboard from "./pages/Hospital/HospitalDashboard";
import HospitalBloodRequestForm from "./pages/Hospital/BloodRequestForm";
import RequestStatus from "./pages/Hospital/RequestStatus";

// Organisation Pages
import OrgDashboard from "./pages/Organisation/OrgDashboard";

// Shared Pages
import BloodAvailability from "./pages/Shared/BloodAvailability";

import AnimatedPage from "./components/AnimatedPage";

// Home redirect based on role
const HomeRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  const roleMap = { admin: "/admin", donar: "/donor", hospital: "/hospital", organisation: "/organisation" };
  return <Navigate to={roleMap[user?.role] || "/login"} replace />;
};

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" toastStyle={{ borderRadius: "12px", fontFamily: "Inter, sans-serif" }} />
      <Routes location={location}>
        {/* ===== Public Routes ===== */}
        <Route path="/login" element={<PublicRoute><AnimatedPage><Login /></AnimatedPage></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><AnimatedPage><Register /></AnimatedPage></PublicRoute>} />

        {/* ===== Home Redirect ===== */}
        <Route path="/" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />

        {/* ===== Admin Routes ===== */}
        <Route path="/admin" element={<ProtectedRoute><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AnimatedPage><UserManagement /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute><AnimatedPage><InventoryManagement /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/requests" element={<ProtectedRoute><AnimatedPage><RequestManagement /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/blood-request" element={<ProtectedRoute><AnimatedPage><BloodRequestForm /></AnimatedPage></ProtectedRoute>} />

        {/* ===== Donor Routes ===== */}
        <Route path="/donor" element={<ProtectedRoute><AnimatedPage><DonorDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/donor/availability" element={<ProtectedRoute><AnimatedPage><BloodAvailability /></AnimatedPage></ProtectedRoute>} />
        <Route path="/donor/history" element={<ProtectedRoute><AnimatedPage><DonationHistory /></AnimatedPage></ProtectedRoute>} />

        {/* ===== Hospital Routes ===== */}
        <Route path="/hospital" element={<ProtectedRoute><AnimatedPage><HospitalDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/hospital/availability" element={<ProtectedRoute><AnimatedPage><BloodAvailability /></AnimatedPage></ProtectedRoute>} />
        <Route path="/hospital/request" element={<ProtectedRoute><AnimatedPage><HospitalBloodRequestForm /></AnimatedPage></ProtectedRoute>} />
        <Route path="/hospital/requests" element={<ProtectedRoute><AnimatedPage><RequestStatus /></AnimatedPage></ProtectedRoute>} />

        {/* ===== Organisation Routes ===== */}
        <Route path="/organisation" element={<ProtectedRoute><AnimatedPage><OrgDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/organisation/availability" element={<ProtectedRoute><AnimatedPage><BloodAvailability /></AnimatedPage></ProtectedRoute>} />
        <Route path="/organisation/inventory" element={<ProtectedRoute><AnimatedPage><InventoryManagement /></AnimatedPage></ProtectedRoute>} />

        {/* ===== Catch All ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
