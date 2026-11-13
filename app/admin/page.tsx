"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import {
  Upload,
  LogOut,
  FileText,
  Eye,
  Loader2,
  Calendar,
  Tag,
  FileCode,
  Trash2,
  FileDown,
  Info,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

// Frontmatter data interface
interface FrontmatterData {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  readTime?: string;
  excerpt?: string;
  [key: string]: unknown;
}

// Simple frontmatter parser for client-side preview
function parseFrontmatter(content: string): { data: FrontmatterData; content: string } {
  if (!content.startsWith("---")) {
    return { data: {}, content };
  }

  const endIndex = content.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    return { data: {}, content };
  }

  const frontmatter = content.slice(4, endIndex);
  const body = content.slice(endIndex + 5);

  // Simple YAML-like parsing (basic key-value pairs)
  const data: FrontmatterData = {};
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/bb6b65b1-634c-40bd-9652-b0ebb50ba0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:39',message:'Before parsing frontmatter',data:{frontmatterLength:frontmatter.length,frontmatterPreview:frontmatter.slice(0,100)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H5'})}).catch(()=>{});
  // #endregion
  frontmatter.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value: string | boolean | string[] = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle boolean values
      if (value === "true") value = true;
      if (value === "false") value = false;
      
      // Handle arrays (simple case)
      if (typeof value === 'string' && value.startsWith("[") && value.endsWith("]")) {
        value = value.slice(1, -1).split(",").map(v => v.trim().replace(/['"]/g, ""));
      }
      
      data[key] = value;
    }
  });
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/bb6b65b1-634c-40bd-9652-b0ebb50ba0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:65',message:'After parsing frontmatter',data:{parsedKeys:Object.keys(data),dataStructure:JSON.stringify(data),titleValue:data.title,titleType:typeof data.title},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2,H5'})}).catch(()=>{});
  // #endregion

  return { data, content: body };
}

interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  isMarkdown?: boolean; // Flag to indicate if post is a markdown file
}

