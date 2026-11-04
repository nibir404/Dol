"use client";

import IsoDiagram, { SCENE_FOR } from "./IsoDiagram";
import DotField from "./DotField";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import clsx from "clsx";

/**
 * Solid → glass. At rest the asset is clean greyscale line-work; on hover a frosted-glass copy blurs in,
 * a red core glows at the centre and filaments radiate behind the object, while the piece tilts in 3D.
 */
export default function TiltImage({
  src, alt = "", sizes, className, imgClassName = "object-cover", priority, max = 6, dark,
}: {
  src: string; alt?: string; sizes: string; className?: string; imgClassName?: string; priority?: boolean; max?: number; dark?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });

  const px = useMotionValue(0.5), py = useMotionValue(0.5);
  const reveal = useMotionValue(0); // 0 = blueprint, 1 = illustration
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.6 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  const to = (v: number, d = 0.7) => animate(reveal, v, { duration: d, ease: [0.23, 1, 0.32, 1] });

  // Touch / no-hover: reveal once on scroll into view
  useEffect(() => {
    if (reduce) { reveal.set(1); return; }
    if (inView && !matchMedia("(hover: hover) and (pointer: fine)").matches) { px.set(0.5); py.set(0.5); to(1, 1.1); }
  }, [inView, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };


  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerEnter={(e) => { if (e.pointerType === "mouse" && !reduce) { move(e); to(1); } }}
      onPointerLeave={(e) => { px.set(0.5); py.set(0.5); if (e.pointerType === "mouse" && !reduce) to(0, 0.5); }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      style={{ perspective: 900 }}
      className={clsx("tilt group/tilt relative h-full w-full overflow-hidden", className)}
    >
      <motion.div style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }} className="absolute inset-[-3%] will-change-transform">
        <DotField />
        <IsoDiagram kind={SCENE_FOR[src.split("/").pop()!.replace(/\.\w+$/, "")] ?? "tiles"} className="absolute inset-[12%]" />
        {alt && <span className="sr-only">{alt}</span>}
      </motion.div>
    </motion.div>
  );
}
