"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { StarBullet } from "@/components/ui/StarBullet";

const phases = [
  {
    label: "Phase 1",
    title: "Collectibles Trading",
    items: [
      "Graded sports card, art & memorabilia",
      "Order book with instant atomic settlement",
      "5% total fees",
      "24/7 grading No lock-up",
      "Full price history transparency",
    ],
  },
  {
    label: "Phase 2",
    title: "Fractional Reg D, A+ Ownership",
    items: [
      "Card, blue ship art, sports team equity",
      "We are the Issuer - absorb Reg A+ upfront costs",
      "Compliance baked into token (KYC/AML on-chain)",
      "Open to All investors : $100 minimum",
      "ATS secondary market : instant liquidity",
    ],
  },
  {
    label: "Utility",
    title: "Events & Membership Token",
    items: [
      "Event access tickets - burned post-use",
      "Tiered perks: merch, VIP, meet players/artists",
      "Perks scale with security token holdings",
      "NFC slab / lanyard = membership credential",
      "Access to all Tokenable live events",
    ],
  },
] as const;

const cardBase =
  "mx-auto flex w-full max-w-[400px] min-h-0 flex-col rounded-[15px] border border-white/[0.12] bg-[rgba(12,12,12,0.72)] px-5 pb-6 pt-5 backdrop-blur-md lg:min-h-[640px] lg:transition-opacity lg:duration-700 lg:ease-out";

export function PlatformSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [showPhase2, setShowPhase2] = useState(false);
  const [showPhase3, setShowPhase3] = useState(false);

  /** Stagger fade-in only at `lg` and up; mobile shows all cards with no delay. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    const el = sectionRef.current;
    if (!el) return;

    let t2: number | undefined;
    let t3: number | undefined;
    let revealScheduled = false;

    const scheduleReveal = () => {
      if (revealScheduled) return;
      revealScheduled = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setShowPhase2(true);
        setShowPhase3(true);
        return;
      }

      t2 = window.setTimeout(() => setShowPhase2(true), 520);
      t3 = window.setTimeout(() => setShowPhase3(true), 1100);
    };

    const tryRevealIfVisible = () => {
      const rect = el.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < h && rect.bottom > 0) scheduleReveal();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) scheduleReveal();
      },
      { threshold: [0, 0.05, 0.1, 0.15], rootMargin: "0px 0px 20% 0px" },
    );

    observer.observe(el);
    tryRevealIfVisible();
    requestAnimationFrame(tryRevealIfVisible);

    const safety = window.setTimeout(() => {
      setShowPhase2(true);
      setShowPhase3(true);
    }, 2800);

    return () => {
      window.clearTimeout(safety);
      observer.disconnect();
      if (t2 !== undefined) window.clearTimeout(t2);
      if (t3 !== undefined) window.clearTimeout(t3);
    };
  }, []);

  const phaseCardClass = (index: number) => {
    if (index === 0) return `${cardBase} opacity-100`;
    if (index === 1) {
      return `${cardBase} max-lg:pointer-events-auto max-lg:opacity-100 ${showPhase2 ? "lg:pointer-events-auto lg:opacity-100" : "lg:pointer-events-none lg:opacity-0"}`;
    }
    return `${cardBase} max-lg:pointer-events-auto max-lg:opacity-100 ${showPhase3 ? "lg:pointer-events-auto lg:opacity-100" : "lg:pointer-events-none lg:opacity-0"}`;
  };

  return (
    <section
      ref={sectionRef}
      id="service"
      className="scroll-mt-[102px] bg-black px-4 pt-[46px] pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-28 sm:pt-12 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center">
        <header className="flex w-full flex-col items-center text-center">
          <div className="mx-auto flex w-full max-w-[993px] justify-center px-4 sm:px-6">
            <h2 className="inline-grid w-max max-w-full -translate-x-3 grid-cols-[auto_auto] items-start gap-x-2 font-medium leading-[1.2] tracking-normal text-[clamp(1.2rem,5.2vw,78px)] sm:-translate-x-8 sm:gap-x-3 md:-translate-x-12 md:gap-x-4 lg:-translate-x-16">
              <span className="col-start-1 row-start-1 flex items-center justify-end self-center pt-[0.12em]">
                <Image
                  src="/star.png"
                  alt=""
                  width={52}
                  height={52}
                  className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11 md:h-12 md:w-12"
                />
              </span>
              <span className="col-start-2 row-start-1 translate-x-1 whitespace-nowrap pl-1 text-left text-white sm:translate-x-2 sm:pl-2 md:translate-x-3">
                One Compliant
              </span>
              <span className="col-start-2 row-start-2 text-center italic text-[var(--accent)]">
                Platform
              </span>
            </h2>
          </div>
          <p className="mt-6 w-full max-w-[993px] px-2 text-center text-base font-normal leading-normal text-white sm:text-[17px] lg:text-[19px]">
            Tokenable removes every barrier - access, fees, settlement, and regulation - through a
            dual-entity, two-token architecture.
          </p>
        </header>

        <div className="mt-14 grid w-full max-w-[1280px] grid-cols-1 justify-center justify-items-center gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {phases.map((phase, index) => (
            <article key={phase.label} className={phaseCardClass(index)}>
              <div className="mb-6 text-left">
                <StarBullet size={22} className="mb-2 block h-[22px] w-[22px] shrink-0" />
                <p className="text-[0.9375rem] italic leading-normal text-white sm:text-base">{phase.label}</p>
                <h3 className="mt-2 text-[26px] font-bold leading-snug text-white sm:text-[27px]">{phase.title}</h3>
              </div>
              <ul className="flex flex-col gap-[10px]">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="mx-auto flex min-h-[80px] w-full max-w-[360px] items-center gap-[10px] rounded-[10px] bg-[rgba(152,161,159,0.2)] py-[15px] pl-[10px] pr-[10px]"
                  >
                    <StarBullet size={18} className="shrink-0 self-center" />
                    <span className="min-w-0 flex-1 text-left text-[17px] font-normal leading-snug text-white sm:text-[18px] md:text-[19px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
