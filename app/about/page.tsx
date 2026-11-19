import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { PROFILE, PROGRAMS } from "@/lib/portfolio-data";
import { STANDARDS } from "@/lib/lab-data";
import { CERTIFICATIONS } from "@/lib/resume-data";
import { getAllBlogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "About",
  description:
    "George Wanyoike (Sir G): security practitioner, network engineer, ISP operator and founder of Knight Labs, based in Nairobi.",
  alternates: { canonical: "/about" },
};

export const revalidate = 300;

const CHAPTERS = [
  {
    period: "2020 – 2023",
    title: "Hardware first",
    body: "A B.Sc. in Computer Technology at JKUAT, finished with Second Class Upper Division. The practical education came alongside it: keeping campus networks up at JKUAT ICT Labs, then inspecting Taifa Tablets on the assembly line at JKUAT Industrial Park and running secure data sanitisation for end-of-life devices. Knowing what is inside the box turns out to matter when you are later asked to break it.",
  },
  {
    period: "2024",
    title: "A network with paying customers",
    body: "I founded Anga Networks, an ISP on MikroTik and RouterOS across several Kenyan sites, with Starlink backhaul, wireless distribution, and an automation layer I built on n8n and the RouterOS API. Running it means every security opinion I hold has been paid for operationally. I carry the pager.",
  },
  {
    period: "2024 – 2025",
    title: "Security as the day job",
    body: "Cyber Shujaa's Security Engineer track, the Cisco and Huawei academies, and ISC² Certified in Cybersecurity built the foundation. The Presidential DigiTalent Programme placed me at the National Commission for Science, Technology and Innovation as an information security intern: network assessments, hardware audits, firewall review planning, controlled penetration testing, and contributing to the organisation's IT policy.",
  },
  {
    period: "2026 – now",
    title: "Assurance in production",
    body: "I run digital platforms assurance for Kenya Airport Parking Services (KAPS): mobile and web penetration testing, QA ownership for the KAPS App, and audits of production infrastructure. One piece of that work traced an estimated KES 8.28M in revenue loss through data analysis alone. Alongside it I take authorised audits and bug bounty research independently, partnering with Spookie Labs Inc. on selected engagements.",
  },
  {
    period: "Now",
    title: "Knight Labs",
    body: "Knight Labs is where the practice becomes a firm. SACCOs, clinics, schools and property managers hold data that deserves the same care as a university audit, without the budget for a security team. The firm gives them that, and I review every proposal and report.",
  },
];

const CAPABILITIES = [
  {
    area: "Offensive",
    detail:
      "Full-lifecycle penetration testing across web, mobile and API surfaces. Authorization flaws, attack chaining, CVE research against deployed versions, and legacy binary analysis where no source is available.",
  },
  {
    area: "Network and infrastructure",
    detail:
      "MikroTik RouterOS and Cisco environments, link aggregation, segmentation design, firewall assessment, satellite and wireless distribution, and zero-trust overlay networks.",
  },
  {
    area: "Assurance and audit",
    detail:
      "Systems auditing on production infrastructure, digital QA ownership for a mobile application, structured staff interviews as a technical control, and operational data analysis that produces financial findings.",
  },
  {
    area: "Build",
    detail:
      "Full-stack delivery on React and Node, workflow orchestration with n8n, serverless services on Cloudflare Workers and Firebase, and Bash systems work on Linux.",
  },
];

export default function AboutPage() {
  const ctfCount = getAllBlogPosts().filter((p) => p.category === "ctf").length;

  return (
    <>
      <PageHeader
        eyebrow={`${PROFILE.location} · goes by ${PROFILE.alias}`}
        title="George Wanyoike Njoroge"
        standfirst={
          <p>
            Security practitioner, network engineer, ISP operator, and founder
            of Knight Labs. The through-line is simple: the offensive work and
            the operational work inform each other, and neither is worth much
            on its own.
          </p>
        }
      />

      <section className="container-page">
        <SectionHeading index="01" title="The story so far" />
        <ol className="relative">
          {CHAPTERS.map((ch) => (
            <li key={ch.title} className="reveal grid gap-3 border-t border-border py-8 md:grid-cols-12 md:gap-8">
              <p className="eyebrow mono-num md:col-span-3 md:pt-2">{ch.period}</p>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl text-foreground sm:text-[1.75rem]">{ch.title}</h3>
                <p className="mt-3 max-w-3xl text-[1.0625rem] leading-relaxed text-muted-foreground">{ch.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="02" title="What I do" />
        <ul className="grid gap-x-10 md:grid-cols-2">
          {CAPABILITIES.map((item) => (
            <li key={item.area} className="reveal border-t border-border py-6">
              <h3 className="font-display text-xl text-foreground">{item.area}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="03" title="How I work" note="Rules I hold myself to on every engagement." />
        <ol className="grid gap-x-10 md:grid-cols-2">
          {STANDARDS.map((rule, i) => (
            <li key={rule} className="reveal flex gap-5 border-t border-border py-6">
              <span className="figure-num text-2xl leading-none text-primary">{i + 1}</span>
              <p className="leading-relaxed text-foreground/90">{rule}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading
          index="04"
          title="Community and practice"
          note="Where I keep the edge sharp, and where I learned the trade."
        />
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="leading-relaxed text-muted-foreground">
              Active on Hack The Box, TryHackMe and picoCTF, with{" "}
              <Link href="/blog?category=ctf" className="link-quiet text-foreground">
                {ctfCount} CTF writeups
              </Link>{" "}
              published here. Bug bounty research runs through public programmes
              such as HackerOne, described by vulnerability class and never by
              target.
            </p>
            {/* TODO(owner): add talks, panels, meetups or community roles here
                (event, date, topic, link). Nothing in the repo documents any yet,
                so no "Speaking" section is shown. */}
          </div>
          <ul className="md:col-span-7">
            {PROGRAMS.map((prog) => (
              <li key={prog.name} className="reveal border-t border-border py-5">
                <h3 className="font-display text-xl text-foreground">{prog.name}</h3>
                <p className="mt-1 text-sm text-primary">{prog.org}</p>
                <p className="mt-2 leading-relaxed text-muted-foreground">{prog.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="05" title="Credentials" />
        <ul className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.name} className="tag !text-sm !text-foreground">
              {cert.fullName}
              <span className="ml-2 text-muted-foreground">{cert.issuer.split(" ")[0]}</span>
            </li>
          ))}
        </ul>
        <Link href="/resume" className="mt-8 inline-flex items-center gap-2 font-medium text-foreground hover:text-primary">
          Full resume and education
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
