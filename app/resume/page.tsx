import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ResumeContent } from "@/components/resume-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | George Wanyoike Njoroge - Cybersecurity Specialist",
  description:
    "Professional resume and experience of George Wanyoike Njoroge, cybersecurity specialist with expertise in penetration testing, network security, and threat analysis.",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <ResumeContent />
      </main>
      <Footer />
    </div>
  );
}
