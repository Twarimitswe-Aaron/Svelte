// src/hooks.server.ts — Server hooks run on EVERY request
//
// WHY: Hooks are the only place to run code before every route handler.
//      Perfect for: auth checks, request logging, injecting locals, CORS headers.
// WHAT FAILS WITHOUT IT:
//   - event.locals.user is always undefined → every load() that checks auth breaks
//   - No way to add global headers to every response
//   - No centralised error logging
//
// The three main exports:
//   handle()          — runs for every request/response cycle
//   handleError()     — runs when an unexpected error is thrown
//   handleFetch()     — intercepts server-side fetch() calls

import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';

// ─── handle ──────────────────────────────────────────────────────────────────
// Runs for EVERY server request (pages, API routes, etc.)
// You must call resolve(event) to continue the request pipeline.
// Omitting it stops all responses from being sent.
export const handle: Handle = async ({ event, resolve }) => {
	// 1. Inject a fake "user" into locals — normally you'd read a session cookie
	//    Locals are per-request, safe for sensitive data.
	event.locals.user = {
		id: 'usr_demo',
		name: 'SvelteKit Learner',
		role: 'student'
	};

	// 2. Record request timing
	const start = Date.now();

	// 3. Actually execute the route handler (load, action, or +server.ts)
	const response = await resolve(event);

	// 4. Add custom headers to EVERY response
	//    (e.g. CORS, cache-control, security headers)
	response.headers.set('X-SvelteKit-Lesson', '08-hooks');
	response.headers.set('X-Request-Duration', `${Date.now() - start}ms`);

	return response;
};

// ─── handleError ─────────────────────────────────────────────────────────────
// Called when an UNEXPECTED error escapes a load() or action.
// "Expected" errors (from error()) do NOT trigger this.
// Use this to: log to Sentry/Datadog, notify a Slack channel, etc.
export const handleError: HandleServerError = ({ error, event, status }) => {
	// Log to console (use your real error tracker here)
	console.error(`[handleError] ${status} on ${event.url.pathname}:`, error);

	// The return value becomes the error's public-facing message
	// Keep it vague for 500s so you don't leak internals to users
	return {
		message: status === 404 ? 'Page not found' : 'Something went wrong. We were notified.',
		// You can add custom properties — they'll appear in $page.error
		errorId: `err_${Date.now()}`
	};
};

// ─── handleFetch ─────────────────────────────────────────────────────────────
// Intercepts all fetch() calls made inside server-side load() functions.
// Use cases: add auth headers to outgoing API calls, rewrite URLs.
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	// Example: add an API key to all requests to our internal API
	if (request.url.includes('/api/')) {
		request = new Request(request, {
			headers: {
				...Object.fromEntries(request.headers),
				'X-Internal-Key': 'demo-key-123'
			}
		});
	}
	// Must call fetch(request) to actually make the request
	return fetch(request);
};
