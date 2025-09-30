import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Images
import FE_IMG from "../images/frontend.png";
import BE_IMG from "../images/backend.png";
import AI_IMG from "../images/AI.png";
import UX_IMG from "../images/figma.png";
import PROFILE_IMG from "../images/profile.png";

/* ----------------- small utils ----------------- */
const r = (n) => Math.round(n);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, t) => a + (b - a) * t;
const tRange = (vw, lo, hi) => clamp01((vw - lo) / (hi - lo));

function useViewport() {
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1920);
  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return vw;
}

/* ----------------- sizing (fluid in bands) ----------------- */
function getConfig(vw) {
  if (vw >= 1920) {
    return {
      L: { w: 490, h: 653 },
      M: { w: 392, h: 522 },
      S: { w: 343, h: 457 },
      type: { w: 692, h: 237, fs: 40, lh: 48 },
      visibleOuter: true,
    };
  }
  if (vw >= 1440) {
    const s = Math.max(0.001, vw / 1919);
    return {
      L: { w: r(420 * s), h: r(560 * s) },
      M: { w: r(336 * s), h: r(448 * s) },
      S: { w: r(294 * s), h: r(392 * s) },
      type: { w: r(772 * s), h: r(238 * s), fs: r(36 * s), lh: r(44 * s) },
      visibleOuter: true,
    };
  }
  if (vw >= 1280) {
    const s = Math.max(0.001, vw / 1439);
    return {
      L: { w: r(360 * s), h: r(480 * s) },
      M: { w: r(288 * s), h: r(384 * s) },
      S: { w: r(252 * s), h: r(336 * s) },
      type: { w: r(526 * s), h: r(191 * s), fs: r(32 * s), lh: r(40 * s) },
      visibleOuter: true,
    };
  }
  if (vw >= 960) {
    const s = Math.max(0.001, vw / 1279);
    return {
      L: { w: r(360 * s), h: r(480 * s) },
      M: { w: r(288 * s), h: r(384 * s) },
      S: { w: r(252 * s), h: r(336 * s) },
      type: { w: r(500 * s), h: r(185 * s), fs: r(30 * s), lh: r(38 * s) },
      visibleOuter: true, // 5 cards at ≥960
    };
  }
  if (vw >= 560) {
    // 560 → 959 fluid 3-card
    const t = tRange(vw, 560, 959); // 0 @560 → 1 @959
    const Lw = r(lerp(487, 400, t));
    const Lh = r(lerp(650, 533, t));
    const Mw = r(lerp(390, 320, t));
    const Mh = r(lerp(520, 427, t));
    const typeW = r(lerp(503, 406, t));
    const typeH = 172;
    const fs = r(lerp(34, 28, t));
    const lh = r(lerp(42, 36, t));
    return {
      L: { w: Lw, h: Lh },
      M: { w: Mw, h: Mh },
      S: { w: 0, h: 0 },
      type: { w: typeW, h: typeH, fs, lh },
      visibleOuter: false,
    };
  }
  // <560 fluid from 560 anchor
  const s = Math.max(0.001, vw / 560);
  return {
    L: { w: r(487 * s), h: r(650 * s) },
    M: { w: r(390 * s), h: r(520 * s) },
    S: { w: 0, h: 0 },
    type: { w: r(503 * s), h: r(172 * s), fs: r(34 * s), lh: r(42 * s) },
    visibleOuter: false,
  };
}

/* Typing/controls band offset (rem → px) */
const getBottomOffsetPx = (vw) => {
  if (vw >= 1440) return 8.9375 * 16;
  if (vw >= 960) return 6.6875 * 16;
  return 3 * 16;
};

