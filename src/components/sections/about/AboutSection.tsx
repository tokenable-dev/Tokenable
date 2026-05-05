"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AboutOutlineCard } from "./AboutOutlineCard";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen scroll-mt-[102px] overflow-hidden bg-black pt-[max(5rem,calc(4rem+env(safe-area-inset-top)))] pb-[max(5rem,env(safe-area-inset-bottom))] md:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
        <Image
          src="/bg_cube.png"
          alt=""
          width={1600}
          height={1600}
          className="h-auto max-h-[min(1000px,85svh)] w-[min(1180px,102vw)] max-w-none object-contain opacity-95 sm:max-h-[min(1080px,88svh)] sm:w-[min(1320px,106vw)]"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-8 pt-4 sm:px-8 md:hidden">
        <div className="flex flex-col gap-14">
          <div className={inView ? "about-gather-1" : ""}>
            <AboutOutlineCard variant={1} title="Alternative assets">
              We tokenize and create markets <br />
              for investments in high value and scarce assets <br />
              that people have passion for. Art, collectibles, sports, and <br />
              entertainment are tokenized and traded.
            </AboutOutlineCard>
          </div>
          <div className={inView ? "about-gather-2" : ""}>
            <AboutOutlineCard variant={2} title="Collectibles as tokenized assets">
              Tokenable allows collectors to turn high-end items <br />
              into liquid tokens, enabling crypto-native liquidity and <br />
              trading while increasing security and authentication.
            </AboutOutlineCard>
          </div>
          <div className={inView ? "about-gather-3" : ""}>
            <AboutOutlineCard variant={3} title="Fully Compliant">
              Tokenable has adopted North American securities laws <br />
              governing tokenized assets, designed to protect investors. <br />
              Our team continuously monitors regulatory changes with <br />
              guidance from the SEC, FINRA, and CSA to maintain full <br />
              compliance across all jurisdictions with partners Broker <br />
              Dealers.
            </AboutOutlineCard>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden w-full max-w-[1440px] px-4 md:block md:px-6 lg:px-12 xl:px-16">
        <div className="relative min-h-[min(100svh,980px)] lg:min-h-[min(100svh,1020px)]">
          <div className="absolute top-[7%] right-[8%] z-[11] w-full max-w-[480px] md:top-[8%] md:right-[9%] lg:top-[9%] lg:right-[11%] xl:right-[12%]">
            <div className={inView ? "about-gather-1" : ""}>
              <AboutOutlineCard variant={1} title="Alternative assets">
                We tokenize and create markets <br />
                for investments in high value and scarce assets <br />
                that people have passion for. Art, collectibles, sports, and <br />
                entertainment are tokenized and traded.
              </AboutOutlineCard>
            </div>
          </div>

          <div className="absolute left-[6%] top-1/2 z-[11] w-full max-w-[480px] -translate-y-1/2 md:left-[7%] lg:left-[8%] xl:left-[9%]">
            <div className={inView ? "about-gather-2" : ""}>
              <AboutOutlineCard variant={2} title="Collectibles as tokenized assets">
                Tokenable allows collectors to turn high-end items <br />
                into liquid tokens, enabling crypto-native liquidity and <br />
                trading while increasing security and authentication.
              </AboutOutlineCard>
            </div>
          </div>

          <div className="absolute bottom-[8%] right-[2.5%] z-[11] w-full max-w-[480px] md:bottom-[9%] md:right-[3%] lg:bottom-[10%] lg:right-[3.5%] xl:right-[4%]">
            <div className={inView ? "about-gather-3" : ""}>
              <AboutOutlineCard variant={3} title="Fully Compliant">
                Tokenable has adopted North American securities laws <br />
                governing tokenized assets, designed to protect investors. <br />
                Our team continuously monitors regulatory changes with <br />
                guidance from the SEC, FINRA, and CSA to maintain full <br />
                compliance across all jurisdictions with partners Broker <br />
                Dealers.
              </AboutOutlineCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
