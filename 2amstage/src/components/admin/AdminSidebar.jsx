import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, LogOut, Zap, ShieldCheck, ScanLine } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/events", label: "Kelola Event", icon: CalendarRange },
  { to: "/scan", label: "Scan Tiket", icon: ScanLine },
];

export default function AdminSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/10 bg-surface">
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-6">
        <Zap className="h-6 w-6 text-stage" strokeWidth={2.5} />
        <span className="font-display text-lg tracking-wide">
          2AM<span className="text-stage">STAGE</span>
        </span>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
        <ShieldCheck className="h-4 w-4 text-violet" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-hi">{user?.nama}</p>
          <p className="text-xs capitalize text-dim">
            {user?.role === "super_admin" ? "Super Admin" : "Organizer"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-stage/15 text-stage"
                  : "text-mid hover:bg-white/5 hover:text-hi"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mid transition hover:bg-stage/10 hover:text-stage"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
