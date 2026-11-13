"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Calendar, Clock, Tag, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, type BlogPost } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group p-6 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between gap-4 mb-4">
        <span
          className={cn(
            "px-2 py-1 text-xs font-mono rounded border",
            getCategoryColor(post.category)
          )}
        >
          {getCategoryLabel(post.category)}
        </span>
        {post.featured && (
          <span className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded border border-primary/20">
            Featured
          </span>
        )}
      </div>

      <Link href={`/blog/${post.slug}`} className="cursor-pointer">
        <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
      </Link>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="cursor-pointer text-xs text-primary hover:underline flex items-center gap-1"
        >
          Read more <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}

export function BlogList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get state from URL params
  const pageParam = searchParams.get("page");
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const currentPage = parseInt(pageParam || "1", 10);
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "all") {
          params.set("category", activeCategory);
        }
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        if (currentPage > 1) {
          params.set("page", currentPage.toString());
        }

        const response = await fetch(`/api/blog/posts?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts);
        setFeaturedPosts(data.featuredPosts);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory, searchQuery, currentPage]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    // Reset to page 1 when category changes
    const params = new URLSearchParams();
    if (category !== "all") {
      params.set("category", category);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    router.push(params.toString() ? `/blog?${params.toString()}` : "/blog");
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Reset to page 1 when search changes
    const params = new URLSearchParams();
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (query) {
      params.set("search", query);
    }
    router.push(params.toString() ? `/blog?${params.toString()}` : "/blog");
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (activeCategory !== "all") {
      params.set("category", activeCategory);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (page > 1) {
      params.set("page", page.toString());
    }
    router.push(params.toString() ? `/blog?${params.toString()}` : "/blog");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-card/30 border-border/50 focus:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.value)}
              className={cn(
                "font-mono text-xs",
                activeCategory === category.value
                  ? "bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50 hover:text-primary"
              )}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      {activeCategory === "all" && !searchQuery && featuredPosts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            Featured Posts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.slice(0, 2).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-primary" />
          {activeCategory === "all" ? "All Posts" : categories.find(c => c.value === activeCategory)?.label}
          <span className="text-sm text-muted-foreground font-normal">
            ({pagination.totalPosts})
          </span>
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

            {/* Pagination Controls - Show when there are multiple pages */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        disabled={isLoading}
                        className="border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <span className="text-muted-foreground px-2">...</span>
                      )}
                    </>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        disabled={isLoading}
                        className={
                          page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        }
                      >
                        {page}
                      </Button>
                    ))}

                  {/* Last page */}
                  {currentPage < pagination.totalPages - 2 && (
                    <>
                      {currentPage < pagination.totalPages - 3 && (
                        <span className="text-muted-foreground px-2">...</span>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(pagination.totalPages)}
                        disabled={isLoading}
                        className="border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pagination.totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages || isLoading}
                  className="border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Page info - Show when there are multiple pages */}
            {pagination.totalPages > 1 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
                {pagination.totalPosts > 0 && (
                  <span className="ml-2">
                    ({pagination.totalPosts} {pagination.totalPosts === 1 ? 'post' : 'posts'})
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
