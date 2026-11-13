import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, ChevronRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { LIBRARY_TOOLS, TOOLCHAIN, STANDARDS } from "@/lib/lab-data";

export const metadata: Metadata = {
  title: "Library",
  description:
    "The engagement methodology, encoded as reusable tooling. Security operations skills, scripting patterns, and agent definitions.",
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="The Library"
            comment="Methodology, encoded and reusable"
            standfirst="The process he runs, written down in a form that executes. Formalizing your own methodology into reusable tooling is the difference between doing the work and being able to hand it to someone else."
          />

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Built tooling
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {LIBRARY_TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Terminal className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-primary">
                        {tool.name}
                      </h3>
                      <p className="figure-num text-xs text-muted-foreground">
                        {tool.scale}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    {tool.summary}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Working toolchain
            </h2>
            <p className="text-muted-foreground font-mono text-sm mb-6">
              {"// What each tool is for, not a logo wall"}
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {TOOLCHAIN.map((group) => (
                <div
                  key={group.group}
                  className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4">
                    {group.group}
                  </h3>
                  <ul className="space-y-3">
                    {group.tools.map((tool) => (
                      <li key={tool.name}>
                        <span className="font-mono text-sm text-primary">
                          {tool.name}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                          {tool.use}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="text-primary font-mono">{">"}</span>
              Standards
            </h2>
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-6 max-w-3xl">
              <ul className="space-y-3">
                {STANDARDS.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2"
                  >
                    <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-8 max-w-3xl">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Writing
              </h2>
              <p className="text-muted-foreground font-mono text-sm mb-4">
                {"// Writeups, CTF notes & tooling posts"}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Technical writeups drawn from the engagements, plus CTF notes
                and tooling posts.
              </p>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-card hover:text-primary"
              >
                <Link href="/blog">Read the writeups</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
