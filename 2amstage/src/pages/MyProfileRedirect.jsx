import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AtSign } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import EditProfileModal from "../components/profile/EditProfileModal";

export default function MyProfileRedirect() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(true);

  if (user?.username) {
    return <Navigate to={`/profil/${user.username}`} replace />;
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 pt-24 text-center">
      <AtSign className="h-8 w-8 text-dim" />
      <p className="max-w-sm text-mid">
        Kamu belum punya username. Set username dulu biar profil kamu bisa dilihat orang lain.
      </p>
      <EditProfileModal open={open} onClose={() => setOpen(false)} onSaved={() => window.location.reload()} />
      {!open && (
        <button onClick={() => setOpen(true)} className="btn-primary">
          Atur Username
        </button>
      )}
    </div>
  );
}
