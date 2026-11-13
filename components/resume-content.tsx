"use client";

import {
  Download,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const experience = [
  {
    title: "Digital Platforms Assurance",
    company: "National airport parking services operator",
    location: "Nairobi, Kenya",
    period: "2025 – Present",
    description:
      "Own digital quality assurance for the mobile application, run mobile and web penetration testing across the organization's digital platforms, and perform systems auditing on production infrastructure. Scope has recently expanded into development and IoT work.",
    achievements: [
      "Run mobile and web penetration testing across the organization's digital platforms",
      "Own digital QA for the mobile application across release cycles",
      "Perform systems auditing on production infrastructure",
      "Identified an estimated KES 8.28M in revenue loss through analysis of 297+ vehicle plate records, with roughly 73% traced to a single submitter group",
      "Scope extended into development and IoT delivery work",
    ],
    technologies: [
      "Mobile Application Security",
      "Web Penetration Testing",
      "Systems Auditing",
      "Digital QA",
      "IoT",
    ],
  },
  {
    title: "Founder and Operator",
    company: "Anga Networks",
    location: "Nairobi, Kenya",
    period: "April 2024 – Present",
    description:
      "Own and operate an ISP running MikroTik and RouterOS infrastructure across multiple sites in Kenya, carrying real uptime obligations for paying residential and business customers. Responsible for the network, the automation layer, the commercial side, and the on-call.",
    achievements: [
      "Deployed LACP 802.3ad link aggregation across multiple interfaces for bandwidth aggregation",
      "Built an ISP management platform with n8n as the orchestration layer, the RouterOS REST API for device control, and Evolution API for WhatsApp customer notifications — nine workflows, with the activity logger shipped as an importable n8n package",
      "Chose Google Sheets as a deliberately lightweight database, right-sized to the operation rather than over-built",
      "Migrated the estate from Twingate to Tailscale, configuring MagicDNS and subnet routers for zero-trust remote access",
      "Field-deployed Starlink backhaul and wireless distribution systems across sites",
      "Reduced installation turnaround and minimized downtime through proactive monitoring and signal optimization",
    ],
    technologies: [
      "MikroTik RouterOS",
      "LACP 802.3ad",
      "n8n Orchestration",
      "Evolution API",
      "Tailscale / MagicDNS",
      "Starlink & Wireless Distribution",
    ],
  },
  {
    title: "Information Security Intern",
    company: "National Commission for Science, Technology and Innovation",
    program: "Presidential DigitaLent Program - ICT Authority",
    location: "Nairobi, Kenya",
    period: "January 2025 – January 2026",
    description:
      "Monitor network uptime, system integrity, and user access logs to ensure secure and reliable IT operations. Execute hardware servicing, repairs, and network configurations to maintain optimal system performance.",
    achievements: [
      "Conduct network infrastructure assessments, hardware audits, and support firewall review planning",
      "Manage controlled penetration testing initiatives",
      "Operate and maintain audio-visual systems and other technologies during meetings",
      "Perform routine system maintenance including application troubleshooting, workstation resets, and peripheral setup",
      "Document weekly technical reports to ensure activity traceability and support management decision-making",
      "Assisted in developing organizational IT policy (AUT) and Business Process Reengineering documents",
    ],
    technologies: [
      "Network Security",
      "Penetration Testing",
      "Firewall Configuration",
      "System Administration",
      "Hardware Maintenance",
    ],
  },
  {
    title: "Quality Control Technician (Intern)",
    company: "JKUAT Industrial Park Ltd.",
    location: "Nairobi, Kenya",
    period: "July 2023 – September 2023",
    description:
      "Conducted real-time quality inspections on the Taifa Tablet assembly line, examining internal components and identifying defective parts to prevent faulty units from reaching production.",
    achievements: [
      "Performed warranty repairs and diagnostics on Taifa Tablets and IT devices",
      "Troubleshot hardware issues and restored optimal performance",
      "Supported secure data sanitization protocols for end-of-life devices",
      "Ensured compliance with organizational disposal policies",
    ],
    technologies: [
      "Hardware Diagnostics",
      "Quality Control",
      "Data Sanitization",
      "Device Repair",
    ],
  },
  {
    title: "Internal Attaché",
    company: "JKUAT ICT LABS – JKUAT Main Campus",
    location: "Nairobi, Kenya",
    period: "May 2022 – August 2022",
    description:
      "Diagnosed and resolved network infrastructure issues across campus, maintaining seamless connectivity for faculty and students.",
    achievements: [
      "Performed routine maintenance on lab hardware including workstations, switches, and routers",
      "Ensured network reliability through proactive maintenance",
      "Configured and deployed new devices according to organizational standards and security requirements",
      "Troubleshot workstation issues and provided timely technical support",
      "Contributed to reduced system downtime",
    ],
    technologies: [
      "Network Infrastructure",
      "Cisco Equipment",
      "System Configuration",
      "Technical Support",
    ],
  },
];

const education = [
  {
    degree: "B.Sc. Computer Technology",
    institution: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    period: "2020 – 2024",
    details: "Graduated with Second Class Upper Division",
  },
];

const programs = [
  {
    name: "Cyber Shujaa",
    org: "Serianu, USIU-Africa & Microsoft ADC",
    detail:
      "Cybersecurity skilling program — completed the Security Engineer track alongside the Microsoft Africa Development Center.",
  },
  {
    name: "ICT Authority Smart Academy",
    org: "Government of Kenya — ICT Authority",
    detail:
      "Digital and cybersecurity skills under the Training 20 Million Citizens initiative: information security, cyber resilience, and digital-risk fundamentals.",
  },
  {
    name: "Huawei ICT Academy",
    org: "Huawei",
    detail:
      "Datacom networking training leading to HCIA-Datacom — routing, switching, and enterprise network fundamentals.",
  },
  {
    name: "Cisco Networking Academy",
    org: "Cisco NetAcad",
    detail:
      "Source of the Cisco track: CCNA, CyberOps Associate, Network Defence, and Endpoint Security.",
  },
];

const certifications = [
  {
    name: "CC",
    fullName: "Certified in Cybersecurity",
    issuer: "ISC²",
    year: "2024",
  },
  {
    name: "SC-900",
    fullName: "Security, Compliance, and Identity Fundamentals",
    issuer: "Microsoft",
    year: "2024",
  },
  {
    name: "Security Engineer",
    fullName: "Cyber Shujaa Security Engineer",
    issuer: "Cyber Shujaa & Microsoft Africa Development Center",
    year: "2024",
  },
  {
    name: "HCIA",
    fullName: "Huawei Certified ICT Associate - Datacom",
    issuer: "Huawei ICT Academy",
    year: "2024",
  },
  {
    name: "CyberOps",
    fullName: "CyberOps Associate",
    issuer: "Cisco Networking Academy",
    year: "2024",
  },
  {
    name: "CCNA - Completion",
    fullName: "Cisco Certified Network Associate",
    issuer: "Cisco Networking Academy",
    year: "2024",
  },
  {
    name: "Endpoint Security",
    fullName: "Endpoint Security Specialist",
    issuer: "Cisco Networking Academy",
    year: "2025",
  },
  {
    name: "Network Defence",
    fullName: "Network Defence Specialist",
    issuer: "Cisco Networking Academy",
    year: "2025",
  },
];

export function ResumeContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Online Resume
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {"// Professional experience & qualifications"}
          </p>
        </div>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-card hover:text-primary w-fit"
        >
          <a
            href="/GEORGEWANYOIKE - CV.pdf"
            download="George_Wanyoike_Njoroge_CV.pdf"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </a>
        </Button>
      </div>

      {/* Summary */}
      <section className="mb-12 p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-primary font-mono">{">"}</span>
          Professional Summary
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          A security practitioner who builds the systems he breaks. Runs full-lifecycle offensive engagements — reconnaissance through exploitation through client reporting under NDA — and then builds the defensive and operational systems that answer those findings. Most recent audit work delivered 34 findings, 11 of them critical, across a full-scope university assessment covering web applications, a perimeter firewall, a legacy ERP binary, and the human layer. Owns and operates Anga Networks, an ISP on MikroTik and RouterOS infrastructure across multiple Kenyan sites, which means every security opinion here has been paid for operationally. Certified by ISC², Cisco, Huawei, Microsoft, and Cyber Shujaa. Active on Hack The Box, TryHackMe, and picoCTF.
        </p>
      </section>

      {/* Experience */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Work Experience
        </h2>
        <div className="space-y-6">
          {experience.map((job, index) => (
            <div
              key={index}
              className="relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
              <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-foreground">{job.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Calendar className="w-3 h-3" />
                    {job.period}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-3">
                  <span className="text-primary">{job.company}</span>
                  {job.program && (
                    <span className="text-xs text-muted-foreground/80 italic">
                      {job.program}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {job.description}
                </p>
                <ul className="space-y-1 mb-4">
                  {job.achievements.map((achievement, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">-</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-mono rounded bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Education
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {education.map((edu, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-foreground mb-1">
                {edu.degree}
              </h3>
              <p className="text-primary text-sm mb-1">{edu.institution}</p>
              <p className="text-xs text-muted-foreground font-mono mb-2">
                {edu.period}
              </p>
              <p className="text-sm text-muted-foreground">{edu.details}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs & Training Academies */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          Programs & Training Academies
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {programs.map((prog, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-foreground mb-1">{prog.name}</h3>
              <p className="text-primary text-sm mb-2">{prog.org}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prog.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Certifications
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-mono text-xs font-bold">
                    {cert.name.slice(0, 3)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{cert.year}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{cert.fullName}</p>
              <p className="text-xs text-primary mt-1">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
