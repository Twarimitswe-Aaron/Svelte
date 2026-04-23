// Dynamic route load for Lesson 02
// +page.ts — Universal load (runs on server for SSR, then client on navigation)
//
// WHY: Without this, the [slug] segment won't be available to +page.svelte.
//      params.slug is the value captured from the URL (e.g. /lessons/02-routing/hello-world → "hello-world")
// WHAT FAILS WITHOUT IT: data.slug is undefined — the page renders with an empty title.

import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	// params.slug is automatically extracted from the [slug] folder name
	return {
		slug: params.slug
	};
};
