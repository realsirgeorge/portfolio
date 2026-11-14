export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: "ctf" | "security" | "tutorial" | "network";
  tags: string[];
  excerpt: string;
  readTime: string;
  featured: boolean;
  content: string;
  /** Drafts are hidden from the public site and listed only in the admin. */
  draft?: boolean;
}

export const categories = [
  { value: "all", label: "All Posts" },
  { value: "ctf", label: "CTF Writeups" },
  { value: "security", label: "Security Articles" },
  { value: "tutorial", label: "Tutorials" },
  { value: "network", label: "Network Engineering" },
];
