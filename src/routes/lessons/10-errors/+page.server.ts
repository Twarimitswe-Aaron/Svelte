// Lesson 10 — Error handling server load
// Demonstrates error() for expected errors and throwing unexpected ones
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const trigger = url.searchParams.get('trigger');

	if (trigger === 'expected') {
		// error() creates an "expected" HttpError — has a status code and message
		// SvelteKit shows your +error.svelte page for these
		// handleError() hook is NOT called for expected errors
		throw error(404, {
			message: 'This is an expected 404 error — thrown intentionally with error()',
			code: 'DEMO_NOT_FOUND'
		});
	}

	if (trigger === 'unexpected') {
		// An unexpected error — any thrown non-HttpError
		// handleError() IS called for these
		// SvelteKit shows +error.svelte with status 500
		throw new Error('This is an unexpected runtime error! handleError() was called.');
	}

	return { triggered: trigger ?? null };
};
