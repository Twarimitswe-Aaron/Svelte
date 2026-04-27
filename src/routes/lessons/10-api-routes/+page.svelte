<!--
  Lesson 10 — API / Server Routes
  
  CONCEPTS SHOWN:
  1. +server.ts creates a REST endpoint at its URL
  2. Each HTTP method is a named export (GET, POST, DELETE, PATCH)
  3. json() helper for typed JSON responses
  4. How to call +server.ts from a Svelte page using fetch()
  5. Content negotiation (pages vs API)
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[9];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// ── Interactive REST client ──────────────────────────────────────────────
	let method = $state<'GET' | 'POST' | 'DELETE' | 'PATCH'>('GET');
	let postBody = $state('{ "greeting": "hello from Svelte!" }');
	let response = $state<string | null>(null);
	let status = $state<number | null>(null);
	let loading = $state(false);

	async function sendRequest() {
		loading = true;
		response = null;

		try {
			const opts: RequestInit = { method };
			if (method === 'POST' || method === 'PATCH') {
				opts.headers = { 'Content-Type': 'application/json' };
				opts.body = postBody;
			}

			const res = await fetch('/api/echo', opts);
			status = res.status;
			const data = await res.json();
			response = JSON.stringify(data, null, 2);
		} catch (e: unknown) {
			response = String(e);
			status = 0;
		} finally {
			loading = false;
		}
	}

	const statusColor = $derived(
		!status ? '' : 
		status < 300 ? 'var(--color-success)' : 
		status < 400 ? 'var(--color-warning)' : 'var(--color-danger)'
	);

	const serverCode = `// src/routes/api/echo/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Each HTTP method = a named export
export const GET: RequestHandler = ({ url }) => {
  return json({ message: 'Hello!', url: url.toString() });
  // json() sets Content-Type: application/json + serialises
  // ⚠️ Without json(): must manually return new Response(JSON.stringify(...))
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json(); // parse incoming JSON
  return json({ received: body }, { status: 201 });
};

export const DELETE: RequestHandler = () => {
  return json({ deleted: true });
  // ⚠️ Returning nothing causes a 500 — always return a Response
};`;

	const fetchCode = `<!-- Fetching from a server route in +page.svelte -->
<script lang="ts">
  let data = $state(null);

  async function loadData() {
    // Relative URLs work in both browser and server-side load()
    const res = await fetch('/api/echo');
    data = await res.json();
  }
<${'/'}script>

<button onclick={loadData}>Load</button>
{#if data}<pre>{JSON.stringify(data, null, 2)}</pre>{/if}`;

	const contentNegCode = `// Same URL can serve both a page AND an API!
// GET /blog/[slug]         → +page.svelte (HTML for browsers)
// GET /blog/[slug]         + Accept: application/json → +server.ts (JSON for APIs)

// src/routes/blog/[slug]/+server.ts
export const GET: RequestHandler = async ({ params }) => {
  const post = await getPost(params.slug);
  return json(post); // used by API consumers
};

// src/routes/blog/[slug]/+page.server.ts
export const load = async ({ params }) => {
  const post = await getPost(params.slug);
  return { post }; // used by +page.svelte
};`;
</script>

<svelte:head>
	<title>Lesson 10 — API Routes · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="A +server.ts file at any route path creates a REST endpoint. Each HTTP method (GET, POST, DELETE, PATCH) is a named export. The json() helper from @sveltejs/kit serialises responses. Server routes can also run load() for SSR alongside, enabling content negotiation."
	whatFails="Without +server.ts, fetching that URL returns 404. Returning nothing from a RequestHandler causes a 500. Without json(), you must manually stringify and set Content-Type. Without named exports per method, SvelteKit returns 405 Method Not Allowed."
>
	<!-- Interactive REST client -->
	<h3 class="sub-heading">🌐 Live REST Client — /api/echo</h3>
	<p class="demo-text">
		This calls the live <code>/api/echo endpoint</code> at <code>src/routes/api/echo/+server.ts</code
		>. Select a method and send the request.
	</p>

	<div class="rest-client">
		<div class="client-top">
			<!-- Method selector -->
			<div class="method-tabs">
				{#each (['GET', 'POST', 'DELETE', 'PATCH'] as const) as m (m)}
					<button
						class="method-btn method-{m.toLowerCase()}"
						class:active={method === m}
						onclick={() => (method = m)}
					>
						{m}
					</button>
				{/each}
			</div>

			<div class="url-display-client">
				<span class="method-badge method-{method.toLowerCase()}">{method}</span>
				<code>/api/echo</code>
			</div>
		</div>

		<!-- Body input (POST/PATCH only) -->
		{#if method === 'POST' || method === 'PATCH'}
			<div class="body-input">
				<label for="body-input">Request Body (JSON)</label>
				<textarea id="body-input" bind:value={postBody} rows="3" spellcheck="false"></textarea>
			</div>
		{/if}

		<button class="btn btn-primary send-btn" onclick={sendRequest} disabled={loading}>
			{#if loading}
				<span class="spinner-sm"></span> Sending…
			{:else}
				▶ Send {method} Request
			{/if}
		</button>

		<!-- Response panel -->
		{#if status !== null}
			<div class="response-panel animate-fade-in">
				<div class="response-header">
					<span class="response-label">Response</span>
					<span class="status-code" style="color: {statusColor};">{status}</span>
				</div>
				{#if response}
					<pre class="response-body">{response}</pre>
				{/if}
			</div>
		{/if}
	</div>

	<div class="separator"></div>

	<!-- Route anatomy -->
	<div class="anatomy-grid">
		<div class="anatomy-card">
			<div class="anatomy-file">+server.ts</div>
			<p>REST endpoint. No UI. GET/POST/etc exports.</p>
			<div class="anatomy-ex">Used by: fetch(), curl, mobile apps</div>
		</div>
		<div class="anatomy-card">
			<div class="anatomy-file">+page.server.ts</div>
			<p>Server load + form actions. Returns data for +page.svelte.</p>
			<div class="anatomy-ex">Used by: SvelteKit routing only</div>
		</div>
		<div class="anatomy-card">
			<div class="anatomy-file">Both in same dir</div>
			<p>Content negotiation: browser gets HTML, API clients get JSON.</p>
			<div class="anatomy-ex">Accept header determines response</div>
		</div>
	</div>

	<div class="separator"></div>
	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={serverCode} lang="typescript" filename="+server.ts" />
	<CodeBlock code={fetchCode} lang="svelte" filename="fetching from +page.svelte" />
	<CodeBlock code={contentNegCode} lang="typescript" filename="content negotiation" />
</LessonLayout>

