import Link from "next/link";
import { AboutSection } from "@/components/sections/about/AboutSection";
import { PlatformSection } from "@/components/sections/platform/PlatformSection";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[100dvh] overflow-hidden bg-black" aria-label="Hero">
        <div className="pointer-events-none absolute inset-0 z-0">
          <video
            className="h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
          >
            <source src="/main.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/20"
            aria-hidden
          />
        </div>
        <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-5 pb-[max(clamp(3.5rem,12vh,6.5rem),env(safe-area-inset-bottom))] pt-[max(106px,calc(76px+env(safe-area-inset-top)))] text-center sm:px-8">
          <div className="mx-auto flex w-full max-w-[min(100%,1180px)] flex-col items-center px-1 sm:px-2">
            <h1 className="text-white">
              <span className="block text-[clamp(2.375rem,11vw,4.25rem)] font-bold leading-[1.05] tracking-tight sm:text-[clamp(2.875rem,8.5vw,4.375rem)]">
                Markets for
              </span>
              <span className="block text-[clamp(2.375rem,11vw,4.25rem)] font-bold leading-[1.05] tracking-tight sm:text-[clamp(2.875rem,8.5vw,4.375rem)]">
                Tokenized Assets
              </span>
            </h1>
            <p className="mx-auto mt-6 flex w-full max-w-[min(100%,40rem)] flex-col gap-2 text-center text-[clamp(1.0625rem,4.4vw,1.3125rem)] font-normal leading-relaxed text-white sm:mt-8 md:max-w-[min(100%,1180px)] md:text-[22px] md:leading-normal">
              <span className="block w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden">
                <span className="inline-block whitespace-nowrap">
                  We tokenize and create markets for investments in high value and scarce assets that
                  people have passion for.
                </span>
              </span>
              <span className="block text-balance">
                Art, collectibles, sports, and entertainment are tokenized and traded.
              </span>
            </p>
            <Link
              href="/#service"
              className="relative mt-10 box-border flex h-[52px] w-full max-w-[min(100%,248px)] min-h-[48px] items-center justify-center gap-3 overflow-hidden rounded-[28px] border border-white/[0.22] bg-[rgba(16,22,30,0.52)] px-8 py-3 text-[16px] font-medium leading-none text-white shadow-[0_6px_28px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.18)] backdrop-blur-[20px] backdrop-saturate-150 transition-[border-color,box-shadow,background-color] hover:border-white/30 hover:bg-[rgba(16,22,30,0.62)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.2)] active:opacity-95 sm:max-w-[248px] sm:px-11"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-b from-white/[0.07] via-transparent to-[rgba(0,0,0,0.12)]"
                aria-hidden
              />
              <span className="relative z-[1]">View Our Service</span>
            </Link>
          </div>
        </div>
      </section>
      <AboutSection />
      <PlatformSection />
    </>
  );
}
