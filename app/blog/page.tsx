import { Suspense } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BlogList } from "@/components/blog-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writeups drawn from engagements, CTF notes, tooling posts, and network engineering guides.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        {/* Header is server-rendered so it survives the Suspense boundary */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Blog
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                  {"// Writeups from engagements, CTF notes & tooling posts"}
                </p>
              </div>
              <Link
                href="/admin/login"
                className="px-3 py-1.5 rounded-md border border-border/50 text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer shrink-0"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <p className="text-muted-foreground font-mono text-sm">
                  Loading blog posts...
                </p>
              </div>
            </div>
          }
        >
          <BlogList />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
