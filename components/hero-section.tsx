"use client";

import Link from "next/link";
import { Github, Linkedin, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypingAnimation } from "@/components/typing-animation";
import { TerminalWindow } from "@/components/terminal-window";
import { PROFILE, PROOF_POINTS } from "@/lib/portfolio-data";

const roles = [
  "Security Practitioner",
  "Penetration Tester",
  "ISP Founder & Operator",
  "Network Engineer",
];

/* Every line below is drawn from real engagement data. */
const terminalLines = [
  { type: "command" as const, content: "whoami", delay: 700 },
  {
    type: "output" as const,
    content: "george_wanyoike — breaks systems, then builds them",
    delay: 400,
  },
  { type: "command" as const, content: "cat engagements/university-audit", delay: 600 },
  { type: "output" as const, content: "34 findings across 7 subdomains", delay: 250 },
  { type: "output" as const, content: "11 critical  16 high  5 medium  2 low", delay: 250 },
  { type: "output" as const, content: "CVE-2024-21762 (CVSS 9.6) on SSL-VPN", delay: 250 },
  { type: "command" as const, content: "tailscale status --net anga", delay: 600 },
  { type: "output" as const, content: "anga-networks   online   multi-site", delay: 200 },
  { type: "output" as const, content: "RouterOS API    ok       9 workflows", delay: 200 },
];

const socialLinks = [
  { href: PROFILE.github, icon: Github, label: "GitHub" },
  { href: PROFILE.linkedin, icon: Linkedin, label: "LinkedIn" },
  { href: PROFILE.anga, icon: ExternalLink, label: "Anga Networks" },
];

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-primary font-mono text-sm tracking-wider">
                {"// A security practitioner who builds the systems he breaks"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                {PROFILE.name}
              </h1>
              <div className="h-8 sm:h-10">
                <TypingAnimation
                  texts={roles}
                  className="text-xl sm:text-2xl text-muted-foreground font-mono"
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={2500}
                />
              </div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              {PROFILE.statement}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-card hover:text-primary"
              >
                <Link href="/work">
                  View Engagements
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-border hover:bg-muted/50 bg-transparent"
              >
                <Link href="/resume">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </Link>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Terminal Animation */}
          <div className="lg:pl-8">
            <TerminalWindow
              lines={terminalLines}
              title="george@kali:~"
              interactive
              prompt="george@kali:~$"
              className="shadow-2xl shadow-primary/5"
            />

            {/* Proof points — each figure links to the evidence behind it */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {PROOF_POINTS.map((point) => (
                <Link
                  key={point.href}
                  href={point.href}
                  className="p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm text-center hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="figure-num text-2xl font-bold text-primary">
                    {point.value}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">
                    {point.unit}
                  </div>
                  <div className="text-[0.6875rem] text-muted-foreground/80 mt-1 leading-snug">
                    {point.qualifier}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
