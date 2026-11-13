import type { Metadata } from "next";
import Link from "next/link";
import { Award, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { PROFILE, PROGRAMS, ROLES } from "@/lib/portfolio-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "George Wanyoike Njoroge — security practitioner, network engineer, and ISP operator based in Nairobi, Kenya.",
};

const CERTIFICATIONS = [
  { name: "CC", full: "Certified in Cybersecurity", issuer: "ISC²", year: "2024" },
  { name: "CCNA", full: "Cisco Certified Network Associate", issuer: "Cisco", year: "2024" },
  { name: "CyberOps", full: "CyberOps Associate", issuer: "Cisco", year: "2024" },
  { name: "Network Defence", full: "Network Defence Specialist", issuer: "Cisco", year: "2025" },
  { name: "Endpoint Security", full: "Endpoint Security Specialist", issuer: "Cisco", year: "2025" },
  { name: "HCIA", full: "HCIA-Datacom", issuer: "Huawei ICT Academy", year: "2024" },
  { name: "SC-900", full: "Security, Compliance & Identity", issuer: "Microsoft", year: "2024" },
  { name: "Security Engineer", full: "Cyber Shujaa Security Engineer", issuer: "Cyber Shujaa & Microsoft ADC", year: "2024" },
];

const CAPABILITIES = [
  {
    area: "Offensive",
    detail:
      "Full-lifecycle penetration testing across web, mobile, and API surfaces. Authorization flaws, attack chaining, CVE research against deployed versions, and legacy binary analysis where no source is available.",
  },
  {
    area: "Network & infrastructure",
    detail:
      "MikroTik RouterOS and Cisco environments, link aggregation, segmentation design, firewall assessment, satellite and wireless distribution, and zero-trust overlay networks.",
  },
  {
    area: "Assurance & audit",
    detail:
      "Systems auditing on production infrastructure, digital QA ownership for a mobile application, structured staff interviews as a technical control, and operational data analysis that produces financial findings.",
  },
  {
    area: "Build",
    detail:
      "Full-stack delivery on React and Node, workflow orchestration with n8n, serverless services on Cloudflare Workers and Firebase, and Bash systems work on Linux.",
  },
];

const EARLIER = [
  { role: "Information Security Intern", org: "NACOSTI — Presidential DigiTalent Program" },
  { role: "Quality Control Technician (Intern)", org: "JKUAT Industrial Park" },
  { role: "Internal Attaché", org: "JKUAT ICT Labs" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title={PROFILE.name}
            comment={`${PROFILE.location} — goes by ${PROFILE.alias}`}
            standfirst="Security practitioner, network engineer, and ISP operator. The through line across all of it is that the offensive work and the operational work inform each other, and neither stands on its own."
          />

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Current work
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {ROLES.map((role) => (
                <div
                  key={role.title}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <h3 className="font-semibold text-foreground">{role.title}</h3>
                  <p className="text-xs text-primary font-mono mt-1 mb-3">
                    {role.org}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {role.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              What he does
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {CAPABILITIES.map((item) => (
                <div
                  key={item.area}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.area}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Education & certification
            </h2>
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 mb-6">
              <h3 className="font-semibold text-foreground">
                B.Sc. Computer Technology
              </h3>
              <p className="text-xs text-primary font-mono mt-1">
                Jomo Kenyatta University of Agriculture and Technology — 2024
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Second Class Upper Division
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.name}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-4"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-mono text-sm font-bold text-primary leading-tight">
                      {cert.name}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-snug">
                    {cert.full}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-1.5">
                    {cert.issuer} · <span className="figure-num">{cert.year}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Programs & training academies
            </h2>
            <p className="text-muted-foreground font-mono text-sm mb-6">
              {"// Where the certifications actually came from"}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {PROGRAMS.map((prog) => (
                <div
                  key={prog.name}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <h3 className="font-semibold text-foreground">{prog.name}</h3>
                  <p className="text-xs text-primary font-mono mt-1 mb-3">
                    {prog.org}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prog.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Earlier roles
            </h2>
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 max-w-3xl">
              <ul className="space-y-3">
                {EARLIER.map((item) => (
                  <li
                    key={item.role}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                  >
                    <span className="text-sm text-foreground">{item.role}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {item.org}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-5 pt-5 border-t border-border/50">
                The full history, with detail, is on the{" "}
                <Link
                  href="/resume"
                  className="text-primary hover:underline cursor-pointer"
                >
                  resume page
                </Link>
                .
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Get in touch
            </h2>
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 max-w-3xl space-y-4">
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-mono">{PROFILE.email}</span>
              </a>
              <a
                href={`mailto:${PROFILE.emailAlt}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-mono">{PROFILE.emailAlt}</span>
              </a>
              <a
                href={`tel:${PROFILE.phone.replace(/[^+0-9]/g, "")}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-mono figure-num">
                  {PROFILE.phone}
                </span>
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Linkedin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-mono">george-wanyoike</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-mono">{PROFILE.location}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
