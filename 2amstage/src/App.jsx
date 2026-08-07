import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

import { useThemeStore } from "./store/themeStore";
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
import ScanTicket from "./pages/ScanTicket";
import Profile from "./pages/Profile";
import MyProfileRedirect from "./pages/MyProfileRedirect";
import ChatList from "./pages/ChatList";
import ChatRoom from "./pages/ChatRoom";
import SearchUsers from "./pages/SearchUsers";

import useChatNotifier from "./hooks/useChatNotifier";

const STAFF_ROLES = ["organizer", "super_admin"];
const SCAN_ROLES = ["petugas", "super_admin"];

export default function App() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin") || location.pathname.startsWith("/scan");
  const initTheme = useThemeStore((s) => s.init);
  const themeMode = useThemeStore((s) => s.mode);

  useChatNotifier();

  useEffect(() => {
    initTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster theme={themeMode} position="top-center" />
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
              path="/profil"
              element={
                <ProtectedRoute>
                  <PageTransition><MyProfileRedirect /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route path="/profil/:username" element={<PageTransition><Profile /></PageTransition>} />
            <Route
              path="/cari"
              element={
                <ProtectedRoute>
                  <PageTransition><SearchUsers /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <PageTransition><ChatList /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ProtectedRoute>
                  <PageTransition><ChatRoom /></PageTransition>
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

            <Route
              path="/scan"
              element={
                <RoleRoute roles={SCAN_ROLES}>
                  <ScanTicket />
                </RoleRoute>
              }
            />

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminArea && <Footer />}
    </div>
  );
}
