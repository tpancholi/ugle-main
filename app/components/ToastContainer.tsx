import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg: customEvent.detail }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3000,
      );
    };
    window.addEventListener("show-toast", handleToast);
    return () => window.removeEventListener("show-toast", handleToast);
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-[#1C1C1C] text-white px-5 py-3.5 rounded border border-[#75C043]/40 shadow-[0_0_20px_rgba(117,192,67,0.3)] flex items-center gap-3 font-mono text-xs uppercase tracking-wider font-semibold pointer-events-auto"
          >
            <Check className="w-4 h-4 text-[#75C043]" />
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
