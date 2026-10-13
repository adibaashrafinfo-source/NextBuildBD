import { useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent } from "react";
import { Check, Loader2, Play, Rocket } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Script data                                                         */
/* ------------------------------------------------------------------ */

type Token = { t: string; c: string };
const C = {
  prompt: "text-[#E8916F]",
  text: "text-[#F4F5FF]",
  kw: "text-[#C792EA]",
  fn: "text-[#82AAFF]",
  str: "text-[#C3E88D]",
  tag: "text-[#FFCB6B]",
  attr: "text-[#7FDBCA]",
  plain: "text-[#D6DEEB]",
};

const LINES: Token[][] = [
  [
    { t: "❯ ", c: C.prompt },
    { t: "Build a SaaS dashboard with Supabase auth", c: C.text },
  ],
  [
    { t: "const ", c: C.kw },
    { t: "{ data } ", c: C.plain },
    { t: "= await ", c: C.kw },
    { t: "supabase", c: C.fn },
  ],
  [
    { t: "  .from(", c: C.plain },
    { t: '"orders"', c: C.str },
    { t: ")", c: C.plain },
  ],
  [
    { t: "  .select(", c: C.plain },
    { t: '"month, total"', c: C.str },
    { t: ");", c: C.plain },
  ],
  [
    { t: "return ", c: C.kw },
    { t: "<", c: C.plain },
    { t: "SalesChart ", c: C.tag },
    { t: "data", c: C.attr },
    { t: "={data} />", c: C.plain },
  ],
];
const TOTAL_CHARS = LINES.flat().reduce((n, tk) => n + tk.t.length, 0);

const TABS = ["Overview", "Revenue", "Users"] as const;
const DATA = [
  { bars: [38, 52, 46, 64, 58, 76, 88], stats: [1284, 846, 24] },
  { bars: [30, 44, 60, 52, 70, 82, 95], stats: [1932, 1210, 31] },
  { bars: [50, 46, 58, 62, 66, 72, 80], stats: [2046, 1388, 18] },
];
const STAT_LABELS = ["Orders", "Users", "Growth"];

