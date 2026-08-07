import { Music4 } from "lucide-react";
import { assetUrl } from "../../lib/api";

const GRADIENTS = [
  "from-stage/40 via-surface2 to-violet/30",
  "from-violet/40 via-surface2 to-stage/30",
  "from-amber/30 via-surface2 to-stage/30",
];

function hashIndex(str = "", mod = GRADIENTS.length) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 997;
  return h % mod;
}

export default function PosterFrame({ src, alt, className = "" }) {
  const url = assetUrl(src);
  if (!url) {
    const grad = GRADIENTS[hashIndex(alt)];
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${grad} ${className}`}
      >
        <Music4 className="h-10 w-10 text-dim" strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
      className={`object-cover ${className}`}
    />
  );
}
