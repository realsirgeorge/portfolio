import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | George Wanyoike Njoroge - Cybersecurity Specialist",
  description:
    "Get in touch with George Wanyoike Njoroge for cybersecurity consulting, penetration testing, or collaboration opportunities.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
