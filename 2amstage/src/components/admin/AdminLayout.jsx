import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Zap } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-void md:flex-row">
      {/* Desktop: static sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-black/10 md:block">
        <AdminSidebar />
      </aside>

      {/* Mobile: top bar with hamburger */}
      <header className="flex shrink-0 items-center justify-between border-b border-black/10 bg-surface px-5 py-4 md:hidden">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-stage" strokeWidth={2.5} />
          <span className="font-display text-base tracking-wide">
            2AM<span className="text-stage">STAGE</span>
          </span>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="rounded-full p-2 text-mid hover:bg-black/[0.03] hover:text-hi"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile: drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[90] bg-void/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-[100] w-72 max-w-[85vw] md:hidden"
            >
              <AdminSidebar onNavigate={() => setDrawerOpen(false)} onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <Outlet />
      </div>
    </div>
  );
}
