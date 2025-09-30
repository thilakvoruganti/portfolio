import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(
    () => [
      { label: "Resume", onClick: () => { navigate("/Resume"); close(); } },
      { label: "LN", onClick: () => window.open("https://www.linkedin.com/in/thilak-voruganti/", "_blank", "noreferrer") },
      { label: "GM", onClick: () => (window.location.href = "mailto:thilakvoruganti@gmail.com") },
    ],
    [navigate]
  );

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[120rem] items-center justify-between px-6 py-4">
        <button
          className="shrink-0"
          aria-label="Go home"
          onClick={() => {
            navigate("/");
            scrollTop();
            close();
          }}
        >
          <svg className="h-[30px] w-[50px]" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0.000366211L0 7.50037L7.63483 0.000366211L0 0.000366211Z" fill="#000" />
            <rect x="7.63477" width="11.4522" height="30" fill="#000" />
            <path d="M49.6266 0H34.3569L41.9918 15L49.6266 0Z" fill="#000" />
            <path d="M33.3472 0H19.0869L34.0978 30L41.2279 15.75L33.3472 0Z" fill="#000" />
          </svg>
        </button>

        <div className="relative flex items-center">
          <div
            className={`flex items-center overflow-hidden transition-[width] duration-300 ease-out ${open ? "w-[140px] sm:w-[180px]" : "w-0"}`}
          >
            {items.map((item, idx) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`ml-4 text-sm font-medium tracking-tight text-neutral-900 transition-all duration-200 ${
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0 pointer-events-none"
                }`}
                style={{ transitionDelay: `${open ? idx * 70 : 0}ms` }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={toggle}
            className="relative flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`absolute left-1/2 h-0.5 w-6 -translate-x-1/2 bg-neutral-900 transition-transform duration-300 ${
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute left-1/2 h-0.5 w-6 -translate-x-1/2 bg-neutral-900 transition-transform duration-300 ${
                open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
