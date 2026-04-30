<!--
  Lesson 03 — Routing
  
  CONCEPT: SvelteKit routing is file-system based.
  - +page.svelte at src/routes/foo/+page.svelte → URL /foo
  - [param] segments create dynamic routes
  - +layout.svelte wraps all pages in its directory
  - Navigating between pages is client-side (no full reload) once JS loads
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';

	const lesson = lessons[2];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// Some example slug values to demonstrate dynamic routes
	const demoSlugs = ['hello-world', 'svelte-5-runes', 'my-first-post'];

	const routeCode = `src/routes/
├── +page.svelte             → /
├── about/
│   └── +page.svelte         → /about
└── lessons/
    ├── +layout.svelte        → wraps all /lessons/* pages
    └── 03-routing/
        ├── +page.svelte      → /lessons/03-routing  ← you are here
        └── [slug]/
            └── +page.svelte  → /lessons/03-routing/hello-world`;

	const dynamicPageCode = `<!-- src/routes/lessons/03-routing/[slug]/+page.svelte -->
<script lang="ts">
  // 'data' comes from the load() function in +page.ts
  let { data } = $props();
${'</'}script>

<h1>Slug is: {data.slug}</h1>`;

	const dynamicLoadCode = `// src/routes/lessons/03-routing/[slug]/+page.ts
import type { PageLoad } from './$types';

// load() runs on server (first visit) and client (navigation)
// params.slug is extracted from the URL segment [slug]
export const load: PageLoad = ({ params }) => {
  return { slug: params.slug };
  // ⚠️ Without this file, data.slug in +page.svelte is undefined
};`;

	const layoutCode = `<!-- src/routes/+layout.svelte -->
<script lang="ts">
  let { children } = $props(); // Svelte 5 snippet (replaces <slot>)
${'</'}script>

<nav><!-- shared navigation --></nav>

<!-- CRITICAL: without this, child pages never render -->
{@render children()}`;
</script>

<svelte:head>
	<title>Lesson 03 — Routing · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit uses your file system as the router. Every +page.svelte file corresponds to a URL. Dynamic segments like [slug] capture URL params. +layout.svelte wraps child routes. Navigation between pages is client-side after initial load."
	whatFails="Without file-based routing you'd manually configure a router. Without +layout.svelte every page duplicates shared UI. Without render-children in layout, child pages never appear — the most common beginner mistake."
>
	<!-- Current URL display -->
	<div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
		<span class="text-[10px] font-bold uppercase tracking-widest text-white/40">Current URL</span>
		<code class="text-sm font-mono text-(--color-accent)">{$page.url.pathname}</code>
	</div>

	<!-- Route structure code -->
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="FolderTree" size={20} class="text-(--color-accent)" />
		File → URL Mapping
	</h3>
	<CodeBlock code={routeCode} lang="bash" filename="routes structure" />

	<!-- Dynamic routes demo -->
	<div class="h-px bg-white/10 my-10"></div>
	<h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
		<LessonIcon name="Link" size={20} class="text-(--color-accent)" />
		Dynamic Routes — [slug]
	</h3>
	<p class="text-sm text-white/60 leading-relaxed mb-6">
		The folder <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">[slug]</code> captures any URL segment. Click a link below to see a live dynamic
		route:
	</p>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
		{#each demoSlugs as slug (slug)}
			<a href={resolve(`/lessons/03-routing/${slug}` as unknown as "/")} class="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-(--color-accent)/50 transition-all group no-underline">
				<code class="text-sm text-white/70 group-hover:text-white">/lessons/03-routing/<strong class="text-(--color-accent)">{slug}</strong></code>
				<LessonIcon name="ChevronRight" size={16} class="text-white/20 group-hover:text-(--color-accent) transition-colors" />
			</a>
		{/each}
	</div>

	<!-- Code for dynamic route -->
	<CodeBlock code={dynamicPageCode} lang="svelte" filename="+page.svelte (dynamic)" />
	<CodeBlock code={dynamicLoadCode} lang="typescript" filename="+page.ts (load function)" />

	<!-- Layout demo -->
	<div class="h-px bg-white/10 my-10"></div>
	<h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
		<LessonIcon name="Layers" size={20} class="text-(--color-accent)" />
		Layout Nesting
	</h3>
	<p class="text-sm text-white/60 leading-relaxed mb-6">
		The sidebar you see on this page is rendered by
		<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">src/routes/+layout.svelte</code> — it wraps EVERY page in the app.
		<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">src/routes/lessons/+layout.svelte</code> could add a lesson-specific shell around just
		lesson pages.
	</p>
	<CodeBlock code={layoutCode} lang="svelte" filename="+layout.svelte" />

	<!-- Comparison table -->
	<!-- Comparison table -->
	<div class="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-white/2 border-b border-white/10">
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">File</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">URL</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">What breaks if missing</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/5">
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4"><code class="text-xs text-white/80">routes/+page.svelte</code></td>
					<td class="px-6 py-4"><code class="text-xs text-(--color-accent)">/</code></td>
					<td class="px-6 py-4 text-sm text-white/60 italic">Homepage returns 404</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4"><code class="text-xs text-white/80">routes/about/+page.svelte</code></td>
					<td class="px-6 py-4"><code class="text-xs text-(--color-accent)">/about</code></td>
					<td class="px-6 py-4 text-sm text-white/60 italic">/about returns 404</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4"><code class="text-xs text-white/80">routes/blog/[slug]/+page.svelte</code></td>
					<td class="px-6 py-4"><code class="text-xs text-(--color-accent)">/blog/:slug</code></td>
					<td class="px-6 py-4 text-sm text-white/60 italic">All blog post URLs 404</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4"><code class="text-xs text-white/80">routes/+layout.svelte</code></td>
					<td class="px-6 py-4 text-sm text-white/40 italic">All routes</td>
					<td class="px-6 py-4 text-sm text-white/60 italic">Shared nav/footer disappears</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>

