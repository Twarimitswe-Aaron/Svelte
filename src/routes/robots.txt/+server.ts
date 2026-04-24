/**
 * routes/robots.txt/+server.ts — robots.txt for SEO
 *
 * WHY: robots.txt tells search engine crawlers which pages to index or skip.
 *      It also links to the sitemap so crawlers can find all pages quickly.
 *      This is a standard SEO best practice.
 *
 * HOW IT WORKS:
 *   - A GET request to /robots.txt is handled here.
 *   - We return plain text with Content-Type: text/plain.
 *   - "User-agent: *" applies the rules to ALL crawlers.
 *   - "Disallow: /api/" prevents indexing of our API routes (not useful to Google).
 *   - "Sitemap:" points crawlers to our dynamic sitemap.
 */
export const GET = () => {
	const body = `User-agent: *
Allow: /

# Don't index internal API routes — they have no SEO value
Disallow: /api/

# Sitemap location
Sitemap: https://sveltekit-course.dev/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
