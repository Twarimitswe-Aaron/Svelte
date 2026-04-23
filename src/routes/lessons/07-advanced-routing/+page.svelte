<!--
  Lesson 07 — Advanced Routing
  
  CONCEPTS SHOWN:
  1. Rest parameters [...path] — catch-all routes
  2. Optional parameters [[lang]] — optional URL segments
  3. Route matchers (params/integer.ts)
  4. Layout groups (auth) — shared layout without URL segment
  5. Breaking out of layouts with @
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { page } from '$app/stores';

	const lesson = lessons[6];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const topics = [
		{
			id: 'rest',
			emoji: '🌊',
			title: 'Rest Parameters [...path]',
			desc: 'Catches zero or more URL segments. Often used for 404 pages or file-system-like routes.',
			what: 'A catch-all route that matches /a, /a/b, /a/b/c etc. The path variable is an array of segments.',
			fails: 'Without a catch-all, any unmatched deep URL returns SvelteKit\'s default "Not found" page instead of your custom one.',
			code: `// src/routes/[...path]/+page.svelte matches ANYTHING unmatched
// /foo       → params.path = 'foo'
// /foo/bar   → params.path = 'foo/bar'
// /          → params.path = '' (empty string)

// +page.ts
export const load = ({ params }) => ({
  segments: params.path.split('/').filter(Boolean)
});

// Use case: 404 page
// src/routes/[...404]/+error.svelte catches all unmatched routes`
		},
		{
			id: 'optional',
			emoji: '❓',
			title: 'Optional Parameters [[lang]]',
			desc: 'Makes a URL segment optional. The route matches both /en/blog and /blog.',
			what: 'Double brackets [[param]] make the segment optional. Useful for internationalised routes where the language prefix is optional.',
			fails: 'Without optional params, you need two separate routes: /blog and /[lang]/blog — duplicating code.',
			code: `// src/routes/[[lang]]/blog/+page.svelte
// Matches: /blog   AND   /en/blog   AND   /fr/blog

export const load = ({ params }) => ({
  lang: params.lang ?? 'en' // defaults to 'en' if not provided
});`
		},
		{
			id: 'matchers',
			emoji: '🎯',
			title: 'Route Matchers',
			desc: 'Restricts what values a dynamic param can match using a custom function.',
			what: 'Custom match functions in src/params/*.ts control which values [param] accepts. This prevents invalid routes from matching.',
			fails: 'Without a matcher, /users/abc matches [id] even if your app only works with numeric IDs — you\'d need to validate inside load().',
			code: `// src/params/integer.ts
export function match(value: string) {
  return /^\\d+$/.test(value); // only matches digits
}

// src/routes/users/[id=integer]/+page.svelte
// /users/42  → ✅ matches (42 is an integer)
// /users/abc → ❌ no match → falls through to next route or 404

export const load = ({ params }) => ({
  userId: parseInt(params.id) // id is guaranteed to be numeric
});`
		},
		{
			id: 'groups',
			emoji: '📁',
			title: 'Layout Groups (group)',
			desc: 'Groups routes under a shared layout WITHOUT adding a URL segment.',
			what: '(group) folders apply a +layout.svelte to all routes inside without appearing in the URL. Perfect for auth-gated sections.',
			fails: 'Without groups, you\'d either add unnecessary URL segments or duplicate the auth layout code across many pages.',
			code: `// Directory structure:
// src/routes/
//   (authenticated)/          ← no URL segment, just a layout group
//     +layout.svelte           ← this layout applies to both pages below
//     dashboard/+page.svelte  → /dashboard
//     settings/+page.svelte   → /settings
//   (public)/
//     +layout.svelte           ← different layout
//     about/+page.svelte      → /about
//     login/+page.svelte      → /login

// (authenticated)/+layout.svelte
// Can check auth and redirect if not logged in`
		},
		{
			id: 'breaking',
			emoji: '💥',
			title: 'Breaking Out of Layouts (@)',
			desc: 'Opts a specific page out of an ancestor layout using @ notation.',
			what: 'page@layout-name.svelte uses a specific ancestor layout instead of the closest one. Useful when one page in a group needs a completely different shell.',
			fails: 'Without @, a full-screen landing page inside a dashboard group would be wrapped in the dashboard nav — ugly and structurally wrong.',
			code: `// Normal: +page.svelte uses the closest +layout.svelte
// Override: +page@root.svelte uses the root layout

// Example: an auth page inside an admin group
// src/routes/(admin)/login/+page@.svelte  ← uses root layout, not admin layout

// The @ value is the layout name (without + and .svelte)
// @ with nothing after means the ROOT layout`
		}
	];

	let selected = $state(topics[0]);

	const demoPath = $derived($page.url.pathname);
