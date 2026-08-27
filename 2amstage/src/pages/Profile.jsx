import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Settings, MessageCircle, ArrowLeft, AtSign, Sparkles } from "lucide-react";
import profileService from "../services/profileService";
import chatService from "../services/chatService";
import followService from "../services/followService";
import badgeService from "../services/badgeService";
import { apiErrorMessage, assetUrl } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import LoadingScreen from "../components/ui/LoadingScreen";
import FollowButton from "../components/profile/FollowButton";
import FollowListModal from "../components/profile/FollowListModal";
import BadgeGrid from "../components/profile/BadgeGrid";
import EditProfileModal from "../components/profile/EditProfileModal";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [listModal, setListModal] = useState(null); // "followers" | "following" | null
  const [mutualStatus, setMutualStatus] = useState(null);
  const [startingChat, setStartingChat] = useState(false);

  const isOwner = currentUser?.username && currentUser.username === username;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getByUsername(username);
      setData(res.data);
    } catch (err) {
      setError(apiErrorMessage(err, "Profil tidak ditemukan."));
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!data?.user?.id || isOwner) return;
    followService.status(data.user.id).then((res) => setMutualStatus(res.data)).catch(() => {});
  }, [data, isOwner]);

  // Owner-only badge management (needs the full list, including hidden ones)
  const [myBadges, setMyBadges] = useState(null);
  useEffect(() => {
    if (!isOwner) return;
    badgeService.getMine().then((res) => setMyBadges(res.data)).catch(() => {});
  }, [isOwner]);

  const handleToggleVisible = async (badge) => {
    const updated = myBadges.map((b) => (b.id === badge.id ? { ...b, is_visible: !b.is_visible } : b));
    setMyBadges(updated);
    try {
      await badgeService.saveOrder(updated.map((b) => ({ id: b.id, is_visible: b.is_visible, display_order: b.display_order })));
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menyimpan visibilitas badge."));
    }
  };

  const handleMoveBadge = async (index, direction) => {
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= myBadges.length) return;
    const updated = [...myBadges];
    [updated[index], updated[swapWith]] = [updated[swapWith], updated[index]];
    const reindexed = updated.map((b, i) => ({ ...b, display_order: i }));
    setMyBadges(reindexed);
    try {
      await badgeService.saveOrder(reindexed.map((b) => ({ id: b.id, is_visible: b.is_visible, display_order: b.display_order })));
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menyimpan urutan badge."));
    }
  };

  const handleStartChat = async () => {
    if (!data?.user?.id) return;
    setStartingChat(true);
    try {
      const res = await chatService.startConversation(data.user.id);
      navigate(`/chat/${res.data.conversation.id}`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Kalian harus saling follow dulu untuk bisa chat."));
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) return <LoadingScreen label="Membuka profil..." />;

  if (error || !data) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 pt-24 text-center">
        <p className="text-mid">{error}</p>
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const { user, follower_count, following_count, badges } = data;
  const displayBadges = isOwner && myBadges ? myBadges : badges;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-20 pt-28 sm:px-8">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-hairline/10 bg-surface2">
          {user.avatar_url ? (
            <img src={assetUrl(user.avatar_url)} alt={user.nama} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-3xl text-dim">
              {user.nama?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl tracking-wide sm:text-3xl">{user.nama}</h1>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-sm text-dim sm:justify-start">
            <AtSign className="h-3.5 w-3.5" />
            {user.username}
          </p>
          {user.bio && <p className="mt-3 max-w-md text-sm text-mid">{user.bio}</p>}

          {user.current_obsession && (
            <div className="mt-3 flex justify-center sm:justify-start">
              <span className="glass inline-flex items-center gap-1.5 rounded-full border border-hairline/10 px-3 py-1 text-xs font-medium text-hi">
                <Sparkles className="h-3.5 w-3.5 text-amber" />
                Current Obsession: {user.current_obsession}
              </span>
            </div>
          )}

          <div className="mt-4 flex justify-center gap-6 text-sm sm:justify-start">
            <button onClick={() => setListModal("followers")} className="transition hover:opacity-80">
              <strong className="text-hi">{follower_count}</strong> <span className="text-dim">Pengikut</span>
            </button>
            <button onClick={() => setListModal("following")} className="transition hover:opacity-80">
              <strong className="text-hi">{following_count}</strong> <span className="text-dim">Mengikuti</span>
            </button>
          </div>

          <div className="mt-5 flex justify-center gap-2 sm:justify-start">
            {isOwner ? (
              <button onClick={() => setEditOpen(true)} className="btn-secondary">
                <Settings className="h-4 w-4" /> Edit Profil
              </button>
            ) : (
              <>
                <FollowButton userId={user.id} onChange={setMutualStatus} />
                {mutualStatus?.is_mutual && (
                  <button onClick={handleStartChat} disabled={startingChat} className="btn-secondary">
                    <MessageCircle className="h-4 w-4" /> Chat
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl tracking-wide">
          Concert Passport
          {isOwner && <span className="ml-2 text-xs font-normal text-dim">— hover badge buat atur urutan & sembunyikan</span>}
        </h2>
        <BadgeGrid
          badges={displayBadges}
          editable={isOwner}
          onToggleVisible={handleToggleVisible}
          onMove={handleMoveBadge}
        />
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => load()}
      />

      <FollowListModal
        userId={user.id}
        mode={listModal}
        onClose={() => setListModal(null)}
      />
    </div>
  );
}
