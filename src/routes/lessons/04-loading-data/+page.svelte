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
	import { Lock, User, Calendar, Timer, Play, Loader2, CircleCheck } from 'lucide-svelte';

	const lesson = lessons[3];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// data comes from BOTH +page.server.ts AND +page.ts merged together
	let { data } = $props();

	// Streaming demo: a delayed promise resolved client-side
	// This shows the {#await} pattern for progressive loading
	let streamPromise = $state<Promise<string> | null>(null);

	function startStream() {
		streamPromise = new Promise((resolve) => {
			setTimeout(() =>  '✅ Streamed data arrived after 2 seconds!' , 2000);
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
  // ⚠️ Without this file: data.posts is undefined, page crashes
};`;

	const universalLoadCode = `// +page.ts — UNIVERSAL (server on first load, client on navigation)
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
  // url and params are available in universal load
  const category = url.searchParams.get('category') ?? 'all';
  
  return { category };
  // Runs on server for SSR, then in browser for client navigation
  // ⚠️ DO NOT put secrets here — this code runs in the browser!
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
	<div class="grid grid-cols-1 gap-6 mb-10">
		<div class="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
			<div class="px-6 py-4 border-b border-white/10 bg-white/2 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
						<Lock size={12} />
						Server Load
					</span>
					<code class="text-xs text-white/40 font-mono">+page.server.ts</code>
				</div>
			</div>
			<div class="p-6 space-y-4">
				<div class="flex items-center justify-between py-2 border-b border-white/5">
					<span class="text-sm text-white/50">Posts fetched</span>
					<span class="text-sm font-bold text-white">{data.serverPosts?.length ?? 0} posts</span>
				</div>
				<div class="flex items-center justify-between py-2 border-b border-white/5">
					<span class="text-sm text-white/50">Server timestamp</span>
					<code class="text-xs text-(--color-accent) font-mono">{data.serverTimestamp}</code>
				</div>
				<div class="flex items-center justify-between py-2">
					<span class="text-sm text-white/50">Loaded on</span>
					<span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
						{data.loadedOn}
					</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Posts rendered from server load -->
	{#if data.serverPosts?.length}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
			{#each data.serverPosts as post (post.id)}
				<div class="p-5 rounded-xl border border-white/10 bg-white/2 hover:bg-white/4 transition-all group">
					<div class="flex items-start justify-between mb-3">
						<h4 class="text-lg font-bold text-white group-hover:text-(--color-accent) transition-colors">{post.title}</h4>
						<div class="flex gap-1">
							{#each post.tags as tag (tag)}
								<span class="px-1.5 py-0.5 rounded-md bg-(--color-accent)/10 text-(--color-accent) text-[9px] font-bold uppercase tracking-tighter">
									{tag}
								</span>
							{/each}
						</div>
					</div>
					<p class="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
					<div class="flex items-center gap-4 text-[11px] text-white/40 font-medium uppercase tracking-wider">
						<span class="flex items-center gap-1.5"><User size={12} class="text-(--color-accent)" /> {post.author}</span>
						<span class="flex items-center gap-1.5"><Calendar size={12} class="text-(--color-accent)" /> {post.date}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="h-px bg-white/10 my-10"></div>

	<!-- SECTION 2: await streaming demo -->
	<h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
		<Timer size={22} class="text-(--color-accent)" />
		Streaming with &#123;#await&#125;
	</h3>
	<p class="text-sm text-white/60 leading-relaxed mb-6">
		Streaming lets you show a placeholder immediately while slow data loads. Click the button to
		trigger a 2-second delayed promise and watch the &#123;#await&#125; block transition.
	</p>

	<button 
		class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-(--color-accent) text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mb-8" 
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
		<div class="p-8 rounded-2xl border border-white/10 bg-white/5 mb-10 overflow-hidden relative">
			{#await streamPromise}
				<div class="flex flex-col items-center justify-center gap-4 py-4">
					<div class="relative">
						<Loader2 size={32} class="animate-spin text-(--color-accent)" />
						<div class="absolute inset-0 blur-xl bg-(--color-accent)/30 animate-pulse"></div>
					</div>
					<span class="text-sm font-medium text-white/60 animate-pulse">Streaming data from server...</span>
				</div>
			{:then result}
				<div class="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 animate-fade-in">
					<CircleCheck size={20} />
					<span class="font-medium text-sm">{result}</span>
				</div>
			{/await}
		</div>
	{/if}

	<div class="h-px bg-white/10 my-10"></div>

	<!-- Code blocks -->
	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Implementation</h3>
	<CodeBlock code={serverLoadCode} lang="typescript" filename="+page.server.ts" />
	<CodeBlock code={universalLoadCode} lang="typescript" filename="+page.ts (universal)" />
	<CodeBlock code={awaitCode} lang="svelte" filename="streaming with #await" />
	<CodeBlock code={pageDataCode} lang="svelte" filename="+page.svelte" />

	<!-- Comparison table -->
	<div class="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-white/2 border-b border-white/10">
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Feature</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">+page.server.ts</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">+page.ts</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/5">
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
					<td class="px-6 py-4 text-sm text-red-400/70 font-bold italic">⚠️ Unsafe</td>
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

