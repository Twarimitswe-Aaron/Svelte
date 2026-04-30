<!--
  Lesson 11 — API / Server Routes
  
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
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[10];
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
	<title>Lesson 11 — API Routes · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="A +server.ts file at any route path creates a REST endpoint. Each HTTP method (GET, POST, DELETE, PATCH) is a named export. The json() helper from @sveltejs/kit serialises responses. Server routes can also run load() for SSR alongside, enabling content negotiation."
	whatFails="Without +server.ts, fetching that URL returns 404. Returning nothing from a RequestHandler causes a 500. Without json(), you must manually stringify and set Content-Type. Without named exports per method, SvelteKit returns 405 Method Not Allowed."
>
	<!-- Interactive REST client -->
	<section class="mb-12">
		<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
			<LessonIcon name="Globe" size={20} class="text-(--color-accent)" />
			Live REST Client — /api/echo
		</h3>
		<p class="text-sm text-white/60 leading-relaxed mb-8">
			This calls the live <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">/api/echo endpoint</code> at <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">src/routes/api/echo/+server.ts</code>. 
			Select a method and send the request.
		</p>

		<div class="p-8 rounded-2xl border border-white/10 bg-white/5 space-y-6">
			<div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<!-- Method selector -->
				<div class="flex p-1 bg-black/40 rounded-xl border border-white/5">
					{#each (['GET', 'POST', 'DELETE', 'PATCH'] as const) as m (m)}
						<button
							class="px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all {method === m ? 'bg-(--color-accent) text-white shadow-lg shadow-(--color-accent)/20' : 'text-white/40 hover:text-white/70'}"
							onclick={() => (method = m)}
						>
							{m}
						</button>
					{/each}
				</div>

				<div class="flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 border border-white/5">
					<span class="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">{method}</span>
					<code class="text-sm font-mono text-(--color-accent)">/api/echo</code>
				</div>
			</div>

			<!-- Body input (POST/PATCH only) -->
			{#if method === 'POST' || method === 'PATCH'}
				<div class="space-y-3 animate-fade-in">
					<label for="body-input" class="text-[10px] font-bold uppercase tracking-widest text-white/30">Request Body (JSON)</label>
					<textarea 
						id="body-input" 
						bind:value={postBody} 
						rows="3" 
						spellcheck="false"
						class="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-sm text-white font-mono placeholder-white/10 focus:border-(--color-accent) transition-all outline-none"
					></textarea>
				</div>
			{/if}

			<button 
				class="w-full md:w-auto px-8 py-3 rounded-xl bg-(--color-accent) text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2" 
				onclick={sendRequest} 
				disabled={loading}
			>
				{#if loading}
					<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
					<span>Sending…</span>
				{:else}
					<LessonIcon name="Send" size={16} />
					<span>Send {method} Request</span>
				{/if}
			</button>

			<!-- Response panel -->
			{#if status !== null}
				<div class="mt-8 animate-fade-in space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-[10px] font-bold uppercase tracking-widest text-white/30">Response</span>
						<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10">
							<div class="w-1.5 h-1.5 rounded-full" style="background-color: {statusColor};"></div>
							<span class="text-xs font-bold font-mono" style="color: {statusColor};">{status}</span>
						</div>
					</div>
					{#if response}
						<div class="p-6 rounded-xl bg-black/60 border border-white/5 overflow-x-auto">
							<pre class="text-xs text-white/70 font-mono leading-relaxed">{response}</pre>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<div class="separator"></div>

	<!-- Route anatomy -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
			<div class="flex items-center gap-2">
				<LessonIcon name="FileText" size={18} class="text-(--color-accent)" />
				<div class="text-sm font-bold text-white font-mono">+server.ts</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">REST endpoint. No UI. GET/POST/etc exports. For programmatic access.</p>
			<div class="text-[10px] font-medium text-white/30 italic">Used by: fetch(), curl, apps</div>
		</div>
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
			<div class="flex items-center gap-2">
				<LessonIcon name="Settings" size={18} class="text-(--color-accent)" />
				<div class="text-sm font-bold text-white font-mono">+page.server.ts</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">Server load + form actions. Returns data for Svelte UI components.</p>
			<div class="text-[10px] font-medium text-white/30 italic">Used by: SvelteKit routing</div>
		</div>
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
			<div class="flex items-center gap-2">
				<LessonIcon name="ArrowRightLeft" size={18} class="text-(--color-accent)" />
				<div class="text-sm font-bold text-white">Content Neg.</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">Both in same dir: browser gets HTML, API clients get JSON from the same URL.</p>
			<div class="text-[10px] font-medium text-white/30 italic">Accept header determines type</div>
		</div>
	</div>

	<div class="separator"></div>
	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={serverCode} lang="typescript" filename="+server.ts" />
	<CodeBlock code={fetchCode} lang="svelte" filename="fetching from +page.svelte" />
	<CodeBlock code={contentNegCode} lang="typescript" filename="content negotiation" />
</LessonLayout>

