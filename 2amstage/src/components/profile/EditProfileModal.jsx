import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { toast } from "sonner";
import profileService from "../../services/profileService";
import { apiErrorMessage, assetUrl } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";
import { InlineSpinner } from "../ui/LoadingScreen";
import ImageCropModal from "./ImageCropModal";

export default function EditProfileModal({ open, onClose, onSaved }) {
  const { user, updateUser } = useAuthStore();
  const [nama, setNama] = useState(user?.nama || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [currentObsession, setCurrentObsession] = useState(user?.current_obsession || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url ? assetUrl(user.avatar_url) : null);
  const [cropSource, setCropSource] = useState(null); // File yang lagi diatur crop-nya
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropSource(file);
    e.target.value = ""; // biar bisa pilih file yang sama lagi kalau dibatalin
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nama", nama);
      fd.append("username", username.trim().toLowerCase());
      fd.append("bio", bio);
      fd.append("current_obsession", currentObsession);
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await profileService.update(fd);
      updateUser(res.data.user);
      toast.success("Profil berhasil diperbarui.");
      onSaved?.(res.data.user);
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menyimpan profil."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-void/85 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="glass max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-hairline/10 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide">Edit Profil</h2>
            <button onClick={onClose} className="text-dim hover:text-hi">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center">
              <label className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-hairline/10 bg-surface2">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-dim">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-void/60 opacity-0 transition group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-hi" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-mid">Nama</label>
              <input value={nama} onChange={(e) => setNama(e.target.value)} className="input-field w-full" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-mid">Username</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dim">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-z0-9._]/gi, ""))}
                  className="input-field w-full pl-8"
                  placeholder="username-unik"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-mid">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={500}
                className="input-field w-full resize-none"
                placeholder="Ceritain sedikit tentang kamu..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-mid">Current Obsession</label>
              <input
                value={currentObsession}
                onChange={(e) => setCurrentObsession(e.target.value)}
                maxLength={150}
                className="input-field w-full"
                placeholder='Contoh: "Taylor Swift :)"'
              />
              <p className="mt-1 text-[11px] text-dim">Cuma bisa 1 badge — apa yang lagi kamu obsesi sekarang?</p>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <InlineSpinner /> : "Simpan Profil"}
            </button>
          </form>
        </motion.div>
      </motion.div>

      {cropSource && (
        <ImageCropModal
          file={cropSource}
          onCancel={() => setCropSource(null)}
          onConfirm={(croppedFile) => {
            setAvatarFile(croppedFile);
            setAvatarPreview(URL.createObjectURL(croppedFile));
            setCropSource(null);
          }}
        />
      )}
    </AnimatePresence>
  );
}
