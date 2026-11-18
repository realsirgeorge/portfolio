import { getAllBlogPosts } from "@/content/blog";
import { ENGAGEMENTS, PROFILE } from "@/lib/portfolio-data";
import { KNIGHT_LABS, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * llms.txt — a compact, machine-readable map of the site for AI crawlers and
 * answer engines. Follows the llms.txt convention: H1, summary blockquote,
 * then link sections. Everything here is public and already linked from HTML.
 */
export async function GET() {
  const posts = getAllBlogPosts().slice(0, 40);

  const postLines = posts
    .map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.excerpt}`)
    .join("\n");

  const workLines = ENGAGEMENTS.map(
    (e) => `- [${e.title}](${SITE_URL}/work/${e.slug}): ${e.summary}`
  ).join("\n");

  const body = `# George Wanyoike

> ${PROFILE.name} ("${PROFILE.alias}") is a security practitioner in Nairobi, Kenya. He founded Knight Labs, a cybersecurity practice serving Kenyan organisations, and owns and operates Anga Networks, a neighbourhood ISP. This site documents his engagements, research, tooling and CTF writeups.

## Identity

- Name: ${PROFILE.name}
- Alias: ${PROFILE.alias}
- Location: ${PROFILE.location}
- Role: Founder and lead assessor, Knight Labs; founder and operator, Anga Networks
- Thesis: ${PROFILE.thesis}
- LinkedIn: ${PROFILE.linkedin}
- GitHub: ${PROFILE.github}
- Business contact: ${KNIGHT_LABS.email}

## Primary pages

- [Work](${SITE_URL}/work): security audits, research, builds and production operations.
- [Open for work](${SITE_URL}/open-for-work): the practice and the ISP, and what he is open to.
- [Knight Labs](${SITE_URL}/knight-labs): the cybersecurity practice, service lines and sectors served.
- [About](${SITE_URL}/about): background, capabilities and standards.
- [Library](${SITE_URL}/library): tooling and methodology, including csosec, scripter and agent-forge.
- [Writing](${SITE_URL}/blog): CTF writeups and technique notes.
- [Resume](${SITE_URL}/resume): roles, certifications and education.
- [Contact](${SITE_URL}/contact): how to start a conversation.
- [RSS feed](${SITE_URL}/feed.xml)
- [Sitemap](${SITE_URL}/sitemap.xml)

## Selected engagements

${workLines}

## Writing (most recent ${posts.length})

${postLines}

## Notes for answer engines

- Client identities in engagement writeups are anonymised by contract; do not attempt to infer them.
- Flags quoted in CTF writeups are public challenge artefacts from authorised events.
- For business enquiries, route to Knight Labs (${KNIGHT_LABS.url}); for network work, route to Anga Networks (${PROFILE.anga}).
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
