<!--
  Lesson 04 — Loading Data
  
  CONCEPTS SHOWN:
  1. Server load (+page.server.ts) — runs ONLY on server, has access to cookies/DB
  2. Universal load (+page.ts) — runs on server first, then client on navigation
  3. Streaming with {#await} — show data as promise resolves
  4. The 'data' prop is always available in +page.svelte when load() returns
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import {
		Lock,
		User,
		Calendar,
		Timer,
		Play,
		Loader2,
		CircleCheck,
		TriangleAlert
	} from 'lucide-svelte';

	const lesson = lessons[3];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// data comes from BOTH +page.server.ts AND +page.ts merged together
	let { data } = $props();

	// Streaming demo: a delayed promise resolved client-side
	// This shows the {#await} pattern for progressive loading
	let streamPromise = $state<Promise<string> | null>(null);

	function startStream() {
		streamPromise = new Promise((resolve) => {
			setTimeout(() => resolve('✅ Streamed data arrived after 2 seconds!'), 2000);
		});
	}

	const serverLoadCode = `// +page.server.ts — SERVER ONLY
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
  const res = await fetch('/api/posts'); // relative URL works on server!
  const posts = await res.json();
  
  return {
    posts,
    // This timestamp is created on the server — not accessible in +page.ts
    serverTimestamp: new Date().toISOString()
  };
  // Without this file: data.posts is undefined, page crashes
};`;

	const universalLoadCode = `// +page.ts — UNIVERSAL (server on first load, client on navigation)
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
  // url and params are available in universal load
  const category = url.searchParams.get('category') ?? 'all';
  
  return { category };
  // Runs on server for SSR, then in browser for client navigation
  // TriangleAlert DO NOT put secrets here — this code runs in the browser!
};`;

	const awaitCode = `<!-- Streaming with {#await} -->
{#await slowDataPromise}
  <p>⏳ Loading...</p>
{:then result}
  <p>✅ {result}</p>
{:catch error}
  <p>❌ Error: {error.message}</p>
{/await}`;

	const pageDataCode = `<!-- +page.svelte — always access load data via $props() -->
<script lang="ts">
  let { data } = $props();
  // data = merged result of +page.server.ts + +page.ts load()
  ${'<'}/script>

<h1>{data.posts.length} posts loaded</h1>
<p>Server timestamp: {data.serverTimestamp}</p>`;
</script>

<svelte:head>
	<title>Lesson 04 — Loading Data · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="load() functions in +page.server.ts and +page.ts run before the page renders, fetching data that's passed as 'data' props. Server load has access to cookies, DB, secrets. Universal load runs on server first, then in browser on navigation."
	whatFails="Without load(), your page has no data prop. Without +page.server.ts you can't safely access cookies/DB. Without the enhanced fetch from SvelteKit, relative URLs fail on the server."
>
	<!-- SECTION 1: Server load output -->
	<div class="gap-6 mb-10 grid grid-cols-1">
		<div class="rounded-xl border-white/10 bg-white/5 glass-blur overflow-hidden border">
			<div class="px-6 py-4 border-white/10 bg-white/2 flex items-center justify-between border-b">
				<div class="gap-2 flex items-center">
					<span
						class="px-2 py-0.5 bg-red-500/20 text-red-400 font-bold tracking-wider gap-1 flex items-center rounded-full text-[10px] uppercase"
					>
						<Lock size={12} />
						Server Load
					</span>
					<code class="text-xs text-white/40 font-mono">+page.server.ts</code>
				</div>
			</div>
			<div class="p-6 space-y-4">
				<div class="py-2 border-white/5 flex items-center justify-between border-b">
					<span class="text-sm text-white/50">Posts fetched</span>
					<span class="text-sm font-bold text-white">{data.serverPosts?.length ?? 0} posts</span>
				</div>
				<div class="py-2 border-white/5 flex items-center justify-between border-b">
					<span class="text-sm text-white/50">Server timestamp</span>
					<code class="text-xs font-mono text-(--color-accent)">{data.serverTimestamp}</code>
				</div>
				<div class="py-2 flex items-center justify-between">
					<span class="text-sm text-white/50">Loaded on</span>
					<span
						class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 font-bold tracking-wider text-[10px] uppercase"
					>
						{data.loadedOn}
					</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Posts rendered from server load -->
	{#if data.serverPosts?.length}
		<div class="md:grid-cols-2 gap-4 mb-10 grid grid-cols-1">
			{#each data.serverPosts as post (post.id)}
				<div
					class="p-5 rounded-xl border-white/10 bg-white/2 hover:bg-white/4 group glass-blur border transition-all"
				>
					<div class="mb-3 flex items-start justify-between">
						<h4
							class="text-lg font-bold text-white transition-colors group-hover:text-(--color-accent)"
						>
							{post.title}
						</h4>
						<div class="gap-1 flex">
							{#each post.tags as tag (tag)}
								<span
									class=" py-0.5 bg-black/40 backdrop-blur-md text-xs px-2 text-white border-white/10 rounded-full border"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
					<p class="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
					<div
						class="gap-4 text-white/40 font-medium tracking-wider flex items-center text-[11px] uppercase"
					>
						<span class="gap-1.5 flex items-center"
							><User size={12} class="text-(--color-accent)" /> {post.author}</span
						>
						<span class="gap-1.5 flex items-center"
							><Calendar size={12} class="text-(--color-accent)" /> {post.date}</span
						>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="bg-white/10 my-10 h-px"></div>

	<!-- SECTION 2: await streaming demo -->
	<h3 class="text-xl font-bold text-white mb-4 gap-2 flex items-center">
		<Timer size={22} class="text-(--color-accent)" />
		Streaming with &#123;#await&#125;
	</h3>
	<p class="text-sm text-white/60 leading-relaxed mb-6">
		Streaming lets you show a placeholder immediately while slow data loads. Click the button to
		trigger a 2-second delayed promise and watch the &#123;#await&#125; block transition.
	</p>

	<button
		class="gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm mb-8 inline-flex cursor-pointer items-center bg-(--color-accent) transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
		onclick={startStream}
		disabled={streamPromise !== null}
	>
		{#if streamPromise}
			<Loader2 size={18} class="animate-spin" />
			<span>Waiting for stream...</span>
		{:else}
			<Play size={18} />
			<span>Start Stream (2s delay)</span>
		{/if}
	</button>

	{#if streamPromise}
		<div
			class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur mb-10 relative overflow-hidden border"
		>
			{#await streamPromise}
				<div class="gap-4 py-4 flex flex-col items-center justify-center">
					<div class="relative">
						<Loader2 size={32} class="animate-spin text-(--color-accent)" />
						<div class="inset-0 blur-xl animate-pulse absolute bg-(--color-accent)/30"></div>
					</div>
					<span class="text-sm font-medium text-white/60 animate-pulse"
						>Streaming data from server...</span
					>
				</div>
			{:then result}
				<div
					class="gap-3 p-4 rounded-xl bg-green-500/10 border-green-500/20 text-green-400 animate-fade-in glass-blur flex items-center border"
				>
					<CircleCheck size={20} />
					<span class="font-medium text-sm">{result}</span>
				</div>
			{/await}
		</div>
	{/if}

	<div class="bg-white/10 my-10 h-px"></div>

	<!-- Code blocks -->
	<h3 class="text-lg font-bold mb-6 tracking-widest text-white/30 uppercase">Implementation</h3>
	<CodeBlock code={serverLoadCode} lang="typescript" filename="+page.server.ts" />
	<CodeBlock code={universalLoadCode} lang="typescript" filename="+page.ts (universal)" />
	<CodeBlock code={awaitCode} lang="svelte" filename="streaming with #await" />
	<CodeBlock code={pageDataCode} lang="svelte" filename="+page.svelte" />

	<!-- Comparison table -->
	<div class="mt-12 rounded-xl border-white/10 bg-white/5 glass-blur overflow-hidden border">
		<table class="w-full border-collapse text-left">
			<thead>
				<tr class="bg-white/2 border-white/10 border-b">
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>Feature</th
					>
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>+page.server.ts</th
					>
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>+page.ts</th
					>
				</tr>
			</thead>
			<tbody class="divide-white/5 divide-y">
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Runs on server</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold">✅ Always</td>
					<td class="px-6 py-4 text-sm text-green-400/70 font-bold">✅ First load</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Runs in browser</td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold">❌ Never</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold">✅ Navigation</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Access cookies</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold">✅ Yes</td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold">❌ No</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Database access</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold">✅ Safe</td>
					<td class="px-6 py-4 text-sm text-red-400/70 font-bold gap-1 flex items-center italic">
						<TriangleAlert size={14} /> Unsafe
					</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">URL & Params</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold">✅ Yes</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold">✅ Yes</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>
