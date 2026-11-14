import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, RESUME_PROGRAMS } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Experience, education and certifications of George Wanyoike Njoroge: founder of Knight Labs, security practitioner, network engineer and ISP operator.",
  alternates: { canonical: "/resume" },
};

const CV_PATH = "/GEORGEWANYOIKE - CV.pdf";

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title="Experience and qualifications"
        standfirst={
          <p>
            A security practitioner who builds the systems he breaks. Runs
            full-lifecycle offensive engagements, from reconnaissance through
            exploitation to client reporting under NDA, and then builds the
            defensive and operational systems that answer those findings.
          </p>
        }
      >
        <a href={encodeURI(CV_PATH)} download="George_Wanyoike_Njoroge_CV.pdf" className="btn btn-primary">
          <Download className="h-4 w-4" aria-hidden="true" />
          Download the PDF
        </a>
      </PageHeader>

      <section className="container-page">
        <SectionHeading index="01" title="Experience" />
        <ol>
          {EXPERIENCE.map((job) => (
            <li key={job.title + job.company} className="reveal grid gap-4 border-t border-border py-8 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="eyebrow mono-num">{job.period}</p>
                <p className="mt-2 text-sm text-muted-foreground">{job.location}</p>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-2xl text-foreground">{job.title}</h3>
                <p className="mt-1 text-primary">
                  {job.company}
                  {job.program && <span className="text-muted-foreground"> · {job.program}</span>}
                </p>
                <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{job.description}</p>
                <ul className="mt-4 max-w-3xl list-disc space-y-1.5 pl-5 text-foreground/85 marker:text-primary">
                  {job.achievements.map((a) => (
                    <li key={a} className="leading-relaxed">{a}</li>
                  ))}
                </ul>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Skills">
                  {job.technologies.map((t) => (
                    <li key={t} className="tag">{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pt-20 sm:pt-28">
        <SectionHeading index="02" title="Certifications" />
        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.name} className="bg-card p-5">
              <p className="eyebrow mono-num">{cert.year}</p>
              <h3 className="mt-2 font-display text-xl text-foreground">{cert.fullName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{cert.issuer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page grid gap-16 pt-20 sm:pt-28 md:grid-cols-2">
        <div>
          <SectionHeading index="03" title="Education" />
          {EDUCATION.map((edu) => (
            <div key={edu.degree} className="border-t border-border py-6">
              <p className="eyebrow mono-num">{edu.period}</p>
              <h3 className="mt-2 font-display text-2xl text-foreground">{edu.degree}</h3>
              <p className="mt-1 text-primary">{edu.institution}</p>
              <p className="mt-2 text-muted-foreground">{edu.details}</p>
            </div>
          ))}
        </div>
        <div>
          <SectionHeading index="04" title="Programmes and academies" />
          <ul>
            {RESUME_PROGRAMS.map((prog) => (
              <li key={prog.name} className="border-t border-border py-5">
                <h3 className="font-display text-xl text-foreground">{prog.name}</h3>
                <p className="mt-1 text-sm text-primary">{prog.org}</p>
                <p className="mt-2 leading-relaxed text-muted-foreground">{prog.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
