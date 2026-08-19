import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Ticket, User, LogOut, LayoutDashboard, ScanLine, MessageCircle, Search } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import ThemeToggle, { ThemeToggleRow } from "./ThemeToggle";

const HOME_LINKS = [
  { id: "concerts", label: "Konser" },
  { id: "services", label: "Layanan" },
  { id: "about", label: "Tentang" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const scrollEl = document.querySelector(".snap-container") || window;
    const onScroll = () => {
      const y = scrollEl === window ? window.scrollY : scrollEl.scrollTop;
      setScrolled(y > 24);
    };
    onScroll();
    scrollEl.addEventListener("scroll", onScroll);
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (!isHome) return;
    const sections = HOME_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const goToSection = (id) => {
    setOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-hairline/10 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <img
            src="/stage-icon.svg"
            alt="2AMSTAGE"
            className="h-7 w-7 transition-transform group-hover:rotate-12"
          />
          <span className="font-display text-xl tracking-wide">
            2AM<span className="text-stage">STAGE</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {HOME_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => goToSection(l.id)}
              className={`nav-link text-sm font-medium ${active === l.id && isHome ? "active" : ""}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated() ? (
            <>
              {(user?.role === "organizer" || user?.role === "super_admin") && (
                <Link to="/admin" className="nav-link flex items-center gap-1.5 text-sm font-medium">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              )}
              {user?.role === "petugas" && (
                <Link to="/scan" className="nav-link flex items-center gap-1.5 text-sm font-medium">
                  <ScanLine className="h-4 w-4" /> Scan Tiket
                </Link>
              )}
              <Link to="/my-tickets" className="nav-link flex items-center gap-1.5 text-sm font-medium">
                <Ticket className="h-4 w-4" /> Tiket Saya
              </Link>
              <Link to="/chat" className="nav-link flex items-center gap-1.5 text-sm font-medium">
                <MessageCircle className="h-4 w-4" /> Pesan
              </Link>
              <Link to="/cari" className="nav-link flex items-center gap-1.5 text-sm font-medium">
                <Search className="h-4 w-4" /> Cari
              </Link>
              <div className="mx-1 h-5 w-px bg-hairline/[0.04]" />
              <ThemeToggle />
              <Link
                to="/profil"
                className="flex items-center gap-1.5 text-sm text-mid hover:text-hi"
              >
                <User className="h-4 w-4" /> {user?.nama?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-hairline/10 px-3 py-1.5 text-sm text-mid transition hover:border-stage/40 hover:text-stage"
              >
                <LogOut className="h-3.5 w-3.5" /> Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-sm font-medium">
                Masuk
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
                Daftar
              </Link>
            </>
          )}
        </div>

        <button className="text-hi md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-t border-hairline/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {HOME_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => goToSection(l.id)}
                  className="rounded-lg px-3 py-3 text-left text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                >
                  {l.label}
                </button>
              ))}
              <div className="my-2 h-px bg-hairline/[0.04]" />
              <ThemeToggleRow />
              <div className="my-2 h-px bg-hairline/[0.04]" />
              {isAuthenticated() ? (
                <>
                  {(user?.role === "organizer" || user?.role === "super_admin") && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  )}
                  {user?.role === "petugas" && (
                    <Link
                      to="/scan"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                    >
                      <ScanLine className="h-4 w-4" /> Scan Tiket
                    </Link>
                  )}
                  <Link
                    to="/my-tickets"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                  >
                    <Ticket className="h-4 w-4" /> Tiket Saya
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                  >
                    <MessageCircle className="h-4 w-4" /> Pesan
                  </Link>
                  <Link
                    to="/cari"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                  >
                    <Search className="h-4 w-4" /> Cari User
                  </Link>
                  <Link
                    to="/profil"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                  >
                    <User className="h-4 w-4" /> Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-stage hover:bg-stage/10"
                  >
                    <LogOut className="h-4 w-4" /> Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-mid hover:bg-hairline/[0.03] hover:text-hi"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="btn-primary mt-1 w-full text-sm"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
