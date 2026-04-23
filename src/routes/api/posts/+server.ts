// API route: GET /api/posts
// Returns mock blog posts as JSON.
//
// WHY: This is a +server.ts file — it creates a REST endpoint.
//      Lesson 03 uses this to demo both server and universal load functions.
// WHAT FAILS WITHOUT IT: fetch('/api/posts') returns 404,
//      the load functions fail, and the lesson page shows no data.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In a real app this would query a database
const posts = [
	{
		id: 1,
		slug: 'getting-started-with-sveltekit',
		title: 'Getting Started with SvelteKit',
		author: 'Svelte Team',
		date: '2025-01-15',
		excerpt: 'SvelteKit is the official application framework for Svelte. Learn how to set it up.',
		tags: ['sveltekit', 'tutorial']
	},
	{
		id: 2,
		slug: 'svelte-5-runes-explained',
		title: 'Svelte 5 Runes Explained',
		author: 'Rich Harris',
		date: '2025-03-22',
		excerpt:
			'Svelte 5 introduces runes — a new reactivity system that replaces the old store API.',
		tags: ['svelte5', 'runes']
	},
	{
		id: 3,
		slug: 'ssr-vs-csr-in-sveltekit',
		title: 'SSR vs CSR in SvelteKit',
		author: 'Community',
		date: '2025-05-10',
		excerpt: 'When should you use server-side rendering vs client-side rendering?',
		tags: ['ssr', 'performance']
	}
];

export const GET: RequestHandler = () => {
	// json() helper sets Content-Type: application/json and serializes the data
	// Without this, you'd have to manually create a Response with JSON.stringify()
	return json(posts);
};
