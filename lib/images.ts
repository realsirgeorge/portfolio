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

// 31 Nights of Cyber / 31 Nights of r00t series — hero + attack-path figure per post.
// Generated alongside the images; referenced from markdown by absolute path.
export const seriesImages = {
  "beacon-xor-beacon-traffic-analysis": {
    hero: "/images/blog/beacon-xor-beacon-traffic-analysis/hero.png",
    flow: "/images/blog/beacon-xor-beacon-traffic-analysis/flow.png",
  },
  "beepcode-audio-spectrogram-steganography": {
    hero: "/images/blog/beepcode-audio-spectrogram-steganography/hero.png",
    flow: "/images/blog/beepcode-audio-spectrogram-steganography/flow.png",
  },
  "blackgate-watch-dns-tunnel-forensics": {
    hero: "/images/blog/blackgate-watch-dns-tunnel-forensics/hero.png",
    flow: "/images/blog/blackgate-watch-dns-tunnel-forensics/flow.png",
  },
  "cleartext-catch-ftp-credentials-pcap": {
    hero: "/images/blog/cleartext-catch-ftp-credentials-pcap/hero.png",
    flow: "/images/blog/cleartext-catch-ftp-credentials-pcap/flow.png",
  },
  "dead-reckoning-flight-data-recorder-forensics": {
    hero: "/images/blog/dead-reckoning-flight-data-recorder-forensics/hero.png",
    flow: "/images/blog/dead-reckoning-flight-data-recorder-forensics/flow.png",
  },
  "deadbolt-ecdsa-nonce-reuse-and-a-weak-checker": {
    hero: "/images/blog/deadbolt-ecdsa-nonce-reuse-and-a-weak-checker/hero.png",
    flow: "/images/blog/deadbolt-ecdsa-nonce-reuse-and-a-weak-checker/flow.png",
  },
  "echo-signature-ecdsa-signature-malleability": {
    hero: "/images/blog/echo-signature-ecdsa-signature-malleability/hero.png",
    flow: "/images/blog/echo-signature-ecdsa-signature-malleability/flow.png",
  },
  "echoes-in-the-curve-ecdsa-nonce-reuse": {
    hero: "/images/blog/echoes-in-the-curve-ecdsa-nonce-reuse/hero.png",
    flow: "/images/blog/echoes-in-the-curve-ecdsa-nonce-reuse/flow.png",
  },
  "fianchetto-wiener-attack-small-d": {
    hero: "/images/blog/fianchetto-wiener-attack-small-d/hero.png",
    flow: "/images/blog/fianchetto-wiener-attack-small-d/flow.png",
  },
  "janus-mutated-stream-cipher-reversing": {
    hero: "/images/blog/janus-mutated-stream-cipher-reversing/hero.png",
    flow: "/images/blog/janus-mutated-stream-cipher-reversing/flow.png",
  },
  "last-day-windows-event-log-insider-threat": {
    hero: "/images/blog/last-day-windows-event-log-insider-threat/hero.png",
    flow: "/images/blog/last-day-windows-event-log-insider-threat/flow.png",
  },
  "loaded-dice-blockhash-lottery-prediction": {
    hero: "/images/blog/loaded-dice-blockhash-lottery-prediction/hero.png",
    flow: "/images/blog/loaded-dice-blockhash-lottery-prediction/flow.png",
  },
  "meridian-fleet-prototype-pollution-to-rce": {
    hero: "/images/blog/meridian-fleet-prototype-pollution-to-rce/hero.png",
    flow: "/images/blog/meridian-fleet-prototype-pollution-to-rce/flow.png",
  },
  "nexus-hash-chain-binary-reversing": {
    hero: "/images/blog/nexus-hash-chain-binary-reversing/hero.png",
    flow: "/images/blog/nexus-hash-chain-binary-reversing/flow.png",
  },
  "nidavellir-shell-filter-bypass": {
    hero: "/images/blog/nidavellir-shell-filter-bypass/hero.png",
    flow: "/images/blog/nidavellir-shell-filter-bypass/flow.png",
  },
  "no-see-code-zero-width-steganography": {
    hero: "/images/blog/no-see-code-zero-width-steganography/hero.png",
    flow: "/images/blog/no-see-code-zero-width-steganography/flow.png",
  },
  "oracle-aes-padding-oracle-ctf": {
    hero: "/images/blog/oracle-aes-padding-oracle-ctf/hero.png",
    flow: "/images/blog/oracle-aes-padding-oracle-ctf/flow.png",
  },
  "packet-whisperer-dns-exfiltration": {
    hero: "/images/blog/packet-whisperer-dns-exfiltration/hero.png",
    flow: "/images/blog/packet-whisperer-dns-exfiltration/flow.png",
  },
  "quickline-ctr-nonce-reuse-many-time-pad": {
    hero: "/images/blog/quickline-ctr-nonce-reuse-many-time-pad/hero.png",
    flow: "/images/blog/quickline-ctr-nonce-reuse-many-time-pad/flow.png",
  },
  "rooted-or-not-android-root-check-bypass": {
    hero: "/images/blog/rooted-or-not-android-root-check-bypass/hero.png",
    flow: "/images/blog/rooted-or-not-android-root-check-bypass/flow.png",
  },
  "secure-app-hardcoded-api-key-apk": {
    hero: "/images/blog/secure-app-hardcoded-api-key-apk/hero.png",
    flow: "/images/blog/secure-app-hardcoded-api-key-apk/flow.png",
  },
  "securebank-sqli-to-ejs-rce": {
    hero: "/images/blog/securebank-sqli-to-ejs-rce/hero.png",
    flow: "/images/blog/securebank-sqli-to-ejs-rce/flow.png",
  },
  "sequence-break-tcp-isn-covert-channel": {
    hero: "/images/blog/sequence-break-tcp-isn-covert-channel/hero.png",
    flow: "/images/blog/sequence-break-tcp-isn-covert-channel/flow.png",
  },
  "session-cache-memory-forensics-xor-keys": {
    hero: "/images/blog/session-cache-memory-forensics-xor-keys/hero.png",
    flow: "/images/blog/session-cache-memory-forensics-xor-keys/flow.png",
  },
  "sidedoor-cleartext-cloud-exfiltration": {
    hero: "/images/blog/sidedoor-cleartext-cloud-exfiltration/hero.png",
    flow: "/images/blog/sidedoor-cleartext-cloud-exfiltration/flow.png",
  },
  "the-hunt-modbus-ics-forensics": {
    hero: "/images/blog/the-hunt-modbus-ics-forensics/hero.png",
    flow: "/images/blog/the-hunt-modbus-ics-forensics/flow.png",
  },
  "vault-reentrancy-checks-effects-interactions": {
    hero: "/images/blog/vault-reentrancy-checks-effects-interactions/hero.png",
    flow: "/images/blog/vault-reentrancy-checks-effects-interactions/flow.png",
  },
  "wraith-wasm-vm-reversing": {
    hero: "/images/blog/wraith-wasm-vm-reversing/hero.png",
    flow: "/images/blog/wraith-wasm-vm-reversing/flow.png",
  },
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

  const series = seriesImages[postSlug as keyof typeof seriesImages];
  if (series) {
    const seriesImage = series[imageName as keyof typeof series];
    if (seriesImage) return seriesImage;
  }

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

