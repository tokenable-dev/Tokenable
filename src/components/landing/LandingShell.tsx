"use client";

import { useEffect, useRef, useState } from "react";

const THREE_SCRIPT = "/landing/three.min.js";
const DC_RUNTIME_SCRIPT = "/landing/support.js";
const LANDING_DOCUMENT = "/landing/document.html";

declare global {
  interface Window {
    THREE?: unknown;
    __resources?: Record<string, string>;
    __FORMSPREE_WAITLIST_ENDPOINT?: string;
    __WAITLIST_SHEETS_URL?: string;
    __WAITLIST_SHEETS_SECRET?: string;
    __dcBoot?: () => void;
  }
}

function isExecutedScript(script: HTMLScriptElement): boolean {
  return script.dataset.landingLoaded === "true";
}

function removeInertScripts(src: string): void {
  for (const script of document.querySelectorAll<HTMLScriptElement>(`script[src="${src}"]`)) {
    if (!isExecutedScript(script)) {
      script.remove();
    }
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const executed = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"][data-landing-loaded="true"]`,
    );
    if (executed) {
      resolve();
      return;
    }

    removeInertScripts(src);

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.landingLoaded = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

function activateScripts(container: HTMLElement): Promise<void> {
  const scripts = [...container.querySelectorAll("script")];
  return scripts.reduce<Promise<void>>((chain, old) => {
    return chain.then(
      () =>
        new Promise<void>((resolve, reject) => {
          const type = old.getAttribute("type") ?? "";
          if (type === "text/x-dc") {
            resolve();
            return;
          }

          const src = old.getAttribute("src");
          if (src) {
            const executed = document.querySelector<HTMLScriptElement>(
              `script[src="${src}"][data-landing-loaded="true"]`,
            );
            if (executed) {
              old.remove();
              resolve();
              return;
            }
          }

          const next = document.createElement("script");
          for (const attr of old.attributes) {
            if (attr.name === "src" || attr.name === "type") {
              next.setAttribute(attr.name, attr.value);
            }
          }
          if (!old.src) {
            next.textContent = old.textContent;
          }
          next.dataset.landingLoaded = "true";

          next.onload = () => {
            old.remove();
            resolve();
          };
          next.onerror = () => {
            old.remove();
            reject(new Error(`Failed to load script: ${src ?? "inline"}`));
          };

          old.replaceWith(next);

          if (!old.src) {
            old.remove();
            resolve();
          }
        }),
    );
  }, Promise.resolve());
}

export function LandingShell() {
  const mountRef = useRef<HTMLDivElement>(null);
  const bootedRef = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (bootedRef.current || !mountRef.current) return;
    bootedRef.current = true;

    const mount = mountRef.current;

    async function boot() {
      window.__FORMSPREE_WAITLIST_ENDPOINT =
        process.env.NEXT_PUBLIC_FORMSPREE_WAITLIST_ENDPOINT?.trim() ?? "";
      window.__WAITLIST_SHEETS_URL =
        process.env.NEXT_PUBLIC_WAITLIST_SHEETS_URL?.trim() ?? "";
      window.__WAITLIST_SHEETS_SECRET =
        process.env.NEXT_PUBLIC_WAITLIST_SHEETS_SECRET?.trim() ?? "";

      window.__resources = {
        logoSvg: "/landing/logo.svg",
        c01: "/landing/newcards/c01.jpg",
        c02: "/landing/newcards/c02.jpg",
        c03: "/landing/newcards/c03.jpg",
        c04: "/landing/newcards/c04.jpg",
        c05: "/landing/newcards/c05.jpg",
        c06: "/landing/newcards/c06.jpg",
        c07: "/landing/newcards/c07.jpg",
        c08: "/landing/newcards/c08.jpg",
        c09: "/landing/newcards/c09.jpg",
        c10: "/landing/newcards/c10.jpg",
      };

      await loadScript(THREE_SCRIPT);

      const response = await fetch(LANDING_DOCUMENT);
      if (!response.ok) {
        throw new Error(`Failed to load landing document (${response.status})`);
      }

      mount.innerHTML = await response.text();
      await activateScripts(mount);

      if (typeof window.__dcBoot === "function") {
        window.__dcBoot();
      } else {
        await loadScript(DC_RUNTIME_SCRIPT);
      }

      setStatus("ready");
    }

    boot().catch((error: unknown) => {
      bootedRef.current = false;
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to load landing page.");
      console.error("[landing]", error);
    });
  }, []);

  return (
    <>
      {status === "loading" ? (
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[100000] rounded-lg bg-white px-3.5 py-2 font-sans text-[13px] text-[#666] shadow"
        >
          Loading…
        </div>
      ) : null}
      {status === "error" ? (
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a0b] px-6 text-center text-white">
          <p className="max-w-md font-sans text-base text-red-300">{errorMessage}</p>
        </div>
      ) : null}
      <div ref={mountRef} id="landing-mount" className={status === "error" ? "hidden" : undefined} />
    </>
  );
}
