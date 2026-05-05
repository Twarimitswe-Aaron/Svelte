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
  // <TriangleAlert size={16} /> Without this file, data.slug in +page.svelte is undefined
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
	<div
		class="mb-6 gap-3 rounded-lg px-4 py-3 flex items-center border border-(--color-border) bg-(--color-surface-2) text-[0.875rem]"
	>
		<span
			class="font-bold shrink-0 text-[0.7rem] tracking-[0.08em] text-(--color-text-muted) uppercase"
			>Current URL</span
		>
		<code class="text-[0.9rem] text-(--color-success)">{$page.url.pathname}</code>
	</div>

	<!-- Route structure code -->
	<h3 class="mb-3 font-bold text-white gap-2 flex items-center text-[0.95rem]">
		<LessonIcon name="FolderTree" size={20} class="text-(--color-accent)" />
		File → URL Mapping
	</h3>
	<CodeBlock code={routeCode} lang="bash" filename="routes structure" />

	<!-- Dynamic routes demo -->
	<div class="my-6 h-px bg-(--color-border)"></div>
	<h3 class="mb-3 font-bold text-white gap-2 flex items-center text-[0.95rem]">
		<LessonIcon name="Link" size={20} class="text-(--color-accent)" />
		Dynamic Routes — [slug]
	</h3>
	<p class="mb-3 text-[0.875rem] leading-[1.65] text-(--color-text-muted)">
		The folder <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">[slug]</code> captures
		any URL segment. Click a link below to see a live dynamic route:
	</p>
	<div class="mb-4 gap-1.5 flex flex-col">
		{#each demoSlugs as slug (slug)}
			<a
				href={resolve(`/lessons/03-routing/${slug}` as unknown as '/')}
				class="rounded-md px-3 py-1.5 font-mono inline-flex border border-(--color-border) bg-(--color-surface-2) text-[0.825rem] text-(--color-accent) no-underline transition-colors hover:border-(--color-accent) hover:no-underline"
			>
				<code class="text-xs"
					>/lessons/03-routing/<strong class="text-(--color-accent)">{slug}</strong></code
				>
			</a>
		{/each}
	</div>

	<!-- Code for dynamic route -->
	<CodeBlock code={dynamicPageCode} lang="svelte" filename="+page.svelte (dynamic)" />
	<CodeBlock code={dynamicLoadCode} lang="typescript" filename="+page.ts (load function)" />

	<!-- Layout demo -->
	<div class="my-6 h-px bg-(--color-border)"></div>
	<h3 class="mb-3 font-bold text-white gap-2 flex items-center text-[0.95rem]">
		<LessonIcon name="Layers" size={20} class="text-(--color-accent)" />
		Layout Nesting
	</h3>
	<p class="mb-3 text-[0.875rem] leading-[1.65] text-(--color-text-muted)">
		The sidebar you see on this page is rendered by
		<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
			>src/routes/+layout.svelte</code
		>
		— it wraps EVERY page in the app.
		<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
			>src/routes/lessons/+layout.svelte</code
		> could add a lesson-specific shell around just lesson pages.
	</p>
	<CodeBlock code={layoutCode} lang="svelte" filename="+layout.svelte" />

	<!-- Comparison table -->
	<div class="mt-4 overflow-x-auto">
		<table class="w-full border-collapse text-[0.825rem]">
			<thead>
				<tr>
					<th
						class="px-3 py-2.5 font-bold border-b border-(--color-border) bg-(--color-surface-2) text-left text-[0.72rem] tracking-[0.06em] text-(--color-text-muted) uppercase"
						>File</th
					>
					<th
						class="px-3 py-2.5 font-bold border-b border-(--color-border) bg-(--color-surface-2) text-left text-[0.72rem] tracking-[0.06em] text-(--color-text-muted) uppercase"
						>URL</th
					>
					<th
						class="px-3 py-2.5 font-bold border-b border-(--color-border) bg-(--color-surface-2) text-left text-[0.72rem] tracking-[0.06em] text-(--color-text-muted) uppercase"
						>What breaks if missing</th
					>
				</tr>
			</thead>
			<tbody class="">
				<tr class="transition-colors hover:bg-(--color-surface-2)">
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-accent)"
						><code class="text-xs">routes/+page.svelte</code></td
					>
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-success)"
						><code class="text-xs">/</code></td
					>
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-text-muted) italic"
						>Homepage returns 404</td
					>
				</tr>
				<tr class="transition-colors hover:bg-(--color-surface-2)">
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-accent)"
						><code class="text-xs">routes/about/+page.svelte</code></td
					>
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-success)"
						><code class="text-xs">/about</code></td
					>
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-text-muted) italic"
						>/about returns 404</td
					>
				</tr>
				<tr class="transition-colors hover:bg-(--color-surface-2)">
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-accent)"
						><code class="text-xs">routes/blog/[slug]/+page.svelte</code></td
					>
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-success)"
						><code class="text-xs">/blog/:slug</code></td
					>
					<td class="px-3 py-2.5 border-b border-(--color-border) text-(--color-text-muted) italic"
						>All blog post URLs 404</td
					>
				</tr>
				<tr class="transition-colors hover:bg-(--color-surface-2)">
					<td class="px-3 py-2.5 border-b-0 text-(--color-accent)"
						><code class="text-xs">routes/+layout.svelte</code></td
					>
					<td class="px-3 py-2.5 border-b-0 text-(--color-success)">All routes</td>
					<td class="px-3 py-2.5 border-b-0 text-(--color-text-muted) italic"
						>Shared nav/footer disappears</td
					>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>
