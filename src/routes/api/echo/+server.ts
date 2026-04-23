// API route: /api/echo — handles GET, POST, DELETE
// DEMO route for Lesson 10 — shows how +server.ts works.
//
// WHY: +server.ts creates a REST endpoint at its URL path.
//      It's server-only and can handle any HTTP method.
// WHAT FAILS WITHOUT IT: fetch('/api/echo') returns 404.
//      The lesson 10 interactive demo cannot send/receive requests.

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// GET /api/echo — return info about the request
export const GET: RequestHandler = ({ request, url }) => {
	return json({
		method: 'GET',
		url: url.toString(),
		headers: Object.fromEntries(request.headers),
		message: 'This is a GET response from /api/echo',
		timestamp: new Date().toISOString()
	});
};

// POST /api/echo — echo back the JSON body
export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		body = null;
	}

	return json(
		{
			method: 'POST',
			received: body,
			message: 'Echo: received your POST body',
			timestamp: new Date().toISOString()
		},
		{ status: 201 } // 201 Created
	);
};

// DELETE /api/echo
export const DELETE: RequestHandler = () => {
	return json({
		method: 'DELETE',
		message: 'DELETE acknowledged — in a real app this would delete a resource',
		timestamp: new Date().toISOString()
	});
};

// PATCH /api/echo — demonstrates that each method is its own named export
export const PATCH: RequestHandler = async ({ request }) => {
	let body: unknown;
	try { body = await request.json(); } catch { body = null; }

	return json({
		method: 'PATCH',
		received: body,
		message: 'PATCH received — partial update would happen here',
		timestamp: new Date().toISOString()
	});
};
