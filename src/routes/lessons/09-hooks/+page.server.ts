// Lesson 09 — the server load reads event.locals set by hooks.server.ts
// PROOF that hooks communicate with pages via event.locals
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, request }) => {
	// locals.user was set in hooks.server.ts handle()
	// Without the hook, locals.user would be undefined here
	return {
		user: locals.user,
		// Show the custom header we injected
		// (Can't read response headers here, but we can show the user object as proof)
		hookActive: !!locals.user,
		requestPath: new URL(request.url).pathname
	};
};
