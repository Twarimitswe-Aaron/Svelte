<!--
  Lesson 02 — Routing
  
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
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';

	const lesson = lessons[1];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// Some example slug values to demonstrate dynamic routes
	const demoSlugs = ['hello-world', 'svelte-5-runes', 'my-first-post'];

	const routeCode = `src/routes/
├── +page.svelte             → /
├── about/
│   └── +page.svelte         → /about
└── lessons/
    ├── +layout.svelte        → wraps all /lessons/* pages
    └── 02-routing/
        ├── +page.svelte      → /lessons/02-routing  ← you are here
        └── [slug]/
            └── +page.svelte  → /lessons/02-routing/hello-world`;

	const dynamicPageCode = `<!-- src/routes/lessons/02-routing/[slug]/+page.svelte -->
<script lang="ts">
  // 'data' comes from the load() function in +page.ts
  let { data } = $props();
${'</'}script>

<h1>Slug is: {data.slug}</h1>`;

	const dynamicLoadCode = `// src/routes/lessons/02-routing/[slug]/+page.ts
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
	<title>Lesson 02 — Routing · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit uses your file system as the router. Every +page.svelte file corresponds to a URL. Dynamic segments like [slug] capture URL params. +layout.svelte wraps child routes. Navigation between pages is client-side after initial load."
	whatFails="Without file-based routing you'd manually configure a router. Without +layout.svelte every page duplicates shared UI. Without render-children in layout, child pages never appear — the most common beginner mistake."
>
	<!-- Current URL display -->
	<div class="url-display">
		<span class="url-label">Current URL</span>
		<code class="url-value">{$page.url.pathname}</code>
	</div>

	<!-- Route structure code -->
	<h3 class="sub-heading">File → URL Mapping</h3>
	<CodeBlock code={routeCode} lang="bash" filename="routes structure" />

	<!-- Dynamic routes demo -->
	<div class="separator"></div>
	<h3 class="sub-heading">🔗 Dynamic Routes — [slug]</h3>
	<p class="demo-text">
		The folder <code>[slug]</code> captures any URL segment. Click a link below to see a live dynamic
		route:
	</p>
	<div class="slug-links">
		{#each demoSlugs as slug (slug)}
			<a href={resolve(("/lessons/02-routing/" + slug) as unknown as "/")} class="slug-link">
				/lessons/02-routing/<strong>{slug}</strong>
			</a>
		{/each}
	</div>

	<!-- Code for dynamic route -->
	<CodeBlock code={dynamicPageCode} lang="svelte" filename="+page.svelte (dynamic)" />
	<CodeBlock code={dynamicLoadCode} lang="typescript" filename="+page.ts (load function)" />

	<!-- Layout demo -->
	<div class="separator"></div>
	<h3 class="sub-heading">🧩 Layout Nesting</h3>
	<p class="demo-text">
		The sidebar you see on this page is rendered by
		<code>src/routes/+layout.svelte</code> — it wraps EVERY page in the app.
		<code>src/routes/lessons/+layout.svelte</code> could add a lesson-specific shell around just
		lesson pages.
	</p>
	<CodeBlock code={layoutCode} lang="svelte" filename="+layout.svelte" />

	<!-- Comparison table -->
	<div class="table-wrap">
		<table class="route-table">
			<thead>
				<tr>
					<th>File</th>
					<th>URL</th>
					<th>What breaks if missing</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>routes/+page.svelte</code></td>
					<td><code>/</code></td>
					<td>Homepage returns 404</td>
				</tr>
				<tr>
					<td><code>routes/about/+page.svelte</code></td>
					<td><code>/about</code></td>
					<td>/about returns 404</td>
				</tr>
				<tr>
					<td><code>routes/blog/[slug]/+page.svelte</code></td>
					<td><code>/blog/:slug</code></td>
					<td>All blog post URLs 404</td>
				</tr>
				<tr>
					<td><code>routes/+layout.svelte</code></td>
					<td>All routes</td>
					<td>Shared nav/footer disappears</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>

