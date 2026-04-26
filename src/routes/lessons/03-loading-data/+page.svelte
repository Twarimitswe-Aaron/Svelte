<!--
  Lesson 03 — Loading Data
  
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

	const lesson = lessons[2];
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
<\/script>

<h1>{data.posts.length} posts loaded</h1>
<p>Server timestamp: {data.serverTimestamp}</p>`;
</script>

<svelte:head>
	<title>Lesson 03 — Loading Data · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="load() functions in +page.server.ts and +page.ts run before the page renders, fetching data that's passed as 'data' props. Server load has access to cookies, DB, secrets. Universal load runs on server first, then in browser on navigation."
	whatFails="Without load(), your page has no data prop. Without +page.server.ts you can't safely access cookies/DB. Without the enhanced fetch from SvelteKit, relative URLs fail on the server."
>
	<!-- SECTION 1: Server load output -->
	<div class="data-sections">
		<div class="data-section">
			<div class="section-header">
				<span class="section-badge badge-red">🔒 Server Load</span>
				<code class="section-file">+page.server.ts</code>
			</div>
			<div class="data-box">
				<div class="data-row">
					<span class="data-key">Posts fetched</span>
					<span class="data-val">{data.serverPosts?.length ?? 0} posts</span>
				</div>
				<div class="data-row">
					<span class="data-key">Server timestamp</span>
					<code class="data-val timestamp">{data.serverTimestamp}</code>
				</div>
				<div class="data-row">
					<span class="data-key">Loaded on</span>
					<span class="data-val badge badge-purple">{data.loadedOn}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Posts rendered from server load -->
	{#if data.serverPosts?.length}
		<div class="posts-list">
			{#each data.serverPosts as post}
				<div class="post-card">
					<div class="post-header">
						<h4 class="post-title">{post.title}</h4>
						<div class="post-tags">
							{#each post.tags as tag}
								<span class="badge badge-blue">{tag}</span>
							{/each}
						</div>
					</div>
					<p class="post-excerpt">{post.excerpt}</p>
					<div class="post-meta">
						<span>👤 {post.author}</span>
						<span>📅 {post.date}</span>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="separator"></div>

	<!-- SECTION 2: await streaming demo -->
	<h3 class="sub-heading">⏱️ Streaming with &#123;#await&#125;</h3>
	<p class="demo-text">
		Streaming lets you show a placeholder immediately while slow data loads. Click the button to
		trigger a 2-second delayed promise and watch the &#123;#await&#125; block transition.
	</p>

	<button class="btn btn-primary" onclick={startStream} disabled={streamPromise !== null}>
		{streamPromise ? '⏳ Waiting...' : '▶ Start Stream (2s delay)'}
	</button>

	{#if streamPromise}
		<div class="await-demo">
			{#await streamPromise}
				<div class="await-loading">
					<div class="spinner"></div>
					<span>Loading streamed data…</span>
				</div>
			{:then result}
				<div class="await-result animate-fade-in">{result}</div>
			{/await}
		</div>
	{/if}

	<div class="separator"></div>

	<!-- Code blocks -->
	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={serverLoadCode} lang="typescript" filename="+page.server.ts" />
	<CodeBlock code={universalLoadCode} lang="typescript" filename="+page.ts (universal)" />
	<CodeBlock code={awaitCode} lang="svelte" filename="streaming with #await" />
	<CodeBlock code={pageDataCode} lang="svelte" filename="+page.svelte" />

	<!-- Comparison table -->
	<div class="table-wrap">
		<table class="compare-table">
			<thead>
				<tr>
					<th>Feature</th>
					<th>+page.server.ts</th>
					<th>+page.ts</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Runs on server</td>
					<td class="yes">✅ Always</td>
					<td class="yes">✅ First load</td>
				</tr>
				<tr>
					<td>Runs in browser</td>
					<td class="no">❌ Never</td>
					<td class="yes">✅ On navigation</td>
				</tr>
				<tr>
					<td>Access cookies</td>
					<td class="yes">✅ Yes</td>
					<td class="no">❌ No</td>
				</tr>
				<tr>
					<td>Can access DB</td>
					<td class="yes">✅ Yes</td>
					<td class="no">❌ Unsafe</td>
				</tr>
				<tr>
					<td>Can use params/url</td>
					<td class="yes">✅ Yes</td>
					<td class="yes">✅ Yes</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>

