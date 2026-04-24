/**
 * routes/sitemap.xml/+server.ts — Dynamic sitemap for SEO
 *
 * WHY: Search engines use sitemaps to discover and prioritise pages.
 *      SvelteKit has no built-in sitemap generation, so we generate it
 *      dynamically as an API route. This implements the SvelteKit SEO
 *      best practice of providing a sitemap.
 *
 * HOW IT WORKS:
 *   - A GET request to /sitemap.xml hits this handler.
 *   - We import the lessons list and build one <url> entry per lesson.
 *   - We return it with Content-Type: application/xml so browsers/crawlers
 *     know it is valid XML.
 *   - Cache-Control is set to 1 day because the lesson list rarely changes.
 */
import { lessons } from '$lib/lessons.js';

const BASE_URL = 'https://sveltekit-course.dev';

export const GET = () => {
	// Build a <url> element for each lesson page.
	const lessonUrls = lessons
		.map(
			(lesson) => `
  <url>
    <loc>${BASE_URL}/lessons/${lesson.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${lessonUrls}
</urlset>`.trim();

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400' // cache for 1 day
		}
	});
};
