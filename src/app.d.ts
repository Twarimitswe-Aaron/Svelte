// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
//
// WHY THIS FILE: This is where you define TypeScript types for SvelteKit's
//   App namespace — Locals, Error, PageData, Platform, etc.
// WHAT FAILS WITHOUT Locals type: event.locals.user is 'any' — no autocomplete,
//   no type errors if you misspell a property name.
declare global {
	namespace App {
		// Error — shape of $page.error in +error.svelte
		interface Error {
			message: string;
			errorId?: string;
			code?: string;
		}
		// Locals — injected per-request in hooks.server.ts handle()
		// Available in all server load(), actions, and +server.ts handlers
		interface Locals {
			user: {
				id: string;
				name: string;
				role: string;
			} | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
