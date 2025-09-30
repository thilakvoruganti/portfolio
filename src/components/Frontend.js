import React, { useEffect, useRef, useState } from "react";

/**
 * FrontendLanding — hero + metrics + console, then Skills and Experience sections.
 * - Hero matches reference
 * - Console prints one line at a time (once)
 * - Skills uses your provided image on the right
 * - Experience shows company logo + 300×100 cropped world map centered on location
 */

// ---------------------------------------------------------------------------
// Demo Navbar (kept minimal; replace with your router Navbar when integrating)


// ---------------------------------------------------------------------------
function Metric({ label, value, divider }) {
  return (
    <div className="flex items-center gap-2 text-slate-200/90">
      <span className="font-medium">{label}</span>
      <span className="font-semibold text-white">{value}</span>
      {divider && <span className="mx-3 h-5 w-px bg-white/15" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fn = () => setReduced(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

// Console — prints one line at a time on load (once)
function ConsoleCard() {
  const lines = [
    "Hey! I’m Thilak, a Front-end Engineer crafting fast, accessible, and scalable web experiences. Over the past 5+ years, I’ve built responsive UIs with React, Angular, and modern frameworks, turning complex ideas into pixel-perfect products.",
    "LINK:Resume ↗",
    "LINK:LinkedIn ↗",
    "LINK:Gmail ↗",
  ];
  const prefersReduced = usePrefersReducedMotion();
  const printedIdx = useRef(prefersReduced ? lines.length : 0);
  const [visibleCount, setVisibleCount] = useState(printedIdx.current);

  useEffect(() => {
    if (prefersReduced) return;
    let to;
    const step = () => {
      if (printedIdx.current < lines.length) {
        printedIdx.current += 1;
        setVisibleCount(printedIdx.current);
        to = window.setTimeout(step, 420);
      }
    };
    to = window.setTimeout(step, 240);
    return () => to && window.clearTimeout(to);
  }, [prefersReduced]);

  return (
    <div className="rounded-2xl border border-white/12 bg-[#1A2032] shadow-[0_10px_24px_rgba(0,0,0,.35)] overflow-hidden">
      {/* Header chrome */}
      <div className="flex items-center justify-between h-11 px-4 border-b border-white/12 bg-white/5">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="inline-block w-4 h-4 rounded border border-white/20" />
          <span className="inline-block w-4 h-4 rounded border border-white/20" />
          <div className="relative">
            <span className="text-sm text-[#9EB8FF]">Console</span>
            <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#9EB8FF]" />
          </div>
        </div>
        <div className="text-slate-400 pr-3">»</div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 text-[14px] leading-6 text-slate-200 text-left">
        {lines.slice(0, visibleCount).map((l, i) => {
          const isLink = l.startsWith("LINK:");
          const label = isLink ? l.replace("LINK:", "") : l;
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#8FB2FF]">›</span>
              {isLink ? (
                <a
                  href="/assets/Thilak_Voruganti_Resume.pdf"
                  className="text-slate-200 hover:text-white underline underline-offset-4"
                >
                  {label}
                </a>
              ) : (
                <p className="flex-1 whitespace-pre-wrap">{label}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skills graphic (right side) — uses the provided image instead of programmatic bubbles
function SkillsGraphic({ src = "/assets/skills-bubble.png" }) {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <img
        src={require("../images/skills-bubble.png")}
        alt="Skills bubble graphic"
        className="w-full h-auto select-none pointer-events-none drop-shadow-[0_8px_24px_rgba(0,0,0,.35)]"
      />
    </div>
  );
}

function SkillsSection() {
  return (
    <section className="mx-auto w-[92%] max-w-[1100px] pt-20 pb-24">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left list */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Skills</h2>
          <ul className="space-y-4 text-2xl font-semibold text-[#9FB0F8]">
            {["Frameworks", "Languages", "Styling", "Tools"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-left">
                <span className="text-[#8FB2FF]">›</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Right graphic (provided image) */}
        <div className="md:pl-6">
          <SkillsGraphic />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Experience — two-column console layout (matches mock)

const JOBS = [
  {
    id: "tcs",
    title: "Assistant System Engineer",
    timeframe: "Feb 2021 – Feb 2022",
    org: "Tata Consultancy Services",
    location: "Gujarat, India",
    coords: { lat: 22.2587, lon: 71.1924 }, // for the map crop
    skills: ["React", "Redux", "Bootstrap"],
    intro:
      "Hey! I’m Thilak, a Front-end Engineer crafting fast, accessible, and scalable web experiences. Over the past 5+ years, I’ve built responsive UIs with React, Angular, and modern frameworks, turning complex ideas into pixel-perfect products.",
    bullets: [
      "React, Angular, and modern frameworks, turning complex ideas",
      "React, Angular, and modern frameworks, turning complex ideas",
      "React, Angular, and modern frameworks, turning complex ideas",
    ],
  },
  {
    id: "icube",
    title: "Software Engineer",
    timeframe: "Mar 2022 – Dec 2023",
    org: "iCube Solutions",
    location: "Remote",
    coords: { lat: 0, lon: 0 },
    skills: ["React", "Node", "MongoDB"],
    intro:
      "Built performant UI and APIs; optimized caching and auth with JWT.",
    bullets: [
      "Optimized data-fetch and caching for bookings",
      "Implemented secure authentication and session",
      "Improved Lighthouse on key flows",
    ],
  },
  {
    id: "gsu",
    title: "Graduate Research Assistant",
    timeframe: "Jan 2024 – Present",
    org: "Georgia State University",
    location: "Atlanta, GA",
    coords: { lat: 33.749, lon: -84.388 },
    skills: ["Research", "Teaching", "Mentoring"],
    intro:
      "Leading research initiatives and TA support while pursuing MS in CS.",
    bullets: [
      "Published papers; mentored programming labs",
      "Assisted in curriculum & research tooling",
    ],
  },
];

function Chip({ children }) {
  return (
    <span className="inline-flex items-center h-7 px-3 rounded-full border border-white/12 bg-white/[0.03] text-slate-200 text-sm shadow-[0_1px_0_rgba(255,255,255,.05)_inset]">
      {children}
    </span>
  );
}

function IconPlus() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-slate-300"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white"
    >
      <path
        d="M12 21s-6-5.2-6-10a6 6 0 1112 0c0 4.8-6 10-6 10z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="12" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}

// Utility: clamp
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

// Convert lon/lat → pixel on an equirectangular map of size (w,h)
function lonLatToXY(lon, lat, w, h) {
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

// World map cropper: shows a 300×100 viewport centered on the job's location
function MapCrop({ src, lat, lon, viewW = 300, viewH = 100 }) {
  const imgRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const onLoad = () => {
      const w = img.naturalWidth || img.width || 0;
      const h = img.naturalHeight || img.height || 0;
      setDims({ w, h });
    };

    if (img.complete) onLoad();
    else img.addEventListener("load", onLoad, { once: true });

    return () => img && img.removeEventListener("load", onLoad);
  }, []);

  let style;
  if (dims.w && dims.h) {
    const { x, y } = lonLatToXY(lon, lat, dims.w, dims.h);
    const left = clamp(x - viewW / 2, 0, Math.max(0, dims.w - viewW));
    const top = clamp(y - viewH / 2, 0, Math.max(0, dims.h - viewH));
    style = {
      position: "absolute",
      left: `-${left}px`,
      top: `-${top}px`,
      width: `${dims.w}px`,
      height: `${dims.h}px`,
    };
  }

  return (
    <div className="relative w-[300px] h-[100px] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <img
        ref={imgRef}
        src={src}
        alt="world map"
        className="select-none pointer-events-none"
        style={style}
      />
      {/* center pin */}
      <div className="absolute inset-0 grid place-items-center">
        <IconPin />
      </div>
    </div>
  );
}

function ExperienceSection() {
  const primary = JOBS[0];

  return (
    <section className="mx-auto w-[92%] max-w-[1100px] pt-12 pb-24">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#12192A] shadow-[0_10px_24px_rgba(0,0,0,.35)]">
        {/* Header bar */}
        <div className="flex items-center justify-between h-12 px-5 border-b border-white/12 bg-white/5">
          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 rounded border border-white/25" />
              <span className="inline-block w-4 h-4 rounded border border-white/25" />
            </div>
            <div className="relative">
              <span className="text-[#9EB8FF] text-[15px] font-medium">
                Experience
              </span>
              <span className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#9EB8FF]" />
            </div>
          </div>
          <div className="text-slate-300">»</div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-10 p-6">
          {/* Left column */}
          <div>
            <div className="flex items-center gap-3 mb-4 text-slate-300/80">
              <div className="grid gap-2">
                <button className="h-8 w-8 rounded-full border border-white/15 grid place-items-center hover:bg-white/5">
                  ⌃
                </button>
                <button className="h-8 w-8 rounded-full border border-white/15 grid place-items-center hover:bg-white/5">
                  ⌄
                </button>
              </div>
              <div className="flex-1 rounded-2xl border border-white/12 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                <h3 className="text-white font-semibold text-[18px] mb-3">
                  {primary.title}
                </h3>
                <div className="rounded-2xl border border-white/10 bg-[#101726] p-4">
                  <div className="flex items-start gap-2 text-slate-200">
                    <span className="text-[#8FB2FF]">›</span>
                    <p className="leading-6">{primary.intro}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 max-w-[520px]">
              <button className="w-full flex items-center justify-between rounded-full bg-white/[0.03] border border-white/10 px-5 py-3 text-slate-200 hover:bg-white/5 transition">
                <span className="inline-flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25">
                    <IconPlus />
                  </span>
                  Software Engineer
                </span>
                <span className="text-slate-400">›</span>
              </button>
              <button className="w-full flex items-center justify-between rounded-full bg-white/[0.03] border border-white/10 px-5 py-3 text-slate-200 hover:bg-white/5 transition">
                <span className="inline-flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25">
                    <IconPlus />
                  </span>
                  Graduate Research Assistant
                </span>
                <span className="text-slate-400">›</span>
              </button>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="text-white text-xl font-medium mb-4">
              {primary.timeframe}
            </div>

            <div className="flex items-center gap-3 mb-5">
              {/* Prefer local logo to avoid CORS: /assets/logos/tcs.svg */}
              <img
                src={require("../images/tcs.png")}
                alt="TCS"
                className="h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/assets/logos/tcs.png";
                }}
              />
            </div>

            {/* 300×100 cropped world map centered on location */}
            <div className="mb-6">
              <MapCrop
                src={require("../images/world.png")}
                lat={primary.coords.lat}
                lon={primary.coords.lon}
              />
              <div className="mt-2 flex items-center gap-2 text-white">
                <IconPin />
                <span className="text-slate-200">{primary.location}</span>
              </div>
            </div>

            <div className="mb-5">
              <div className="text-white font-semibold mb-2">Skills</div>
              <div className="flex flex-wrap gap-2">
                {primary.skills.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>

            <div className="mb-2">
              <div className="text-white font-semibold mb-2">
                Key Responsibilities
              </div>
              <ul className="space-y-2 text-slate-300">
                {primary.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export default function Frontend() {
  return (
    <div className="min-h-[100dvh] bg-[#0F1422] text-slate-100">

      <main className="mx-auto w-[92%] max-w-[1100px] pt-28 pb-24">
        <section className="text-center">
          <h1 className="text-[56px] md:text-[64px] lg:text-[72px] font-semibold tracking-[-0.02em] text-[#A5B4FC]">
            Design. Build. Repeat
          </h1>
          <p className="mt-3 text-slate-300/95 text-[16px] sm:text-[18px] leading-7 max-w-3xl mx-auto">
            I craft fast, accessible UIs with React, Angular & modern tooling.
          </p>

          <div className="mt-4 flex items-center justify-center">
            <Metric label="Projects" value="10+" divider />
            <Metric label="Lighthouse" value="10+" divider />
            <Metric label="Users" value="1M+" />
          </div>

          <div className="mt-6 max-w-[980px] mx-auto">
            <ConsoleCard />
          </div>
        </section>
      </main>

      {/* Skills Section */}
      <SkillsSection />

      {/* Experience Section */}
      <ExperienceSection />
    </div>
  );
}