import type { ReactNode } from "react";

export type AboutOutlineVariant = 1 | 2 | 3;

const variantWidth: Record<AboutOutlineVariant, string> = {
  1: "w-full max-w-[480px] md:w-[480px]",
  2: "w-full max-w-[480px] md:w-[480px]",
  3: "w-full max-w-[480px] md:w-[480px]",
};

type AboutOutlineCardProps = {
  title: string;
  children: ReactNode;
  variant: AboutOutlineVariant;
  className?: string;
};

export function AboutOutlineCard({ title, children, variant, className = "" }: AboutOutlineCardProps) {
  return (
    <div className={`about-outline-card shrink-0 rounded-[12px] ${variantWidth[variant]} ${className}`}>
      <div className="relative z-[1] flex flex-col gap-[10px] bg-transparent p-[25px]">
        <h2 className="text-[clamp(1.25rem,5vw,1.5rem)] font-bold leading-snug tracking-tight text-white sm:text-[24px]">
          {title}
        </h2>
        <p className="text-[15px] font-normal leading-relaxed text-white sm:text-[16px] sm:leading-[1.5]">
          {children}
        </p>
      </div>
    </div>
  );
}
