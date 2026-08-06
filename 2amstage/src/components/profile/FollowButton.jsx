import { useEffect, useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import followService from "../../services/followService";
import { apiErrorMessage } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function FollowButton({ userId, onChange }) {
  const currentUser = useAuthStore((s) => s.user);
  const [status, setStatus] = useState(null); // { is_following, is_followed_by, is_mutual }
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await followService.status(userId);
      setStatus(res.data);
    } catch {
      // silently ignore — button just won't render a confident state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!currentUser || currentUser.id === userId) return null;
  if (loading) return <div className="btn-secondary !px-5 opacity-50"><Loader2 className="h-4 w-4 animate-spin" /></div>;
  if (!status) return null;

  const toggle = async () => {
    setBusy(true);
    try {
      if (status.is_following) {
        await followService.unfollow(userId);
      } else {
        await followService.follow(userId);
      }
      const res = await followService.status(userId);
      setStatus(res.data);
      onChange?.(res.data);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal memproses follow."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={status.is_following ? "btn-secondary !px-5" : "btn-primary !px-5"}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : status.is_following ? (
        <>
          <UserCheck className="h-4 w-4" /> Mengikuti
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" /> Follow
        </>
      )}
    </button>
  );
}