export default function AdminPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [previewData, setPreviewData] = useState<{data: FrontmatterData, content: string} | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{slug: string; title: string} | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateContent, setTemplateContent] = useState<string>("");
  const [templateViewMode, setTemplateViewMode] = useState<"raw" | "preview">("raw");

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    loadPosts();
  }, []);

  // Update preview when content changes
  useEffect(() => {
    if (markdownContent) {
      try {
        const parsed = parseFrontmatter(markdownContent);
        setPreviewData({ data: parsed.data, content: parsed.content });
      } catch {
        setPreviewData(null);
      }
    } else {
      setPreviewData(null);
    }
  }, [markdownContent]);

  const checkAuth = async () => {
    try {
      // Try to access a protected endpoint
      const response = await fetch("/api/admin/list-posts");
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/admin/login");
      }
    } catch {
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  };

  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch("/api/admin/list-posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadTemplate = async () => {
    try {
      const response = await fetch("/api/admin/template");
      if (response.ok) {
        const content = await response.text();
        setTemplateContent(content);
      } else {
        // Fallback: use a default template if file not found
        const defaultTemplate = `---
slug: "your-post-slug"
title: "Your Post Title"
date: "2025-02-01"
category: "ctf"
tags:
  - "CTF"
  - "Security"
excerpt: "Brief description for blog card (150-200 characters)"
readTime: "10 min"
featured: false
---

## Introduction

Your blog post content starts here.

## Main Content

Write your content using markdown...

## Conclusion

End your post here.`;
        setTemplateContent(defaultTemplate);
        toast.error("Failed to load template, using default");
      }
    } catch (error) {
      console.error("Failed to load template:", error);
      toast.error("Failed to load template");
    }
  };

  const handleTemplateModalOpen = (open: boolean) => {
    setTemplateModalOpen(open);
    if (open && !templateContent) {
      loadTemplate();
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([templateContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "_TEMPLATE.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  const handleCopyToEditor = () => {
    setMarkdownContent(templateContent);
    setTemplateModalOpen(false);
    toast.success("Template copied to editor!");
  };

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith(".md")) {
      toast.error("File must be a .md file");
      return;
    }

    setSelectedFile(file);
    const text = await file.text();
    setMarkdownContent(text);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!markdownContent.trim()) {
      toast.error("Please provide markdown content");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("content", markdownContent);
      }

      const response = await fetch("/api/admin/upload-blog", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Upload failed");
        setIsUploading(false);
        return;
      }

      toast.success(`Post "${data.slug}" uploaded successfully!`);

      // Clear form
      setMarkdownContent("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload posts list
      loadPosts();
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteClick = (slug: string, title: string) => {
    setDeleteConfirm({ slug, title });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    const { slug } = deleteConfirm;
    setDeletingSlug(slug);
    setDeleteConfirm(null);

    try {
      const response = await fetch("/api/admin/delete-blog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to delete post");
        setDeletingSlug(null);
        return;
      }

      toast.success(`Post "${slug}" deleted successfully!`);

      // Reload posts list
      loadPosts();
    } catch {
      toast.error("An error occurred while deleting the post.");
    } finally {
      setDeletingSlug(null);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Admin Panel
              </h1>
              <p className="text-muted-foreground font-mono text-sm">
                {"Manage blog posts."}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-border hover:border-primary/50 hover:text-primary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* File Upload Section */}
          <div className="mb-8 p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Blog Post
              </h2>
              <Dialog open={templateModalOpen} onOpenChange={handleTemplateModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-border hover:border-primary/50 hover:text-primary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="!w-[80vw] !max-w-[80vw] sm:!max-w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Blog Post Template
                    </DialogTitle>
                    <DialogDescription>
                      Use this template as a starting point for your blog posts. All required fields are marked below.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Required Fields Info */}
                  <div className="mb-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Required Frontmatter Fields:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          <li><code className="text-primary">slug</code> - URL-friendly identifier (required)</li>
                          <li><code className="text-primary">title</code> - Post title (required)</li>
                          <li><code className="text-primary">date</code> - Publication date in YYYY-MM-DD format (required)</li>
                          <li><code className="text-primary">category</code> - Post category (required)</li>
                          <li><code className="text-primary">tags</code> - Array of tags (required)</li>
                          <li><code className="text-primary">excerpt</code> - Brief description (150-200 chars, required)</li>
                          <li><code className="text-primary">readTime</code> - Estimated reading time (required)</li>
                          <li><code className="text-primary">featured</code> - Boolean for featured posts (required)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Template Preview Tabs */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab Buttons */}
                    <div className="flex gap-2 mb-2 border-b border-border/50">
                      <button
                        onClick={() => setTemplateViewMode("raw")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          templateViewMode === "raw"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Raw Markdown
                      </button>
                      <button
                        onClick={() => setTemplateViewMode("preview")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          templateViewMode === "preview"
                            ? "text-primary border-b-2 border-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Preview
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-auto border border-border/50 rounded-lg bg-card/30 p-4">
                      {templateViewMode === "raw" ? (
                        <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                          {templateContent || "Loading template..."}
                        </pre>
                      ) : (
                        <div className="min-h-[500px]">
                          {templateContent ? (() => {
                            const parsed = parseFrontmatter(templateContent);
                            return (
                              <div className="space-y-4">
                                <div className="pb-4 border-b border-border/50">
                                  <h3 className="text-xl font-bold text-foreground mb-2">
                                    {String(parsed.data.title || "Untitled")}
                                  </h3>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {parsed.data.date && (
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {String(parsed.data.date)}
                                      </span>
                                    )}
                                    {parsed.data.category && (
                                      <span className="flex items-center gap-1">
                                        <Tag className="w-3 h-3" />
                                        {String(parsed.data.category)}
                                      </span>
                                    )}
                                  </div>
                                  {parsed.data.excerpt && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {String(parsed.data.excerpt)}
                                    </p>
                                  )}
                                </div>
                                {/* Markdown Content Preview */}
                                {parsed.content && (
                                  <div className="markdown-preview prose prose-invert max-w-none">
                                    <ReactMarkdown
                                      remarkPlugins={[remarkGfm]}
                                      components={{
                                        // Style headings
                                        h1: ({ children }) => (
                                          <h1 className="text-2xl font-bold text-foreground mt-8 mb-4">
                                            {children}
                                          </h1>
                                        ),
                                        h2: ({ children }) => (
                                          <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
                                            {children}
                                          </h2>
                                        ),
                                        h3: ({ children }) => (
                                          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                                            {children}
                                          </h3>
                                        ),
                                        // Style paragraphs
                                        p: ({ children }) => (
                                          <p className="text-muted-foreground mb-4 leading-relaxed">
                                            {children}
                                          </p>
                                        ),
                                        // Style code blocks
                                        code: ({ className, children, ...props }) => {
                                          const isInline = !className;
                                          return isInline ? (
                                            <code
                                              className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground font-mono text-sm"
                                              {...props}
                                            >
                                              {children}
                                            </code>
                                          ) : (
                                            <code
                                              className="block p-4 rounded-lg bg-muted/30 border border-border/50 overflow-x-auto font-mono text-sm text-foreground"
                                              {...props}
                                            >
                                              {children}
                                            </code>
                                          );
                                        },
                                        pre: ({ children }) => (
                                          <pre className="my-4 p-0 bg-transparent">{children}</pre>
                                        ),
                                        // Style lists
                                        ul: ({ children }) => (
                                          <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 ml-4">
                                            {children}
                                          </ul>
                                        ),
                                        ol: ({ children }) => (
                                          <ol className="list-decimal list-inside mb-4 text-muted-foreground space-y-1 ml-4">
                                            {children}
                                          </ol>
                                        ),
                                        li: ({ children }) => (
                                          <li className="text-muted-foreground">{children}</li>
                                        ),
                                        // Style links
                                        a: ({ href, children }) => (
                                          <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline cursor-pointer"
                                          >
                                            {children}
                                          </a>
                                        ),
                                        // Style blockquotes
                                        blockquote: ({ children }) => (
                                          <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground">
                                            {children}
                                          </blockquote>
                                        ),
                                        // Style horizontal rules
                                        hr: () => (
                                          <hr className="my-6 border-border/50" />
                                        ),
                                        // Style images
                                        img: ({ src, alt }) => (
                                          <img
                                            src={src}
                                            alt={alt}
                                            className="rounded-lg my-4 border border-border/50 max-w-full"
                                          />
                                        ),
                                        // Style tables (from remark-gfm)
                                        table: ({ children }) => (
                                          <div className="overflow-x-auto my-4">
                                            <table className="min-w-full border-collapse border border-border/50">
                                              {children}
                                            </table>
                                          </div>
                                        ),
                                        thead: ({ children }) => (
                                          <thead className="bg-muted/30">{children}</thead>
                                        ),
                                        tbody: ({ children }) => <tbody>{children}</tbody>,
                                        tr: ({ children }) => (
                                          <tr className="border-b border-border/30">{children}</tr>
                                        ),
                                        th: ({ children }) => (
                                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border/30">
                                            {children}
                                          </th>
                                        ),
                                        td: ({ children }) => (
                                          <td className="px-4 py-2 text-sm text-muted-foreground border border-border/30">
                                            {children}
                                          </td>
                                        ),
                                      }}
                                    >
                                      {parsed.content}
                                    </ReactMarkdown>
                                  </div>
                                )}
                              </div>
                            );
                          })() : (
                            <p className="text-muted-foreground">Loading template...</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      onClick={handleCopyToEditor}
                      disabled={!templateContent}
                      className="border-border hover:border-primary/50 hover:text-primary"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Editor
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setTemplateModalOpen(false)}
                        className="border-border hover:border-primary/50 hover:text-primary"
                      >
                        Close
                      </Button>
                      <Button
                        onClick={handleDownloadTemplate}
                        disabled={!templateContent}
                        className="bg-primary text-primary-foreground hover:bg-card hover:text-primary"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors mb-4"
            >
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drag & drop a .md file here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-border hover:border-primary/50"
              >
                Select File
              </Button>
              {selectedFile && (
                <p className="mt-4 text-sm text-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Editor and Preview Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Text Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-primary" />
                  Editor
                </h2>
                <Label htmlFor="markdown-editor" className="text-xs text-muted-foreground">
                  Markdown Content
                </Label>
              </div>
              <Textarea
                id="markdown-editor"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="Paste or type markdown content here..."
                className="min-h-[500px] font-mono text-sm bg-muted/30 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Preview
              </h2>
              <div className="min-h-[500px] p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm overflow-auto">
                {previewData ? (
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-border/50">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {/* #region agent log */}
                        {(() => { fetch('http://127.0.0.1:7242/ingest/bb6b65b1-634c-40bd-9652-b0ebb50ba0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:381',message:'Rendering title',data:{title:previewData.data.title,titleType:typeof previewData.data.title,hasTitle:!!previewData.data.title},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H1,H3'})}).catch(()=>{}); return String(previewData.data.title || "Untitled"); })()}
                        {/* #endregion */}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {previewData.data.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {/* #region agent log */}
                            {(() => { fetch('http://127.0.0.1:7242/ingest/bb6b65b1-634c-40bd-9652-b0ebb50ba0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:387',message:'Rendering date',data:{date:previewData.data.date,dateType:typeof previewData.data.date},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{}); return String(previewData.data.date); })()}
                            {/* #endregion */}
                          </span>
                        )}
                        {previewData.data.category && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {/* #region agent log */}
                            {(() => { fetch('http://127.0.0.1:7242/ingest/bb6b65b1-634c-40bd-9652-b0ebb50ba0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:393',message:'Rendering category',data:{category:previewData.data.category,categoryType:typeof previewData.data.category},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{}); return String(previewData.data.category); })()}
                            {/* #endregion */}
                          </span>
                        )}
                      </div>
                      {previewData.data.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {/* #region agent log */}
                          {(() => { fetch('http://127.0.0.1:7242/ingest/bb6b65b1-634c-40bd-9652-b0ebb50ba0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin/page.tsx:399',message:'Rendering excerpt',data:{excerpt:previewData.data.excerpt,excerptType:typeof previewData.data.excerpt},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H4'})}).catch(()=>{}); return String(previewData.data.excerpt); })()}
                          {/* #endregion */}
                        </p>
                      )}
                    </div>
                    {/* Markdown Content Preview */}
                    {previewData.content && (
                      <div className="markdown-preview prose prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Style headings
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold text-foreground mt-8 mb-4">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                                {children}
                              </h3>
                            ),
                            // Style paragraphs
                            p: ({ children }) => (
                              <p className="text-muted-foreground mb-4 leading-relaxed">
                                {children}
                              </p>
                            ),
                            // Style code blocks
                            code: ({ className, children, ...props }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code
                                  className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground font-mono text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              ) : (
                                <code
                                  className="block p-4 rounded-lg bg-muted/30 border border-border/50 overflow-x-auto font-mono text-sm text-foreground"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                            pre: ({ children }) => (
                              <pre className="my-4 p-0 bg-transparent">{children}</pre>
                            ),
                            // Style lists
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside mb-4 text-muted-foreground space-y-1 ml-4">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside mb-4 text-muted-foreground space-y-1 ml-4">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-muted-foreground">{children}</li>
                            ),
                            // Style links
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {children}
                              </a>
                            ),
                            // Style blockquotes
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground">
                                {children}
                              </blockquote>
                            ),
                            // Style horizontal rules
                            hr: () => (
                              <hr className="my-6 border-border/50" />
                            ),
                            // Style images
                            img: ({ src, alt }) => (
                              <img
                                src={src}
                                alt={alt}
                                className="rounded-lg my-4 border border-border/50 max-w-full"
                              />
                            ),
                            // Style tables (from remark-gfm)
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-4">
                                <table className="min-w-full border-collapse border border-border/50">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-muted/30">{children}</thead>
                            ),
                            tbody: ({ children }) => <tbody>{children}</tbody>,
                            tr: ({ children }) => (
                              <tr className="border-b border-border/30">{children}</tr>
                            ),
                            th: ({ children }) => (
                              <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border border-border/30">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-4 py-2 text-sm text-muted-foreground border border-border/30">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {previewData.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-12">
                    Enter markdown content to see preview
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Upload Button and Status */}
          <div className="mb-8">
            <Button
              onClick={handleUpload}
              disabled={isUploading || !markdownContent.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-card hover:text-primary"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Post
                </>
              )}
            </Button>
          </div>

          {/* Existing Posts List */}
          <div className="p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Existing Posts ({posts.length})
            </h2>

            {isLoadingPosts ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
              </div>
            ) : posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No posts found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Slug
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Featured
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.slug}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-foreground">
                          {post.title}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono text-muted-foreground">
                          {post.slug}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {post.date}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {post.category}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {post.featured ? (
                            <span className="text-green-400">Yes</span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {/* Only show delete for markdown posts */}
                          {post.isMarkdown ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteClick(post.slug, post.title)}
                              disabled={deletingSlug === post.slug}
                              className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive hover:text-primary"
                            >
                              {deletingSlug === post.slug ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Legacy</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card border border-border/50 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-muted-foreground mb-4">
                  Are you sure you want to delete the post{" "}
                  <span className="font-semibold text-foreground">
                    "{deleteConfirm.title}"
                  </span>
                  ? This action cannot be undone and will permanently delete the
                  file from storage.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={handleDeleteCancel}
                    className="border-border hover:border-primary/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-primary"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

