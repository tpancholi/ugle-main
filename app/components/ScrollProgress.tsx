"use client";
import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.75 bg-[#75C043] origin-left z-50 shadow-[0_0_15px_#75C043]"
      style={{ scaleX }}
    />
  );
}