type Target = "run" | "tab1" | "tab2" | "deploy" | "rest";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function HeroShowcase() {
  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Typing ticks every ~30ms; only the editor re-renders (not the whole showcase).
  const setTypedRef = useRef<(n: number) => void>(() => {});
  const setTyped = (n: number) => setTypedRef.current(n);
  const [build, setBuild] = useState<"idle" | "building" | "done">(reduce ? "done" : "idle");
  const [tab, setTab] = useState(0);
  const [deploy, setDeploy] = useState<"idle" | "deploying" | "live">(reduce ? "live" : "idle");
  const [pressed, setPressed] = useState<Target | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, clicking: false });

  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const refs = {
    run: useRef<HTMLSpanElement>(null),
    tab1: useRef<HTMLSpanElement>(null),
    tab2: useRef<HTMLSpanElement>(null),
    deploy: useRef<HTMLSpanElement>(null),
    rest: useRef<HTMLSpanElement>(null),
  };
  const visibleRef = useRef(false);

  // Animation timeline. Pauses while off-screen or in a background tab.
  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const root = rootRef.current!;
    const io = new IntersectionObserver(([e]) => (visibleRef.current = e.isIntersecting), { threshold: 0.15 });
    io.observe(root);

    const wait = async (ms: number) => {
      const end = performance.now() + ms;
      while (!cancelled && performance.now() < end) await sleep(Math.min(120, end - performance.now()));
      while (!cancelled && (!visibleRef.current || document.hidden)) await sleep(250);
      if (cancelled) throw new Error("cancelled");
    };
    const moveTo = async (t: Target, ms = 750) => {
      const el = refs[t].current;
      if (!el) return;
      const a = root.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      setCursor((c) => ({ ...c, visible: true, x: b.left - a.left + b.width / 2, y: b.top - a.top + b.height / 2 }));
      await wait(ms);
    };
    const click = async (t: Target) => {
      setCursor((c) => ({ ...c, clicking: true }));
      setPressed(t);
      await wait(180);
      setCursor((c) => ({ ...c, clicking: false }));
      setPressed(null);
    };

    // Start once the page has loaded and the main thread is idle, so the demo never competes with first paint.
    const ready = new Promise<void>((resolve) => {
      const idle = () =>
        "requestIdleCallback" in window
          ? window.requestIdleCallback(() => setTimeout(resolve, 1500), { timeout: 3000 })
          : setTimeout(resolve, 2500);
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    });

    (async () => {
      try {
        await ready;
        while (!cancelled) {
          setTyped(0);
          setBuild("idle");
          setTab(0);
          setDeploy("idle");
          await moveTo("rest", 10);
          await wait(500);

          for (let n = 0; n <= TOTAL_CHARS; n += 2) {
            setTyped(n);
            await wait(n < LINES[0].reduce((s, tk) => s + tk.t.length, 0) ? 34 : 26);
          }
          setTyped(TOTAL_CHARS);

          await moveTo("run");
          await click("run");
          setBuild("building");
          await wait(1100);
          setBuild("done");
          await wait(1500);

          await moveTo("tab1");
          await click("tab1");
          setTab(1);
          await wait(1700);

          await moveTo("tab2");
          await click("tab2");
          setTab(2);
          await wait(1600);

          await moveTo("deploy");
          await click("deploy");
          setDeploy("deploying");
          await wait(1200);
          setDeploy("live");
          await moveTo("rest", 900);
          await wait(2600);
          setCursor((c) => ({ ...c, visible: false }));
          await wait(500);
        }
      } catch {
        /* cancelled */
      }
    })();

    return () => {
      cancelled = true;
      io.disconnect();
    };
    // refs are stable; run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // Gentle scroll parallax (desktop two-column layout only; stacked layouts would open a gap).
  useEffect(() => {
    if (reduce || !window.matchMedia("(min-width: 1024px)").matches) return;
    const root = rootRef.current!;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        root.style.transform = `translate3d(0, ${y * -0.06}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  // 3D tilt following a fine pointer (desktop only).
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !tiltRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltRef.current.style.transform = `perspective(1200px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
  };
  const onPointerLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  const data = DATA[tab];
  const built = build === "done";

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="অ্যানিমেটেড ডেমো: Claude Code-এ প্রম্পট লিখে Supabase দিয়ে একটি SaaS ড্যাশবোর্ড বানানো ও Vercel-এ ডিপ্লয় করা"
      className="relative select-none pb-2 will-change-transform"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-gradient-brand opacity-25 blur-3xl" />

      <div ref={tiltRef} aria-hidden className="relative transition-transform duration-300 ease-out [transform-style:preserve-3d]">
        {/* ---------------- Browser window ---------------- */}
        <div className="relative overflow-hidden rounded-3xl border border-[#2A3170] bg-[#0C1030] shadow-[0_30px_80px_-30px_rgba(79,70,255,.7)]">
          <div className="flex items-center gap-1.5 border-b border-[#1F2566] bg-[#11164A] px-3 py-2.5 sm:px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-[#050816] px-2.5 py-1 font-en text-[11px] text-[#A9AEDB]">
              {deploy === "live" ? "https://yoursaas.vercel.app" : "localhost:5173/dashboard"}
            </span>
            <span
              ref={refs.deploy}
              className={cn(
                "ml-1 inline-flex h-7 shrink-0 items-center gap-1 rounded-lg px-2.5 font-en text-[11px] font-bold text-white transition-all duration-200",
                deploy === "live" ? "bg-[#11843F]" : "bg-gradient-cta",
                pressed === "deploy" && "scale-90",
              )}
            >
              {deploy === "deploying" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : deploy === "live" ? (
                <Check className="h-3 w-3" />
              ) : (
                <Rocket className="h-3 w-3" />
              )}
              {deploy === "live" ? "Live" : "Deploy"}
            </span>
          </div>

          <div className="flex">
            {/* sidebar */}
            <div className="hidden w-[22%] flex-col gap-2.5 border-r border-[#1F2566] bg-[#080B24] p-3 min-[420px]:flex">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-md bg-gradient-brand" />
                <span className="h-2 w-10 rounded bg-[#F4F5FF]/70" />
              </div>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors duration-300",
                    i === tab ? "bg-[#1A2070]" : "",
                  )}
                >
                  <span className={cn("h-2.5 w-2.5 rounded-sm", i === tab ? "bg-[#7C8BFF]" : "bg-[#2A3170]")} />
                  <span className={cn("h-1.5 flex-1 rounded", i === tab ? "bg-[#7C8BFF]" : "bg-[#1F2566]")} />
                </div>
              ))}
            </div>

            {/* main */}
            <div className="relative flex min-w-0 flex-1 flex-col gap-2.5 p-3 pb-14 sm:p-4 sm:pb-20">
              <div className="flex items-center justify-between gap-2">
                <span className="font-en text-[13px] font-bold text-[#F4F5FF]">Dashboard</span>
                <div className="flex rounded-lg bg-[#050816] p-0.5">
                  {TABS.map((t, i) => (
                    <span
                      key={t}
                      ref={i === 1 ? refs.tab1 : i === 2 ? refs.tab2 : undefined}
                      className={cn(
                        "rounded-md px-2 py-1 font-en text-[10px] font-semibold transition-all duration-300 sm:text-[11px]",
                        i === tab ? "bg-[#4F46FF] text-white shadow" : "text-[#A9AEDB]",
                        pressed !== null && pressed === (i === 1 ? "tab1" : i === 2 ? "tab2" : "") && "scale-90",
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {STAT_LABELS.map((label, i) => (
                  <div key={label} className="rounded-xl border border-[#1F2566] bg-[#11164A] p-2">
                    <div className="font-en text-[9px] uppercase tracking-wide text-[#A9AEDB] sm:text-[10px]">{label}</div>
                    <div className="font-en text-sm font-extrabold text-[#F4F5FF] sm:text-base">
                      {built ? <CountUp value={data.stats[i]} suffix={i === 2 ? "%" : ""} prefix={i === 2 ? "+" : ""} /> : (
                        <span className="mt-1 block h-3 w-10 animate-pulse rounded bg-[#1F2566]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative h-32 rounded-xl border border-[#1F2566] bg-[#11164A] p-2.5 sm:h-36">
                <div className="flex h-full items-end gap-1.5 sm:gap-2">
                  {data.bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md transition-[height] duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)]"
                      style={{
                        height: built ? `${h}%` : "6%",
                        transitionDelay: `${i * 45}ms`,
                        background: i > 4 ? "linear-gradient(#A98CFF,#4F46FF)" : "linear-gradient(#7FA6FF,#4F46FF)",
                      }}
                    />
                  ))}
                </div>
                {built && (
                  <svg
                    key={tab}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-2.5 h-[calc(100%-20px)] w-[calc(100%-20px)] overflow-visible"
                  >
                    <path
                      d={linePath(data.bars)}
                      pathLength={1}
                      fill="none"
                      stroke="#34D399"
                      strokeWidth={2.5}
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="nb-draw"
                    />
                  </svg>
                )}
                {build === "building" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0C1030]/85">
                    <span className="font-en text-[11px] font-semibold text-[#A9AEDB]">Building your app…</span>
                    <span className="h-1.5 w-2/3 overflow-hidden rounded-full bg-[#1F2566]">
                      <span className="nb-progress block h-full rounded-full bg-gradient-brand" />
                    </span>
                  </div>
                )}
              </div>

              {/* cursor rest point */}
              <span ref={refs.rest} className="absolute bottom-6 right-8 h-1 w-1" />
            </div>
          </div>
        </div>

        {/* ---------------- Claude Code editor ---------------- */}
        <div className="relative z-10 -mt-10 mr-6 overflow-hidden rounded-2xl border border-[#2A3170] bg-[#0A0D26]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,.8)] backdrop-blur sm:-mt-14 sm:mr-14 lg:-ml-8">
          <div className="flex items-center justify-between gap-2 border-b border-[#1F2566] px-3 py-2">
            <span className="flex min-w-0 items-center gap-1.5">
              <BrandLogo name="claude" className="h-4 w-4" />
              <span className="truncate font-en text-[11px] font-semibold text-[#D6DEEB]">claude — ~/my-saas</span>
            </span>
            <span
              ref={refs.run}
              className={cn(
                "inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 font-en text-[10px] font-bold transition-all duration-200",
                build === "idle" ? "bg-[#B4532F] text-white" : "bg-[#1F2566] text-[#A9AEDB]",
                pressed === "run" && "scale-90",
              )}
            >
              <Play className="h-2.5 w-2.5 fill-current" /> Run
            </span>
          </div>
          <pre className="m-0 overflow-hidden px-3 py-2.5 font-mono text-[10.5px] leading-[1.7] sm:text-[11.5px]">
            <TypedCode initial={reduce ? TOTAL_CHARS : 0} setterRef={setTypedRef} />
          </pre>
          <div
            className={cn(
              "flex items-center gap-1.5 border-t border-[#1F2566] px-3 py-1.5 font-en text-[10px] transition-opacity duration-300 sm:text-[11px]",
              built ? "opacity-100" : "opacity-0",
            )}
          >
            <Check className="h-3 w-3 text-[#34D399]" />
            <span className="text-[#34D399]">Built</span>
            <span className="text-[#A9AEDB]">· Supabase connected</span>
            <BrandLogo name="supabase" className="h-3 w-3" />
          </div>
        </div>

        {/* ---------------- Floating chips ---------------- */}
        <div
          className={cn(
            "absolute bottom-4 right-2 z-20 flex items-center gap-2 rounded-xl border border-[#2A3170] bg-[#0C1030] px-3 py-2 shadow-[0_16px_40px_-12px_rgba(0,0,0,.7)] transition-all duration-500 sm:right-0",
            deploy === "live" ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
            <BrandLogo name="vercel" onLight className="h-3.5 w-3.5" />
          </span>
          <span className="font-en leading-tight">
            <span className="block text-[11px] font-bold text-white">Deployed</span>
            <span className="block text-[10px] text-[#A9AEDB]">Live on Vercel</span>
          </span>
        </div>
      </div>

      {/* ---------------- Animated cursor ---------------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-30 transition-[transform,opacity] duration-700 [transition-timing-function:cubic-bezier(.65,0,.35,1)]"
        style={{
          transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`,
          opacity: cursor.visible ? 1 : 0,
        }}
      >
        {cursor.clicking && <span className="nb-ripple absolute -left-4 -top-4 h-8 w-8 rounded-full border-2 border-white" />}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          className={cn("drop-shadow-[0_4px_8px_rgba(0,0,0,.5)] transition-transform duration-150", cursor.clicking && "scale-75")}
        >
          <path d="M4 2.5 19.5 12 12.6 13.4 16 20.5 13.2 21.8 9.8 14.7 4.9 19.4Z" fill="#fff" stroke="#0B0D2E" strokeWidth="1.4" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TypedCode({
  initial,
  setterRef,
}: {
  initial: number;
  setterRef: MutableRefObject<(n: number) => void>;
}) {
  const [count, setCount] = useState(initial);
  useEffect(() => {
    setterRef.current = setCount;
  }, [setterRef]);
  let left = count;
  let lineNo = 0;
  const caretLine = (() => {
    let n = count;
    for (let i = 0; i < LINES.length; i++) {
      const len = LINES[i].reduce((s, tk) => s + tk.t.length, 0);
      if (n <= len) return i;
      n -= len;
    }
    return LINES.length - 1;
  })();

  return (
    <>
      {LINES.map((line, li) => {
        const isPrompt = li === 0;
        if (!isPrompt) lineNo++;
        const shown = line.map((tk, ti) => {
          const part = tk.t.slice(0, Math.max(0, left));
          left -= tk.t.length;
          return part ? (
            <span key={ti} className={tk.c}>
              {part}
            </span>
          ) : null;
        });
        return (
          <div key={li} className={cn("flex whitespace-pre", isPrompt && "mb-1")}>
            {!isPrompt && <span className="mr-3 inline-block w-3 select-none text-right text-[#4B5078]">{lineNo}</span>}
            <span className="min-w-0 truncate">
              {shown}
              {li === caretLine && <span className="nb-caret ml-px inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-[#F4F5FF]" />}
            </span>
          </div>
        );
      })}
    </>
  );
}

function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [n, setN] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(a + (value - a) * eased);
      setN(v);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <>
      {prefix}
      {n.toLocaleString("en-US")}
      {suffix}
    </>
  );
}

function linePath(bars: number[]) {
  const step = 100 / (bars.length - 1);
  return bars
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(2)},${(100 - Math.min(96, v + 4)).toFixed(2)}`)
    .join(" ");
}
