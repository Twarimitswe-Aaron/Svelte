// Lesson 04 — Form Actions server logic
// +page.server.ts — handles POST requests from the form
//
// WHY: Form actions live ONLY in +page.server.ts.
//      They receive form data submitted via POST, can access cookies/DB,
//      and return either a redirect, a success value, or a fail() for validation.
// WHAT FAILS WITHOUT IT:
//   - Submitting the form causes a 405 Method Not Allowed error.
//   - use:enhance has nothing to submit to.
//   - You lose progressive enhancement (no-JS fallback).

import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

// In-memory store for the demo (would be a DB in production)
const likes: number = 0;
const dislikes: number = 0;
const messages: { name: string; message: string; time: string }[] = [];

export const actions: Actions = {
	// DEFAULT ACTION — handles <form method="POST"> with no action attribute
	// ⚠️ You can't have both a default and named actions — pick one style
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim() ?? '';
		const message = data.get('message')?.toString().trim() ?? '';

		// Validation: fail() returns a 422 status with error data
		// The page re-renders with form.data containing the error
		if (!name) {
			return fail(422, { field: 'name', error: 'Name is required', name, message });
		}
		if (message.length < 5) {
			return fail(422, {
				field: 'message',
				error: 'Message must be at least 5 characters',
				name,
				message
			});
		}

		// Store message
		messages.push({ name, message, time: new Date().toLocaleTimeString() });

		// Returning undefined (or nothing) means: re-render page with updated load data
		// The load function runs again automatically after a successful action
		return { success: true, name };
	}
};

// A separate load function so the page can render the messages list
export const load = async () => {
	return { messages: [...messages], likes, dislikes };
};
