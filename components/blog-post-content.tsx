"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog-types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    ctf: "bg-red-500/10 text-red-400 border-red-500/20",
    security: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    tutorial: "bg-green-500/10 text-green-400 border-green-500/20",
    network: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };
  return colors[category] || "bg-muted text-muted-foreground";
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ctf: "CTF Writeup",
    security: "Security",
    tutorial: "Tutorial",
    network: "Network",
  };
  return labels[category] || category;
}

function MarkdownRenderer({ content }: { content: string }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 scroll-mt-24">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 scroll-mt-24">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3 scroll-mt-24">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">
              {children}
            </h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {children}
            </p>
          ),
          // Code (inline code only - block code is handled by pre component)
          code: ({ className, children, ...props }) => {
            return (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Pre (code block wrapper)
          pre: ({ children }) => {
            // Extract code content and language from children
            const codeElement = React.Children.toArray(children).find(
              (child): child is React.ReactElement => 
                React.isValidElement(child) && child.type === 'code'
            );
            
            if (!codeElement) {
              return <pre className="p-4 overflow-x-auto bg-muted/30 rounded-lg my-4">{children}</pre>;
            }

            // Type assertion for props
            const props = codeElement.props as { className?: string; children?: React.ReactNode };
            const className = props.className || '';
            const match = /language-(\w+)/.exec(className);
            const language = match ? match[1] : 'text';
            const codeString = String(props.children || '').replace(/\n$/, '');
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

            return (
              <div className="my-6 rounded-lg border border-border/50 bg-muted/30 overflow-hidden not-prose">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/50">
                  <span className="text-xs font-mono text-muted-foreground">
                    {language}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => handleCopyCode(codeString, codeId)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copiedCode === codeId ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  {children}
                </pre>
              </div>
            );
          },
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline cursor-pointer"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="w-full rounded-lg shadow-md my-6 border border-border"
            />
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">
              {children}
            </li>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-muted/30 py-2">
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-muted-foreground">
              {children}
            </td>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-8 border-border/50" />
          ),
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic">
              {children}
            </em>
          ),
          // Strikethrough (from remark-gfm)
          del: ({ children }) => (
            <del className="line-through text-muted-foreground/70">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const [copied, setCopied] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  // Set current URL after hydration to avoid mismatch
  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // Fetch related posts from API
  React.useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch(`/api/blog/related?slug=${post.slug}&limit=2`);
        if (response.ok) {
          const data = await response.json();
          setRelatedPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    fetchRelatedPosts();
  }, [post.slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={cn(
              "px-2 py-1 text-xs font-mono rounded border",
              getCategoryColor(post.category)
            )}
          >
            {getCategoryLabel(post.category)}
          </span>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-mono rounded-full bg-muted text-muted-foreground flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share:
          </span>
          <a
            href={currentUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={(e) => !currentUrl && e.preventDefault()}
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href={currentUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={(e) => !currentUrl && e.preventDefault()}
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-xs text-primary">Link copied!</span>
          )}
        </div>
      </header>

      {/* Article Content */}
      <article className="mb-16">
        <MarkdownRenderer content={post.content} />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pt-8 border-t border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Related Posts
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="p-4 rounded-lg border border-border/50 bg-card/30 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-mono rounded border inline-block mb-2",
                    getCategoryColor(relatedPost.category)
                  )}
                >
                  {getCategoryLabel(relatedPost.category)}
                </span>
                <h3 className="font-medium text-foreground mb-1 line-clamp-2">
                  {relatedPost.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {relatedPost.readTime}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
