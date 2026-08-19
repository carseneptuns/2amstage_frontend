import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Bungkus tombol/link apa pun biar dapet efek "magnetic" — pas hover,
 * elemennya dikit narik ngikutin posisi cursor, terus balik pas mouse
 * keluar. Teknik micro-interaction umum di situs-situs award-winning.
 *
 * Pakai: <MagneticButton><button className="btn-primary">...</button></MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.35, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
