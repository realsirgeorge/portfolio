import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/page-header";
import { LIBRARY_TOOLS, TOOLCHAIN, STANDARDS } from "@/lib/lab-data";

export const metadata: Metadata = {
  title: "Library",
  description:
    "The engagement methodology, encoded as reusable tooling: security operations, scripting patterns and agent definitions, plus the working toolchain.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Library"
        title="Methodology, written down in a form that runs"
        standfirst={
          <p>
            Formalising your own process into reusable tooling is the
            difference between doing the work and being able to hand it to
            someone else. These are the references I actually run engagements
            from.
          </p>
        }
      />

      <section className="container-page">
        <SectionHeading index="01" title="Built tooling" />
        <ul className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {LIBRARY_TOOLS.map((tool) => (
            <li key={tool.name} className="bg-card p-6 sm:p-8">
              <p className="font-mono text-lg text-primary">{tool.name}</p>
              <p className="eyebrow mono-num mt-1">{tool.scale}</p>
              <p className="mt-5 font-display text-xl leading-snug text-foreground">{tool.summary}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{tool.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <SectionHeading index="02" title="Working toolchain" note="What each tool is for, not a logo wall." />
        <div className="grid gap-10 md:grid-cols-3">
          {TOOLCHAIN.map((group) => (
            <div key={group.group} className="reveal">
              <h3 className="eyebrow mb-4 text-foreground">{group.group}</h3>
              <dl>
                {group.tools.map((tool) => (
                  <div key={tool.name} className="border-t border-border py-3">
                    <dt className="font-medium text-foreground">{tool.name}</dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{tool.use}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <SectionHeading index="03" title="Standards" />
        <ol className="max-w-3xl">
          {STANDARDS.map((item, i) => (
            <li key={item} className="flex gap-5 border-t border-border py-5">
              <span className="figure-num text-2xl leading-none text-primary">{i + 1}</span>
              <p className="leading-relaxed text-foreground/90">{item}</p>
            </li>
          ))}
        </ol>
        {/* TODO(owner): a reading list (books, papers, standards you recommend)
            would fit here. Nothing in the repo lists one yet. */}
      </section>

      <section className="container-page pt-16 sm:pt-24">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <p className="eyebrow">Writing</p>
          <p className="mt-3 max-w-2xl font-display text-2xl leading-snug text-foreground">
            Technical writeups drawn from the engagements, plus CTF notes and
            tooling posts.
          </p>
          <Link href="/blog" className="btn btn-primary mt-6">
            Read the writing
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
