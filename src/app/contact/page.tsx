import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <section
      className="min-h-screen scroll-mt-[102px] bg-black px-4 pt-[max(140px,calc(110px+env(safe-area-inset-top)))] pb-[max(6rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-[168px] lg:pt-[180px]"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="rounded-2xl border border-white/[0.08] bg-[rgba(11,13,16,1)] px-6 py-10 sm:px-10 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <div>
              <h1 className="font-sans text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-tight tracking-tight text-white">
                Contact Us
              </h1>
              <p className="mt-8 max-w-md font-sans text-base font-normal leading-relaxed text-white sm:text-lg">
                Please feel free to reach out if you are looking to tokenize assets.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
