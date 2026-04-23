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
<\/script>

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
<\/script>

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
	whatFails="Without file-based routing, you'd manually configure a router. Without +layout.svelte, every page duplicates shared UI. Without {@render children()}, child pages content never appears — the most common beginner mistake."
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
		{#each demoSlugs as slug}
			<a href="/lessons/02-routing/{slug}" class="slug-link">
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

<style>
	.url-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	.url-label {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.url-value {
		color: var(--color-success);
		font-size: 0.9rem;
	}

	.sub-heading {
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
	}

	.demo-text {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		margin: 0 0 0.75rem;
		line-height: 1.65;
	}

	.slug-links {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		margin-bottom: 1rem;
	}

	.slug-link {
		display: inline-flex;
		padding: 0.4rem 0.75rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.825rem;
		font-family: monospace;
		color: var(--color-accent);
		text-decoration: none;
		transition: border-color 0.15s;
	}
	.slug-link:hover {
		border-color: var(--color-accent);
		text-decoration: none;
	}

	.separator {
		height: 1px;
		background: var(--color-border);
		margin: 1.5rem 0;
	}

	.table-wrap {
		overflow-x: auto;
		margin-top: 1rem;
	}

	.route-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.825rem;
	}

	.route-table th {
		text-align: left;
		padding: 0.6rem 0.75rem;
		background: var(--color-surface-2);
		color: var(--color-text-muted);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border-bottom: 1px solid var(--color-border);
	}

	.route-table td {
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}

	.route-table td:first-child { color: var(--color-accent); }
	.route-table td:nth-child(2) { color: var(--color-success); }

	.route-table tr:last-child td { border-bottom: none; }
	.route-table tr:hover td { background: var(--color-surface-2); }
</style>
