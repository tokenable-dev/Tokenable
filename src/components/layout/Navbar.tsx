"use client";

import Image from "next/image";
import Link from "next/link";

const navLinkClass =
  "-my-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center whitespace-nowrap rounded-md px-0.5 text-[13px] font-medium leading-none tracking-wide text-white antialiased transition-colors duration-200 hover:text-[var(--accent)] sm:px-1 sm:text-[14px] md:text-[15px] lg:text-[17px]";

const links = [
  { href: "/#about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;

const SERVICE_UNAVAILABLE_MESSAGE =
  "The service is under preparation.";

const LOGO_SLOT = "flex w-9 shrink-0 items-center justify-start";

/** Glass nav: thin light border, blur, top highlight. Tighter end padding for menu spacing. */
export function Navbar() {
  return (
    <header className="pointer-events-none fixed top-[max(30px,env(safe-area-inset-top))] right-0 left-0 z-50 flex justify-center pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
      <nav
        className="pointer-events-auto relative flex h-14 w-full max-w-[610px] items-center overflow-hidden rounded-[35px] border border-white/[0.22] bg-[rgba(16,22,30,0.52)] px-5 shadow-[0_6px_28px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(0,0,0,0.18)] backdrop-blur-[20px] backdrop-saturate-150 sm:pl-10 sm:pr-4"
        aria-label="Primary"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[35px] bg-gradient-to-b from-white/[0.07] via-transparent to-[rgba(0,0,0,0.12)]"
          aria-hidden
        />

        <div className={`relative z-[1] ${LOGO_SLOT}`}>
          <Link href="/" className="flex size-9 items-center justify-center" aria-label="Tokenable home">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              className="size-9 object-contain object-center select-none"
              priority
            />
          </Link>
        </div>

        <div className="relative z-[1] flex min-w-0 flex-1 items-center justify-center px-1">
          <ul className="m-0 flex list-none items-center gap-2 sm:gap-3 md:gap-6 lg:gap-10">
            {links.map(({ href, label }) => (
              <li key={href} className="flex items-center">
                <Link href={href} className={navLinkClass}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <button
                type="button"
                className={`${navLinkClass} cursor-pointer border-none bg-transparent p-0`}
                onClick={() => alert(SERVICE_UNAVAILABLE_MESSAGE)}
              >
                Service
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
