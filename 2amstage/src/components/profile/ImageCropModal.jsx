import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ZoomIn } from "lucide-react";

const VIEW = 300; // ukuran area crop yang ditampilin (persegi), dalam px
const OUTPUT = 512; // resolusi hasil akhir yang di-export

export default function ImageCropModal({ file, onCancel, onConfirm }) {
  const imgRef = useRef(null);
  const dragRef = useRef(null); // { startX, startY, startOffsetX, startOffsetY }
  const [imgUrl, setImgUrl] = useState(null);
  const [natural, setNatural] = useState(null); // { w, h }
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale = natural ? Math.max(VIEW / natural.w, VIEW / natural.h) : 1;
  const displayScale = baseScale * zoom;
  const displayW = natural ? natural.w * displayScale : 0;
  const displayH = natural ? natural.h * displayScale : 0;

  const clampOffset = useCallback(
    (x, y, w = displayW, h = displayH) => ({
      x: Math.min(0, Math.max(VIEW - w, x)),
      y: Math.min(0, Math.max(VIEW - h, y)),
    }),
    [displayW, displayH]
  );

  const handleImgLoad = (e) => {
    const w = e.target.naturalWidth;
    const h = e.target.naturalHeight;
    setNatural({ w, h });
    const scale = Math.max(VIEW / w, VIEW / h);
    setOffset({ x: (VIEW - w * scale) / 2, y: (VIEW - h * scale) / 2 });
  };

  const handleZoomChange = (newZoom) => {
    if (!natural) return;
    const oldW = natural.w * baseScale * zoom;
    const oldH = natural.h * baseScale * zoom;
    // anchor titik tengah viewport tetep nunjuk ke bagian gambar yang sama pas di-zoom
    const fracX = (VIEW / 2 - offset.x) / oldW;
    const fracY = (VIEW / 2 - offset.y) / oldH;
    const newW = natural.w * baseScale * newZoom;
    const newH = natural.h * baseScale * newZoom;
    const next = clampOffset(VIEW / 2 - fracX * newW, VIEW / 2 - fracY * newH, newW, newH);
    setZoom(newZoom);
    setOffset(next);
  };

  const onPointerDown = (e) => {
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startOffsetX: offset.x, startOffsetY: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.startOffsetX + dx, dragRef.current.startOffsetY + dy));
  };

  const onPointerUp = () => {
    setDragging(false);
    dragRef.current = null;
  };

  const handleConfirm = () => {
    if (!natural) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");

    const sx = (0 - offset.x) / displayScale;
    const sy = (0 - offset.y) / displayScale;
    const sSize = VIEW / displayScale;

    ctx.drawImage(imgRef.current, sx, sy, sSize, sSize, 0, 0, OUTPUT, OUTPUT);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const cropped = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        onConfirm(cropped);
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center bg-void/90 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="glass w-full max-w-sm overflow-hidden rounded-2xl border border-hairline/10"
        >
          <div className="flex items-center justify-between border-b border-hairline/10 p-4">
            <button onClick={onCancel} className="text-dim hover:text-hi">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-sm tracking-wide">Atur Foto Profil</h3>
            <button onClick={handleConfirm} className="text-stage hover:opacity-80">
              <Check className="h-5 w-5" />
            </button>
          </div>

          <div
            className="relative mx-auto touch-none select-none overflow-hidden bg-black"
            style={{ width: VIEW, height: VIEW, cursor: dragging ? "grabbing" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {imgUrl && (
              <img
                ref={imgRef}
                src={imgUrl}
                onLoad={handleImgLoad}
                alt=""
                draggable={false}
                className="pointer-events-none absolute"
                style={{
                  left: offset.x,
                  top: offset.y,
                  width: displayW || "auto",
                  height: displayH || "auto",
                  maxWidth: "none",
                  maxHeight: "none",
                }}
              />
            )}
            {/* Overlay lingkaran biar keliatan bagian yang bakal ke-crop */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: `0 0 0 9999px rgba(0,0,0,0.55)`,
                borderRadius: "9999px",
                margin: 20,
              }}
            />
          </div>

          <div className="flex items-center gap-3 p-5">
            <ZoomIn className="h-4 w-4 shrink-0 text-dim" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="w-full accent-stage"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