</script>

<svelte:head>
	<title>Lesson 07 — Advanced Routing · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Advanced routing covers: rest params [...path] for catch-all routes, optional params [[lang]], custom route matchers that validate param values, layout groups (group) that share layouts without URL segments, and @ notation to break out of layout inheritance."
	whatFails="Without these: 404s for unmatched routes, duplicate route files for optional segments, manual validation in every load(), duplicate layout code, and impossible-to-break layout inheritance chains."
>
	<!-- Topic tabs -->
	<div class="tab-selector">
		{#each topics as topic}
			<button
				class="topic-tab"
				class:active={selected.id === topic.id}
				onclick={() => (selected = topic)}
			>
				{topic.emoji} {topic.title.split(' ')[0]}
			</button>
		{/each}
	</div>

	<div class="topic-detail animate-fade-in">
		<div class="topic-header">
			<h3 class="topic-title">{selected.emoji} {selected.title}</h3>
			<p class="topic-desc">{selected.desc}</p>
		</div>

		<div class="topic-cards">
			<div class="tc what">
				<div class="tc-label">💡 What it does</div>
				<p>{selected.what}</p>
			</div>
			<div class="tc fails">
				<div class="tc-label">⚠️ What fails without it</div>
				<p>{selected.fails}</p>
			</div>
		</div>

		<CodeBlock code={selected.code} lang="typescript" />
	</div>

	<!-- Live catch-all demo -->
	<div class="separator"></div>
	<h3 class="sub-heading">🔗 Try the catch-all route</h3>
	<p class="demo-text">
		The route <code>07-advanced-routing/[...path]</code> catches any sub-URL. Try these:
	</p>
	<div class="slug-links">
		{#each ['/lessons/07-advanced-routing/foo', '/lessons/07-advanced-routing/foo/bar/baz', '/lessons/07-advanced-routing/any/deep/path'] as link}
			<a href={link} class="slug-link">{link}</a>
		{/each}
	</div>
</LessonLayout>

<style>
	.tab-selector {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.topic-tab {
		padding: 0.4rem 0.75rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		font-size: 0.8rem;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all 0.15s;
	}
	.topic-tab:hover { border-color: var(--color-accent); color: var(--color-text); }
	.topic-tab.active {
		background: rgba(88,166,255,0.1);
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.topic-detail {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		overflow: hidden;
	}

	.topic-header {
		padding: 1rem 1.25rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
	}

	.topic-title {
		font-size: 1rem;
		font-weight: 700;
		margin: 0 0 0.35rem;
	}

	.topic-desc {
		font-size: 0.825rem;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.6;
	}

	.topic-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		border-bottom: 1px solid var(--color-border);
	}

	@media (max-width: 600px) { .topic-cards { grid-template-columns: 1fr; } }

	.tc {
		padding: 0.875rem 1rem;
		border-right: 1px solid var(--color-border);
	}
	.tc:last-child { border-right: none; }

	.what { background: rgba(88,166,255,0.04); }
	.fails { background: rgba(248,81,73,0.04); }

	.tc-label {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
		margin-bottom: 0.4rem;
	}

	.tc p {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.6;
	}

	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }
	.demo-text { font-size: 0.875rem; color: var(--color-text-muted); margin: 0 0 0.75rem; line-height: 1.65; }

	.slug-links {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.slug-link {
		display: inline-flex;
		padding: 0.4rem 0.75rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		font-size: 0.8rem;
		font-family: monospace;
		color: var(--color-accent);
		text-decoration: none;
		transition: border-color 0.15s;
	}
	.slug-link:hover { border-color: var(--color-accent); text-decoration: none; }
</style>
