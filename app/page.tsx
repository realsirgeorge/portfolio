import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { OverlapSection } from "@/components/overlap-section";
import { EngagementRow } from "@/components/engagement-row";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ENGAGEMENTS } from "@/lib/portfolio-data";

export default function HomePage() {
  const featured = ENGAGEMENTS.filter((e) => e.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main">
        <HeroSection />
        <OverlapSection />

        {/* Selected work */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Selected work
                </h2>
                <p className="text-muted-foreground font-mono text-sm">
                  {"// Anonymized by contract, technical substance intact"}
                </p>
              </div>
              <Link
                href="/work"
                className="text-sm text-primary hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                All engagements
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((engagement) => (
                <EngagementRow key={engagement.slug} engagement={engagement} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Available for authorized security work
              </h2>
              <p className="text-muted-foreground font-mono text-sm mb-4">
                {"// Signed agreement, non-destructive rules of engagement"}
              </p>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mb-6">
                Penetration testing, security audits, and assurance
                engagements. Also available for network and platform build
                work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-card hover:text-primary"
                >
                  <Link href="/contact">Start a conversation</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-border hover:bg-muted/50 bg-transparent"
                >
                  <Link href="/resume">Read the CV</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
