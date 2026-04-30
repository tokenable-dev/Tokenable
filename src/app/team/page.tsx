import Image from "next/image";

type Member = {
  slug: string;
  image: string;
  name: string;
  role: string;
  bio: string;
};

const members: Member[] = [
  {
    slug: "thomas",
    image: "/Thomas.png",
    name: "Thomas Park",
    role: "Co-Founder, CEO",
    bio: "Founder and CEO of Retium a registered Crowdfunding and Broker Dealer platform which allows issuers to raise capital while fully compliant with securities regulations.",
  },
  {
    slug: "rohit",
    image: "/Rohit.png",
    name: "Rohit Wad",
    role: "Advisory CTO",
    bio: "Advises on scalable trading architecture, security, and distributed systems for institutional-grade tokenized markets.",
  },
  {
    slug: "steven",
    image: "/Steven.png",
    name: "Steven Christie",
    role: "Chief Compliance Officer (CCO)",
    bio: "Oversees regulatory alignment with SEC, FINRA, and CSA frameworks, embedding compliance into every product and listing workflow.",
  },
  {
    slug: "luke",
    image: "/Luke.png",
    name: "Luke Shim",
    role: "Co-Founder, CFO",
    bio: "Leads finance, treasury, and investor reporting with a focus on transparent capital structure and sustainable platform growth.",
  },
  {
    slug: "dennis",
    image: "/Dennis.png",
    name: "Dennis Ng",
    role: "Co-Founder, COO",
    bio: "Runs day-to-day operations, issuer onboarding, and cross-functional delivery across product, legal, and brokerage partners.",
  },
  {
    slug: "eric",
    image: "/Eric.png",
    name: "Eric Heo",
    role: "CPO",
    bio: "Shapes product vision, UX, and roadmap for collectors, issuers—from primary issuance through secondary liquidity experiences.",
  },
];

export default function TeamPage() {
  return (
    <section
      className="min-h-screen scroll-mt-[102px] bg-black px-4 pt-[max(140px,calc(110px+env(safe-area-inset-top)))] pb-[max(6rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-[168px] lg:px-12 lg:pt-[180px]"
      aria-label="Team"
    >
      <div className="mx-auto max-w-[1100px]">
        <header className="mx-auto mb-16 max-w-4xl text-center sm:mb-20 md:mb-24">
          <h1 className="font-sans text-[clamp(2rem,6vw,65px)] font-semibold leading-[1.4] tracking-normal text-white">
            Meet the Brains
          </h1>
          <p className="mt-5 font-sans text-[clamp(1.0625rem,2.5vw,28px)] font-normal leading-[1.4] tracking-normal text-white sm:mt-6">
            The Operating System for Tokenized Asset Markets
          </p>
        </header>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-x-14 md:gap-y-16 lg:gap-x-20 lg:gap-y-20">
          {members.map((m) => (
            <article
              key={m.slug}
              className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8"
            >
              <div className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-full border border-white/12 bg-white/[0.04] sm:h-[148px] sm:w-[148px]">
                <Image
                  src={m.image}
                  alt={m.name}
                  width={148}
                  height={148}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="w-full min-w-0 text-center sm:text-left">
                <h2 className="font-sans text-[24px] font-medium leading-[1.4] tracking-normal text-white">
                  {m.name}
                </h2>
                <p className="mt-1 font-sans text-[18px] font-normal leading-[1.4] tracking-normal text-[rgb(0,169,129)]">
                  {m.role}
                </p>
                <div
                  className="my-4 h-px w-full bg-gradient-to-r from-white/18 via-white/10 to-transparent sm:max-w-md"
                  aria-hidden
                />
                <p className="font-sans text-[14px] font-normal leading-[1.4] tracking-normal text-[rgb(245,245,245)]">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
