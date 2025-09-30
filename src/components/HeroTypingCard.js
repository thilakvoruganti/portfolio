import { useEffect, useMemo, useState } from "react";

export default function HeroTypingCard({ top = 540 }) {
    const lines = useMemo(
        () => [
            "Hi, I am Thilak, Full stack",
            "Engineer with 5+ years’ impact",
        ],
        []
    );

    return (
        <div
            className="absolute left-1/2 -translate-x-1/2 z-50"
            style={{ top: `${top}px` }}  // the card starts exactly 540px from the top
        >
            <div className="w-[620px] rounded-2xl border border-neutral-200 bg-white shadow-[0_18px_60px_-10px_rgba(0,0,0,0.25)]">
                <div className="px-6 pt-6">
                    <h2 className="text-[22px] sm:text-[24px] font-semibold leading-snug tracking-tight">
                        <TypingHeadline lines={lines} />
                    </h2>
                </div>
                <div className="px-6 pb-6 pt-4 flex justify-end">
                    <button className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition">
                        Know more
                    </button>
                </div>
            </div>
        </div>
    );
}

function TypingHeadline({ lines }) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [blink, setBlink] = useState(true);

    useEffect(() => {
        if (!lines?.length) return;
        const current = lines[index];

        if (!deleting && subIndex === current.length) {
            const t = setTimeout(() => setDeleting(true), 1300);
            return () => clearTimeout(t);
        }
        if (deleting && subIndex === 0) {
            setDeleting(false);
            setIndex((i) => (i + 1) % lines.length);
            return;
        }

        const t = setTimeout(
            () => setSubIndex((v) => v + (deleting ? -1 : 1)),
            deleting ? 22 : 36
        );
        return () => clearTimeout(t);
    }, [subIndex, deleting, index, lines]);

    useEffect(() => {
        const t = setInterval(() => setBlink((b) => !b), 500);
        return () => clearInterval(t);
    }, []);

    const rendered = `${lines[index]?.slice(0, subIndex) ?? ""}`;
    return (
        <span>
            {rendered}
            <span
                className={`inline-block w-0.5 ml-0.5 h-6 align-middle ${blink ? "bg-neutral-900" : "bg-transparent"
                    }`}
            />
        </span>
    );
}
