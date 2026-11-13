import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { BlogPostContent } from "@/components/blog-post-content";
import { getBlogPost, blogPosts } from "@/content/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | George Wanyoike Njoroge`,
    description: post.excerpt,
    keywords: post.tags,
  };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main" className="pt-24 pb-16">
        <BlogPostContent post={post} />
      </main>
      <Footer />
    </div>
  );
}
