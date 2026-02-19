import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import Donar from "./pages/Dashboard/Donar";
import Hospitals from "./pages/Dashboard/Hospitals";
import OrganisationPage from "./pages/Dashboard/OrganisationPage";
import Consumer from "./pages/Dashboard/Consumer";
import Donation from "./pages/Donation";
import Analytics from "./pages/Dashboard/Analytics";
import DonarList from "./pages/Admin/DonarList";
import HospitalList from "./pages/Admin/HospitalList";
import OrgList from "./pages/Admin/OrgList";
import AdminHome from "./pages/Admin/AdminHome";
import { AnimatePresence } from "framer-motion";
import AnimatedPage from "./components/shared/AnimatedPage";

function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer />
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
                  <DonarList />
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
                  <Donar />
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
