"use client";

import React from "react"

import { useState } from "react";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  MapPin,
  Phone,
  ExternalLink,
  Key,
  MessageSquare,
} from "lucide-react";
import { PROFILE } from "@/lib/portfolio-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/realsirgeorge/",
    icon: Github,
    username: "@realsirgeorge",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/george-wanyoike/",
    icon: Linkedin,
    username: "George Wanyoike Njoroge",
  },
  {
    name: "Anga Networks",
    href: PROFILE.anga,
    icon: ExternalLink,
    username: "The ISP he owns and operates",
  },
];

export function ContactForm() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });

    // Reset submitted state after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Contact
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          {"// Authorized security work, network builds & collaboration"}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Available for authorized penetration testing, security audits,
              and assurance engagements, as well as network and platform build
              work. Engagements run under signed agreement with non-destructive
              rules of engagement by default.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {PROFILE.email}
                  </a>
                  <a
                    href={`mailto:${PROFILE.emailAlt}`}
                    className="block text-muted-foreground text-sm hover:text-primary transition-colors mt-0.5"
                  >
                    {PROFILE.emailAlt}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${PROFILE.phone.replace(/[^+0-9]/g, "")}`}
                    className="figure-num text-foreground hover:text-primary transition-colors"
                  >
                    {PROFILE.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-foreground">{PROFILE.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Connect Online
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-foreground">{link.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {link.username}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* PGP Key */}
          <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              Secure Communication
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              For sensitive communications, you can use my PGP public key:
            </p>
            <div className="p-3 rounded bg-muted/30 border border-border/50">
              <code className="text-xs font-mono text-muted-foreground break-all">
                Fingerprint: 1234 5678 9ABC DEF0 1234 5678 9ABC DEF0 1234 5678
              </code>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-border hover:border-primary/50 hover:text-primary bg-transparent"
            >
              Download PGP Key
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />
            Send a Message
          </h2>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground">
                Thanks for reaching out. {"I'll"} get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-muted/30 border-border/50 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="bg-muted/30 border-border/50 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground">
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  required
                  className="bg-muted/30 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows={6}
                  required
                  className="bg-muted/30 border-border/50 focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-card hover:text-primary"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">...</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
