"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setStatus("sending");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
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
          <legend className="mb-4 font-sans text-base font-bold text-white">Name</legend>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
            <div className="min-w-0">
              <label htmlFor="firstName" className="mb-1 block font-sans text-sm font-normal text-white/85">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="min-h-[44px] w-full border-0 border-b border-white/35 bg-transparent py-2.5 font-sans text-[16px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-0 sm:py-2 sm:text-[15px]"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="lastName" className="mb-1 block font-sans text-sm font-normal text-white/85">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="min-h-[44px] w-full border-0 border-b border-white/35 bg-transparent py-2.5 font-sans text-[16px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-0 sm:py-2 sm:text-[15px]"
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="email" className="mb-4 block font-sans text-base font-bold text-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="min-h-[44px] w-full border-0 border-b border-white/35 bg-transparent py-2.5 font-sans text-[16px] text-white outline-none transition-colors placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-0 sm:max-w-[60%] sm:py-2 sm:text-[15px]"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-4 block font-sans text-base font-bold text-white">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={1}
            required
            className="min-h-[3rem] w-full resize-y border-0 border-b border-white/35 bg-transparent py-2 font-sans text-[16px] leading-[1.4] text-white outline-none transition-colors [field-sizing:content] placeholder:text-white/30 focus:border-[rgb(0,169,129)] sm:min-h-[2.75rem] sm:py-1.5 sm:text-[15px]"
            placeholder=""
          />
        </div>

        <div className="flex flex-col items-center gap-3 pt-2 sm:items-start">
          <button
            type="submit"
            disabled={status === "sending"}
            className="relative box-border flex h-[48px] w-full max-w-[250px] items-center justify-center gap-[10px] overflow-hidden rounded-[24px] border border-white/[0.18] bg-[rgba(11,13,16,0.92)] px-8 font-sans text-[15px] font-medium leading-none text-white shadow-[0_6px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.35)] backdrop-blur-[12px] backdrop-saturate-150 transition-[border-color,box-shadow,background-color,opacity] hover:border-white/25 hover:bg-[rgba(8,10,12,0.96)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.4)] active:opacity-95 disabled:opacity-60 sm:h-[41px] sm:w-[250px] sm:max-w-none sm:px-[48px] sm:py-2"
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-b from-white/[0.04] via-transparent to-[rgba(0,0,0,0.18)]"
              aria-hidden
            />
            <span className="relative z-[1]">{status === "sending" ? "Sending…" : "Send"}</span>
          </button>
          {status === "success" ? (
            <p className="font-sans text-sm text-[rgb(0,169,129)]">Thanks — your message was sent.</p>
          ) : null}
          {status === "error" && errorMessage ? (
            <p className="font-sans text-sm text-red-400/95">{errorMessage}</p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
