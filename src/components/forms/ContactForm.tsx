"use client";

import { useState } from "react";

const DEFAULT_FORMSPREE_ENDPOINT = "https://formspree.io/f/REPLACE_ME";

function formspreeErrorMessage(data: unknown): string {
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.error === "string") {
      return d.error;
    }
    const errors = d.errors;
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      for (const v of Object.values(errors as Record<string, unknown>)) {
        if (Array.isArray(v) && typeof v[0] === "string") {
          return v[0];
        }
        if (typeof v === "string") {
          return v;
        }
      }
    }
  }
  return "Could not send. Try again later.";
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setStatus("sending");

    const endpoint =
      process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim() || DEFAULT_FORMSPREE_ENDPOINT;

    if (endpoint.includes("REPLACE_ME")) {
      setStatus("error");
      setErrorMessage("Contact form is not configured. Set NEXT_PUBLIC_FORMSPREE_ENDPOINT to your Formspree URL.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const name = `${firstName} ${lastName}`.trim();

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `[Tokenable contact] ${name}`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(formspreeErrorMessage(data));
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <form
      className="contact-form w-full max-w-xl lg:max-w-none lg:justify-self-end"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="space-y-10">
        <fieldset className="min-w-0 border-0 p-0">
          <legend className="mb-4 font-sans text-lg font-bold text-white">Name</legend>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
            <div className="min-w-0">
              <label htmlFor="firstName" className="mb-1 block font-sans text-base font-normal text-white/85">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="min-h-[44px] w-full border-0 border-b border-white/35 bg-transparent py-2.5 font-sans text-[16px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-0 sm:py-2 sm:text-[16px]"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="lastName" className="mb-1 block font-sans text-base font-normal text-white/85">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="min-h-[44px] w-full border-0 border-b border-white/35 bg-transparent py-2.5 font-sans text-[16px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-0 sm:py-2 sm:text-[16px]"
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="email" className="mb-4 block font-sans text-lg font-bold text-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-[44px] w-full border-0 border-b border-white/35 bg-transparent py-2.5 font-sans text-[16px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-0 sm:max-w-[60%] sm:py-2 sm:text-[16px]"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-4 block font-sans text-lg font-bold text-white">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={1}
            required
            className="min-h-[3rem] w-full resize-y border-0 border-b border-white/35 bg-transparent py-2 font-sans text-[16px] leading-[1.4] text-white outline-none transition-colors [field-sizing:content] placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-[2.75rem] sm:py-1.5 sm:text-[16px]"
            placeholder=""
          />
        </div>

        <div className="flex flex-col items-center gap-2.5 pt-2 sm:items-start">
          <button
            type="submit"
            disabled={status === "sending"}
            className="relative box-border flex h-[48px] w-full max-w-[250px] items-center justify-center gap-[10px] overflow-hidden rounded-[24px] border border-white/[0.18] bg-[rgba(11,13,16,0.92)] px-8 font-sans text-[16px] font-medium leading-none text-white shadow-[0_6px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.35)] backdrop-blur-[12px] backdrop-saturate-150 transition-[border-color,box-shadow,background-color,opacity] hover:border-white/25 hover:bg-[rgba(8,10,12,0.96)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.4)] active:opacity-95 disabled:opacity-60 sm:h-[41px] sm:w-[250px] sm:max-w-none sm:px-[48px] sm:py-2"
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.04] via-transparent to-[rgba(0,0,0,0.18)]"
              aria-hidden
            />
            <span className="relative z-[1]">{status === "sending" ? "Sending…" : "Send"}</span>
          </button>
          {status === "success" ? (
            <p
              className="max-w-full text-center font-sans text-[15px] leading-snug text-[rgb(0,169,129)] sm:text-left sm:text-base"
              role="status"
              aria-live="polite"
            >
              Thanks — your message was sent. We’ll get back to you soon.
            </p>
          ) : null}
          {status === "error" && errorMessage ? (
            <p className="font-sans text-base text-red-400/95">{errorMessage}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
