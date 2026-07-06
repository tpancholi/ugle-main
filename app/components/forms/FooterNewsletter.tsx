"use client";
import { useActionState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { newsletterJoin, type ActionState } from "@/app/actions/newsletter";

const initialState: ActionState = {
  success: false,
  message: "",
};

export default function FooterNewsletter() {
  const [state, formAction, pending] = useActionState(
    newsletterJoin,
    initialState,
  );
  const turnstileRef = useRef<TurnstileInstance>(null);

  const error = state?.error;

  // Reset the widget after a failed submission so the token isn't reused
  useEffect(() => {
    if (!pending && state.error) {
      turnstileRef.current?.reset();
    }
  }, [pending, state]);

  return (
    <AnimatePresence mode="wait">
      {state.success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#75C043]/10 border border-[#75C043]/40 rounded px-6 py-3.5 flex items-center justify-center gap-3 w-full md:w-87.5 shadow-[0_0_20px_rgba(117,192,67,0.2)]"
        >
          <Check className="size-5 text-[#75C043]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[#75C043] font-bold">
            Successfully Joined
          </span>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col w-full relative"
        >
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0 relative">
            <input
              type="email"
              name="email"
              placeholder="YOUR@EMAIL.COM"
              disabled={pending}
              required
              className={`bg-[#111] border-2 ${
                error
                  ? "border-red-500 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  : "border-[#333] focus:border-[#75C043] focus:shadow-[0_0_15px_rgba(117,192,67,0.3)]"
              } text-white rounded sm:rounded-r-none px-4 py-3 focus:outline-none font-mono text-xs w-full sm:w-64 transition-all placeholder:text-gray-600 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <button
              type="submit"
              disabled={pending}
              className="bg-[#75C043] hover:bg-[#86d950] disabled:bg-[#75C043]/50 text-ugle-slate font-mono text-xs font-bold px-8 py-3 rounded sm:rounded-l-none transition-all shadow-[0_0_15px_rgba(117,192,67,0.3)] w-full sm:w-auto whitespace-nowrap uppercase tracking-wider hover:shadow-[0_0_25px_rgba(117,192,67,0.6)] focus:outline-none focus:ring-2 focus:ring-[#75C043] focus:ring-offset-2 focus:ring-offset-[#1C1C1C] disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                "Join"
              )}
            </button>
          </div>

          {/* Invisible/managed Turnstile widget — no name attr needed,
              the library injects a hidden input called cf-turnstile-response */}
          <div className="mt-2">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              options={{
                size: "invisible",
                appearance: "interaction-only",
              }}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute -bottom-7 left-0 font-mono text-[10px] text-red-500 uppercase tracking-widest font-semibold text-left w-full"
              >
                {error}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
