// src/lib/server/remote-demo.remote.ts
// Remote functions demo for Lesson 11.
//
// WHY .remote.ts?
//   SvelteKit transforms this file at build time. Any function you export from
//   a .remote.ts file is callable from the browser like a normal async function,
//   but actually sends a fetch() request to an auto-generated server endpoint.
//   You never write the endpoint — SvelteKit generates it.
//
// WHAT FAILS WITHOUT IT:
//   - Without .remote.ts: you'd write a +server.ts endpoint AND a fetch() wrapper by hand.
//   - Without $app/server imports: the file is just plain functions — no server magic.
//   - Importing from src/lib/server in client code throws a build error (intentional security).
//
// IMPORTANT: This file was introduced in SvelteKit 2.27 (Svelte 5 era).
//   Remote functions require SvelteKit >= 2.27.

import { query, command } from '$app/server';
import * as v from 'valibot';

// Types for our demo data
export interface DemoPost {
	id: number;
	title: string;
	likes: number;
	tags: string[];
}

// In-memory store (replace with a real DB in production)
let posts: DemoPost[] = [
	{ id: 1, title: 'Getting Started with SvelteKit',  likes: 42, tags: ['tutorial'] },
	{ id: 2, title: 'Svelte 5 Runes Deep Dive',        likes: 87, tags: ['svelte5'] },
	{ id: 3, title: 'Remote Functions Are Amazing',    likes: 64, tags: ['remote'] }
];

// ─── query ───────────────────────────────────────────────────────────────────
// query() creates a server-side function that runs on the server every call.
// From the browser: calling getPosts() sends a GET-like fetch to the server.
// WHY: Use query when you need fresh server data without writing load().
// WHAT FAILS: Without query(), you'd need a +server.ts + manual fetch wrapper.
export const getPosts = query(async () => {
	// This code runs ONLY on the server — safe to access DB, secrets, etc.
	return [...posts];
});

// query with an argument — the argument is sent to the server as JSON
// ⚠️ SvelteKit REQUIRES you to pass a validation schema as the first arg.
export const getPost = query(v.number(), async (id: number) => {
	return posts.find(p => p.id === id) ?? null;
});

// ─── command ─────────────────────────────────────────────────────────────────
// command() creates a server-side mutation function (like a POST).
// Unlike form(), it doesn't require an HTML <form> element.
// WHY: Use command when you need to trigger side-effects from JS (not forms).
// WHAT FAILS: Without command(), you'd need a +server.ts POST endpoint + fetch calls.
export const likePost = command(v.number(), async (id: number) => {
	const post = posts.find(p => p.id === id);
	if (post) {
		post.likes++;
		return { success: true as const, newLikes: post.likes };
	}
	return { success: false as const, newLikes: 0 };
});

export const addPost = command(v.string(), async (title: string) => {
	const id = Date.now();
	const newPost: DemoPost = { id, title, likes: 0, tags: ['new'] };
	posts.push(newPost);
	return newPost;
});
