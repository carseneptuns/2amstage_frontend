import { NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, LogOut, Zap, ShieldCheck, ScanLine, Globe, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Kelola Event", icon: CalendarRange },
];

export default function AdminSidebar({ onNavigate, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = user?.role === "super_admin" ? [...LINKS, { to: "/scan", label: "Scan Tiket", icon: ScanLine }] : LINKS;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-full w-full flex-col bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-hairline/10 px-6 py-6">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-stage" strokeWidth={2.5} />
          <span className="font-display text-lg tracking-wide">
            2AM<span className="text-stage">STAGE</span>
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-full p-1.5 text-dim hover:bg-hairline/[0.03] hover:text-hi md:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-hairline/10 px-6 py-4">
        <ShieldCheck className="h-4 w-4 text-violet" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-hi">{user?.nama}</p>
          <p className="text-xs capitalize text-dim">
            {user?.role === "super_admin" ? "Super Admin" : "Organizer"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-stage/15 text-stage"
                  : "text-mid hover:bg-hairline/[0.03] hover:text-hi"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-hairline/10 p-3 space-y-1">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mid transition hover:bg-hairline/[0.03] hover:text-hi"
        >
          <Globe className="h-4 w-4" /> Kembali ke Situs
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mid transition hover:bg-stage/10 hover:text-stage"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </div>
  );
}
