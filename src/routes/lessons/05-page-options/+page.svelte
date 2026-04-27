<!--
  Lesson 05 — Page Options
  
  CONCEPTS SHOWN:
  1. prerender — static HTML at build time
  2. ssr — server-side rendering on/off
  3. csr — client-side rendering on/off
  4. trailingSlash — URL normalisation
  5. Each option has a visual explaination of effect and failure mode
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[4];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const options = [
		{
			name: 'prerender',
			type: 'boolean | "auto"',
			default_val: 'false',
			emoji: '🏗️',
			what: 'Generates a static HTML file at build time instead of rendering on each request. Ideal for content that never changes.',
			fails: "If your page uses form actions or reads request-specific data (cookies), prerendering fails — you'll get a build error.",
			example: `// +page.ts or +page.server.ts
export const prerender = true;
// Now this page is: vite build → static .html file
// ⚠️ Cannot use: cookies, form actions, dynamic request data`,
			whenToUse: 'About pages, blog posts, docs, marketing pages.'
		},
		{
			name: 'ssr',
			type: 'boolean',
			default_val: 'true',
			emoji: '🖥️',
			what: 'Server-side rendering: the page HTML is generated on the server before sending to the browser. Enables SEO and fast first paint.',
			fails: "Disabling SSR (ssr = false) means the page is blank on first load until JavaScript runs — search engines can't index it. Also, load() still runs on server unless you disable SSR.",
			example: `// +page.ts
export const ssr = false;
// Page skips SSR — starts as empty HTML
// JS hydrates it client-side
// ⚠️ SEO will be poor — Googlebot can't read the content`,
			whenToUse:
				'Admin dashboards, auth-gated pages where SEO is not needed. Combine with csr=true.'
		},
		{
			name: 'csr',
			type: 'boolean',
			default_val: 'true',
			emoji: '🌐',
			what: 'Client-side rendering: JavaScript runs in the browser to hydrate and enable interactivity. Required for any reactivity.',
			fails: 'Setting csr = false turns the page into pure HTML — no reactivity, no event listeners, no Svelte state. Clicks and inputs do nothing.',
			example: `// +page.ts
export const csr = false;
// 100% server-rendered HTML — no JS sent
// ⚠️ onClick, $state, etc. will NOT work
// Good for: pure read-only content pages`,
			whenToUse: 'Combine with prerender=true for totally static, zero-JS pages.'
		},
		{
			name: 'trailingSlash',
			type: '"never" | "always" | "ignore"',
			default_val: '"never"',
			emoji: '🔗',
			what: 'Controls whether trailing slashes are added/removed from URLs. "never" redirects /about/ → /about. "always" adds the slash.',
			fails: 'Inconsistent trailing slashes cause duplicate content issues for SEO. Without configuring this, /about and /about/ may return different responses.',
			example: `// +page.ts
export const trailingSlash = 'always';
// /about → redirects to → /about/
// Useful if your CDN/host expects trailing slashes`,
			whenToUse: 'Static site generation where file names need /index.html structure.'
		}
	];

	let selected = $state(options[0]);

	const exportCode = `// You can set page options in +page.ts, +page.server.ts, or +layout.ts
// Options in +layout.ts apply to ALL child pages in that directory

// src/routes/blog/+layout.ts — applies to all /blog/* pages
export const prerender = true; // all blog posts are prerendered
export const trailingSlash = 'always';

// src/routes/blog/[slug]/+page.ts — override for individual pages
export const prerender = false; // this one is NOT prerendered`;
</script>

<svelte:head>
	<title>Lesson 05 — Page Options · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Page options are exported constants from +page.ts or +layout.ts that control how SvelteKit renders your page: static prerendering at build time, server-side rendering, client-side JS hydration, and URL slash behaviour."
	whatFails="Using wrong options for your use case causes: broken SEO (ssr=false on public pages), failed builds (prerender=true with cookies), zero interactivity (csr=false with reactive state), or duplicate-content URL issues (trailingSlash mismatch)."
>
	<!-- Interactive option explorer -->
	<div class="option-explorer">
		<div class="option-tabs">
			{#each options as opt (opt.name)}
				<button
					class="option-tab"
					class:active={selected === opt}
					onclick={() => (selected = opt)}
				>
					{opt.emoji} <code>{opt.name}</code>
				</button>
			{/each}
		</div>

		{#key selected.name}
		<div class="option-detail animate-fade-in">
			<div class="option-header">
				<h3 class="option-name">{selected.emoji} <code>export const {selected.name}</code></h3>
				<div class="option-meta-row">
					<span class="meta-chip">Type: <code>{selected.type}</code></span>
					<span class="meta-chip">Default: <code>{selected.default_val}</code></span>
				</div>
			</div>

			<div class="option-cards">
				<div class="opt-card opt-what">
					<span class="opt-label">💡 What it does</span>
					<p>{selected.what}</p>
				</div>
				<div class="opt-card opt-fails">
					<span class="opt-label">⚠️ What fails without it / if misused</span>
					<p>{selected.fails}</p>
				</div>
				<div class="opt-card opt-when">
					<span class="opt-label">✅ When to use</span>
					<p>{selected.whenToUse}</p>
				</div>
			</div>

			<CodeBlock code={selected.example} lang="typescript" filename="+page.ts" />
		</div>
		{/key}
	</div>

	<div class="separator"></div>

	<h3 class="sub-heading">Combining Options</h3>
	<CodeBlock code={exportCode} lang="typescript" filename="+layout.ts / +page.ts" />

	<!-- Visual matrix -->
	<div class="table-wrap">
		<table class="matrix-table">
			<thead>
				<tr>
					<th>Use case</th>
					<th>prerender</th>
					<th>ssr</th>
					<th>csr</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Blog post</td>
					<td class="yes">true</td>
					<td class="yes">true</td>
					<td class="yes">true</td>
				</tr>
				<tr>
					<td>Admin dashboard</td>
					<td class="no">false</td>
					<td class="no">false</td>
					<td class="yes">true</td>
				</tr>
				<tr>
					<td>Zero-JS static page</td>
					<td class="yes">true</td>
					<td class="yes">true</td>
					<td class="no">false</td>
				</tr>
				<tr>
					<td>Marketing page</td>
					<td class="yes">true</td>
					<td class="yes">true</td>
					<td class="yes">true</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>

