// Lesson 03 — Server load function
// +page.server.ts — Runs ONLY on the server.
//
// WHY: Use this when you need to access the database, secrets, or cookies
//      that must never reach the browser.
// WHAT FAILS WITHOUT IT: The 'serverPosts' field won't exist in page data.
//      If you mistakenly put secret logic in +page.ts, it leaks to the client bundle.
//
// The difference from +page.ts:
//   - +page.server.ts → server only, has access to cookies/headers
//   - +page.ts        → universal, runs on server AND browser

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	// fetch() inside load is SvelteKit's enhanced fetch:
	// - on server: can make relative requests (e.g. '/api/posts')
	// - on client: same as native fetch
	// Without this SvelteKit enhancement, relative URLs would fail on the server.
	const res = await fetch('/api/posts');
	const posts = await res.json();

	return {
		// 'serverPosts' is merged with data from +page.ts load
		serverPosts: posts,
		// This demonstrates server-only capabilities
		serverTimestamp: new Date().toISOString(),
		loadedOn: 'server' as const
	};
};