/* ----------------- autoplay + progress ring ----------------- */
function useAutoRotate({ running, durationMs, onTick }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const accumRef = useRef(0);
  const onTickRef = useRef(onTick);

  useEffect(() => { onTickRef.current = onTick; }, [onTick]);

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }
    const loop = (ts) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      // accumulate time and emit at most one tick per frame
      let acc = accumRef.current + dt;
      if (acc >= durationMs) {
        // carry remainder forward
        acc = acc - durationMs;
        accumRef.current = acc;
        setProgress(acc / durationMs);
        if (typeof onTickRef.current === 'function') onTickRef.current();
      } else {
        accumRef.current = acc;
        setProgress(acc / durationMs);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [running, durationMs]);

  const reset = () => { accumRef.current = 0; setProgress(0); };
  return { elapsed: progress * durationMs, reset };
}

/* ===================== Main ===================== */
export default function Landing() {
  const vw = useViewport();
  const cfg = getConfig(vw);

  // carousel position (0..4)
  const [shift, setShift] = useState(0);
  const [centerId, setCenterId] = useState("profile");

  // calm copy per card (2 lines each)
const copy = useMemo(
  () => ({
    profile: {
      text: "I build end-to-end products with 4+ years of experience.",
      cta: "About me", to: "/about",
    },
    ai: {
      text: "I use intelligence quietly, saving time without stealing attention.",
      cta: "Explore", to: "/ai",
    },
    ux: {
      text: "I design what feels obvious, respectful, and beautifully simple.",
      cta: "Case Studies", to: "/ux",
    },
    fe: {
      text: "I craft interfaces that load fast and stay delightfully smooth.",
      cta: "See work", to: "/frontend",
    },
    be: {
      text: "I build clean APIs and dependable data pipelines that scale.",
      cta: "See work", to: "/backend",
    },
  }),
  []
);

  const current = copy[centerId] ?? copy.profile;

  /* autoplay + ring */
  const [running, setRunning] = useState(true);
  const durationMs = 10000; // <- 10s highlight duration
  const onTick = useCallback(() => setShift((s) => (s + 1) % 5), []);
  const { elapsed, reset } = useAutoRotate({ running, durationMs, onTick });
  const progress = clamp01(elapsed / durationMs);

  const next = () => { setShift((s) => (s + 1) % 5); reset(); };
  const prev = () => { setShift((s) => (s + 4) % 5); reset(); };

  // keyboard access
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.code === "Space") setRunning((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // height of the highlighted (center) card only
  const trackHeight = cfg.L.h;
  const bottomOffset = 0;

  return (
    <main className="pt-16 ">{/* clears 64px navbar */}
      <section className="cards-wrap relative mx-auto w-screen isolate">
        <div>
          <Carousel5
            vw={vw}
            cfg={cfg}
            shift={shift}
            onCenterChange={setCenterId}
            trackHeight={trackHeight}
            bottomOffset={bottomOffset}
          />

          {/* Typing + Controls */}
          <div className="type-wrap z-[60]">
            <div className="relative pointer-events-none" style={{ width: cfg.type.w }}>
              <HeroTypingCard text={current.text} cta={current.cta} to={current.to} type={cfg.type} />
            </div>
          </div>
          <Controls
            onPrev={prev}
            onNext={next}
            running={running}
            onToggle={() => setRunning((v) => !v)}
            progress={progress}
          />
        </div>
      </section>
    </main>
  );
}
function usePrevious(value) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
/* ===================== Carousel ===================== */
function Carousel5({ vw, cfg, shift, onCenterChange, trackHeight }) {
  const cards = useMemo(
    () => [
      { id: "fe", src: FE_IMG, alt: "Front-end" },
      { id: "ai", src: AI_IMG, alt: "AI Engineer" },
      { id: "profile", src: PROFILE_IMG, alt: "Profile" },
      { id: "ux", src: UX_IMG, alt: "UX Designer" },
      { id: "be", src: BE_IMG, alt: "Back-end" },
    ],
    []
  );

  const GAP = 23;
  const centerX = vw / 2;
  const centerLeft = centerX - cfg.L.w / 2;

  const vCenter = (h) => Math.round((trackHeight - h) / 2);

  const slots = [
    {
      w: cfg.visibleOuter ? cfg.S.w : 0,
      h: cfg.visibleOuter ? cfg.S.h : 0,
      left: cfg.visibleOuter
        ? centerLeft - GAP - cfg.M.w - GAP - cfg.S.w
        : centerLeft - GAP - cfg.M.w - GAP - (cfg.S.w || 0) - 200,
      top: vCenter(cfg.visibleOuter ? cfg.S.h : cfg.M.h),
      z: 10, opacity: cfg.visibleOuter ? 1 : 0,
      shadow: "0 12px 40px -10px rgba(0,0,0,0.18)",
    },
    { w: cfg.M.w, h: cfg.M.h, left: centerLeft - GAP - cfg.M.w, top: vCenter(cfg.M.h), z: 20, opacity: 1, shadow: "0 16px 50px -10px rgba(0,0,0,0.2)" },
    { w: cfg.L.w, h: cfg.L.h, left: centerLeft,                  top: vCenter(cfg.L.h), z: 40, opacity: 1, shadow: "0 24px 70px -12px rgba(0,0,0,0.26)" },
    { w: cfg.M.w, h: cfg.M.h, left: centerLeft + cfg.L.w + GAP,  top: vCenter(cfg.M.h), z: 20, opacity: 1, shadow: "0 16px 50px -10px rgba(0,0,0,0.2)" },
    {
      w: cfg.visibleOuter ? cfg.S.w : 0,
      h: cfg.visibleOuter ? cfg.S.h : 0,
      left: cfg.visibleOuter
        ? centerLeft + cfg.L.w + GAP + cfg.M.w + GAP
        : centerLeft + cfg.L.w + GAP + cfg.M.w + GAP + 200,
      top: vCenter(cfg.visibleOuter ? cfg.S.h : cfg.M.h),
      z: 10, opacity: cfg.visibleOuter ? 1 : 0,
      shadow: "0 12px 40px -10px rgba(0,0,0,0.18)",
    },
  ];

  // map "card index → slot index" for a given shift
  const slotIdx = (i, s) => (i + 2 - (s % 5) + 5) % 5;

  // <<< the important part
  const prevShift = usePrevious(shift) ?? shift;

  useEffect(() => {
    const centerIdx = cards.findIndex((_, i) => slotIdx(i, shift) === 2);
    if (centerIdx !== -1) onCenterChange?.(cards[centerIdx].id);
  }, [shift, cards, onCenterChange]);

  return (
    <div className="relative mx-auto" style={{ height: trackHeight }}>
      {cards.map((card, i) => {
        const prevIdx = slotIdx(i, prevShift);   // where it was last frame
        const nextIdx = slotIdx(i, shift);       // where it should be now

        const prevSlot = slots[prevIdx];
        const nextSlot = slots[nextIdx];

        // Wrap rules depend ONLY on slot movement, not on which button you pressed:
        // Next (anti-clockwise): 0 -> 4  (spawn off-right)
        // Prev (clockwise)     : 4 -> 0  (spawn off-left)
        const wrapFromLeftToRight = (prevIdx === 0 && nextIdx === 4);
        const wrapFromRightToLeft = (prevIdx === 4 && nextIdx === 0);

        // next-slot–relative offscreen spawn (robust even when S=0)
        const nextW = nextSlot.w || cfg.M.w || cfg.L.w;
        const offRight = nextSlot.left + nextW + GAP + 60;
        const offLeft  = nextSlot.left - nextW - GAP - 60;

        const targetOpacity = nextSlot.opacity ?? 1;

        return (
          <motion.div
            key={`${card.id}-${shift}`}
            className="absolute rounded-2xl overflow-hidden bg-white border border-black/5"
            style={{
              zIndex: nextSlot.z,
              boxShadow: nextSlot.shadow,
              pointerEvents: targetOpacity ? "auto" : "none",
              transform: "translateZ(0)",
            }}
            initial={{
              left: wrapFromLeftToRight ? offRight
                   : wrapFromRightToLeft ? offLeft
                   : prevSlot.left,
              top:   (wrapFromLeftToRight || wrapFromRightToLeft) ? nextSlot.top   : prevSlot.top,
              width: (wrapFromLeftToRight || wrapFromRightToLeft) ? nextSlot.w     : prevSlot.w,
              height:(wrapFromLeftToRight || wrapFromRightToLeft) ? nextSlot.h     : prevSlot.h,
              opacity: prevSlot.opacity ?? 1,
            }}
            animate={{
              left: nextSlot.left,
              top: nextSlot.top,
              width: nextSlot.w,
              height: nextSlot.h,
              opacity: targetOpacity,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.6 }}
          >
            <img
              src={card.src}
              alt={card.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ===================== Typing Card ===================== */
function HeroTypingCard({ text, cta, to, type }) {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_60px_-10px_rgba(0,0,0,0.25)] pointer-events-auto"
      style={{ width: type.w, height: type.h }}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 pt-6">
          <h2
            className="font-semibold tracking-tight whitespace-pre-line"
            style={{ fontSize: `${type.fs}px`, lineHeight: `${type.lh}px` }}
          >
            <TypingText text={text} speed={90} punctPause={500} startDelay={300} lineHeightPx={type.lh} />
          </h2>
        </div>
        <div className=" px-6 pb-6 pt-4 flex justify-end">
          <button
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition"
            onClick={() => to && navigate(to)}
          >
            {cta || "Know more"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TypingText({ text, speed = 80, punctPause = 450, startDelay = 300, lineHeightPx = 48 }) {
  const [sub, setSub] = useState(0);
  const [blink, setBlink] = useState(true);

  useEffect(() => { setSub(0); setBlink(true); }, [text]);

  useEffect(() => {
    if (!text || sub >= text.length) return;
    const charJustTyped = sub > 0 ? text[sub - 1] : "";
    const isPunct = /[.,!?;:]/.test(charJustTyped);
    const delay = sub === 0 ? startDelay : isPunct ? punctPause : speed;
    const t = setTimeout(() => setSub((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [sub, text, speed, punctPause, startDelay]);

  useEffect(() => {
    if (!text || sub >= text.length) return;
    const t = setInterval(() => setBlink((b) => !b), 500);
    return () => clearInterval(t);
  }, [sub, text]);

  const done = sub >= (text?.length ?? 0);

  return (
    <span>
      {text?.slice(0, sub) ?? ""}
      {!done && (
        <span
          className={`inline-block w-0.5 ml-0.5 align-middle ${blink ? "bg-neutral-900" : "bg-transparent"}`}
          style={{ height: `${lineHeightPx}px` }}
        />
      )}
    </span>
  );
}

/* ===================== Controls (Prev / TimerRing / Next) ===================== */
function Controls({ onPrev, onNext, running, onToggle, progress }) {
  // Timer ring
  const size = 40;
  const stroke = 3;
  const rCircle = (size - stroke) / 2;
  const C = 2 * Math.PI * rCircle;
  const dash = C;
  const offset = C * (1 - progress);

  // Figma-like: responsive row below the carousel, centered on small, right-aligned ≥960px
  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-center gap-3 mt-[6.8125rem] sm:mt-[4.3125rem] md:mt-4 lg:mt-0 lg:justify-end">
      {/* Prev */}
      <button
        aria-label="Previous"
        onClick={onPrev}
        className="h-10 w-10 rounded-full border border-black/10 bg-white shadow-sm grid place-items-center hover:bg-neutral-50 active:scale-95 transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Play/Pause + progress ring */}
      <button
        aria-label={running ? "Pause" : "Play"}
        onClick={onToggle}
        className="relative h-10 w-10 rounded-full grid place-items-center bg-white border border-black/10 shadow-sm hover:bg-neutral-50 active:scale-95 transition"
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
          <circle cx={size / 2} cy={size / 2} r={rCircle} stroke="rgba(0,0,0,0.12)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={rCircle}
            stroke="currentColor" strokeWidth={stroke} fill="none"
            strokeDasharray={dash} strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 80ms linear" }}
          />
        </svg>
        {running ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M8 5l11 7-11 7V5z" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        aria-label="Next"
        onClick={onNext}
        className="h-10 w-10 rounded-full border border-black/10 bg-white shadow-sm grid place-items-center hover:bg-neutral-50 active:scale-95 transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
