import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RoleRoute from "./components/layout/RoleRoute";
import PageTransition from "./components/layout/PageTransition";
import AdminLayout from "./components/admin/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ConcertDetail from "./pages/ConcertDetail";
import Checkout from "./pages/Checkout";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";

const STAFF_ROLES = ["organizer", "super_admin"];

export default function App() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "#16141E",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#F7F5FB",
          },
        }}
      />
      {!isAdminArea && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route
              path="/concerts/:id"
              element={<PageTransition><ConcertDetail /></PageTransition>}
            />
            <Route
              path="/checkout/:orderId"
              element={
                <ProtectedRoute>
                  <PageTransition><Checkout /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tickets"
              element={
                <ProtectedRoute>
                  <PageTransition><MyTickets /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <RoleRoute roles={STAFF_ROLES}>
                  <AdminLayout />
                </RoleRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="events" element={<ManageEvents />} />
            </Route>

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminArea && <Footer />}
    </div>
  );
}
