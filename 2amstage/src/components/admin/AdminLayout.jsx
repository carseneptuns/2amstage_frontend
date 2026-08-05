import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-void">
      <AdminSidebar />
      <div className="min-w-0 flex-1 px-6 py-8 sm:px-10">
        <Outlet />
      </div>
    </div>
  );
}
