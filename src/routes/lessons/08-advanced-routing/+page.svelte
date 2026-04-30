<!--
  Lesson 08 — Advanced Routing
  
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
	import { resolve } from '$app/paths';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[7];
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
</script>

<svelte:head>
	<title>Lesson 08 — Advanced Routing · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Advanced routing covers: rest params [...path] for catch-all routes, optional params [[lang]], custom route matchers that validate param values, layout groups (group) that share layouts without URL segments, and @ notation to break out of layout inheritance."
	whatFails="Without these: 404s for unmatched routes, duplicate route files for optional segments, manual validation in every load(), duplicate layout code, and impossible-to-break layout inheritance chains."
>
	<!-- Topic tabs -->
	<div class="flex flex-wrap gap-2 mb-8">
		{#each topics as topic (topic.id)}
			<button
				class="px-4 py-2 rounded-xl border transition-all text-sm font-medium flex items-center gap-2 {selected.id === topic.id ? 'bg-(--color-accent) border-(--color-accent) text-white shadow-lg shadow-(--color-accent)/20' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}"
				onclick={() => (selected = topic)}
			>
				<span class="text-lg">{topic.emoji}</span>
				<span>{topic.title.split(' ')[0]}</span>
			</button>
		{/each}
	</div>

	{#key selected.id}
	<div class="p-8 rounded-2xl border border-white/10 bg-white/5 animate-fade-in">
		<div class="mb-8 pb-8 border-b border-white/10">
			<h3 class="text-xl font-bold text-white flex items-center gap-3 mb-2">
				<span class="text-2xl">{selected.emoji}</span>
				{selected.title}
			</h3>
			<p class="text-sm text-white/50 leading-relaxed max-w-2xl">{selected.desc}</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
			<div class="p-6 rounded-xl border border-white/5 bg-white/2 space-y-3">
				<span class="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
					<LessonIcon name="Lightbulb" size={14} class="text-(--color-accent)" />
					What it does
				</span>
				<p class="text-sm text-white/70 leading-relaxed">{selected.what}</p>
			</div>
			<div class="p-6 rounded-xl border border-white/5 bg-white/2 space-y-3">
				<span class="text-[10px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-2">
					<LessonIcon name="ShieldAlert" size={14} class="text-red-400" />
					Failure mode
				</span>
				<p class="text-sm text-white/70 leading-relaxed">{selected.fails}</p>
			</div>
		</div>

		<CodeBlock code={selected.code} lang="typescript" />
	</div>
	{/key}

	<!-- Live catch-all demo -->
	<div class="h-px bg-white/10 my-10"></div>
	<h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
		<LessonIcon name="Link" size={20} class="text-(--color-accent)" />
		Try the catch-all route
	</h3>
	<p class="text-sm text-white/60 leading-relaxed mb-6">
		The route <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">08-advanced-routing/[...path]</code> catches any sub-URL. Try these:
	</p>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
		{#each ['/lessons/08-advanced-routing/foo', '/lessons/08-advanced-routing/foo/bar/baz', '/lessons/08-advanced-routing/any/deep/path'] as link (link)}
			<a href={resolve(link as any)} class="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-(--color-accent)/50 transition-all group no-underline">
				<code class="text-xs text-white/70 group-hover:text-white truncate pr-4">{link}</code>
				<LessonIcon name="ChevronRight" size={16} class="text-white/20 group-hover:text-(--color-accent) transition-colors shrink-0" />
			</a>
		{/each}
	</div>
</LessonLayout>

