import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Donor from "./pages/Dashboard/Donor";
import Hospitals from "./pages/Dashboard/Hospitals";
import OrganisationPage from "./pages/Dashboard/OrganisationPage";
import Consumer from "./pages/Dashboard/Consumer";
import Donation from "./pages/Donation";
import Analytics from "./pages/Dashboard/Analytics";
import DonorList from "./pages/Admin/DonorList";
import HospitalList from "./pages/Admin/HospitalList";
import OrgList from "./pages/Admin/OrgList";
import AdminHome from "./pages/Admin/AdminHome";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./components/AnimatedPage";

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <AdminHome />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donar-list"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <DonorList />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital-list"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <HospitalList />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/org-list"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <OrgList />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hospital"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Hospitals />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Analytics />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Consumer />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donation"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Donation />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orgnaisation"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <OrganisationPage />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/donar"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <Donor />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AnimatedPage>
                  <HomePage />
                </AnimatedPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <AnimatedPage>
                  <Register />
                </AnimatedPage>
              </PublicRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
