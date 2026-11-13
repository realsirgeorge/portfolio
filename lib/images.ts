/**
 * Centralized image paths for the entire application
 * All images should be exported from this file for consistent path management
 * 
 * Images are stored in public/images/ and referenced with absolute paths starting with /
 * 
 * USAGE:
 * 1. In blog posts (markdown content):
 *    Use the absolute path directly: ![Alt text](/images/blog/local-authority/figure1.png)
 * 
 * 2. In React components:
 *    Import: import { images } from "@/lib/images"
 *    Use: <img src={images.blog.localAuthority.figure1} alt="..." />
 * 
 * 3. For programmatic access:
 *    Import: import { getBlogImage } from "@/lib/images"
 *    Use: const imgPath = getBlogImage("local-authority-ctf-walkthrough", "figure1")
 * 
 * ADDING NEW IMAGES:
 * 1. Place image files in public/images/blog/{post-slug}/ or public/images/{category}/
 * 2. Add the path to the appropriate export object below
 * 3. Update the imageMap in getBlogImage() if it's a blog post image
 */

// Blog Images - Local Authority CTF
export const blogImages = {
  localAuthority: {
    figure1: "/images/blog/local-authority/figure1.png",
    figure2: "/images/blog/local-authority/figure2.png",
    figure3: "/images/blog/local-authority/figure3.png",
    figure4: "/images/blog/local-authority/figure4.png",
    figure5: "/images/blog/local-authority/figure5.png",
  },

  applepay: {
    figure1: "/images/blog/apple-pay-phishing-scam-2025-26/figure1.png",
  },

  

} as const;

// Placeholder Images
export const placeholderImages = {
  logo: "/placeholder-logo.png",
  logoDark: "/placeholder-logo.svg",
  user: "/placeholder-user.jpg",
  image: "/placeholder.jpg",
  svg: "/placeholder.svg",
} as const;

// Icon Images
export const iconImages = {
  apple: "/apple-icon.png",
  dark: "/icon-dark-32x32.png",
  light: "/icon-light-32x32.png",
  svg: "/icon.svg",
} as const;

// Helper function to get blog image by post slug and image name
export function getBlogImage(postSlug: string, imageName: string): string {
  // Map post slugs to their image collections
  const imageMap: Record<string, Record<string, string>> = {
    "local-authority-ctf-walkthrough": blogImages.localAuthority,
    "apple-pay-phishing-scam-2025-26": blogImages.applepay,
  };

  const postImages = imageMap[postSlug];
  if (!postImages) {
    console.warn(`No images found for post slug: ${postSlug}`);
    return placeholderImages.image;
  }

  const imagePath = postImages[imageName as keyof typeof postImages];
  if (!imagePath) {
    console.warn(`Image "${imageName}" not found for post "${postSlug}"`);
    return placeholderImages.image;
  }

  return imagePath;
}

// Export all images as a single object for easy access
export const images = {
  blog: blogImages,
  placeholder: placeholderImages,
  icon: iconImages,
} as const;

