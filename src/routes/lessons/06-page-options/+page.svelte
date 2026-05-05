<!--
  Lesson 06 — Page Options
  
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
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[5];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const options = [
		{
			name: 'prerender',
			type: 'boolean | "auto"',
			default_val: 'false',
			emoji: '🏗️',
			what: 'Generates a static HTML file at build time instead of rendering on each request. Ideal for content that never changes.',
			fails:
				"If your page uses form actions or reads request-specific data (cookies), prerendering fails — you'll get a build error.",
			example: `// +page.ts or +page.server.ts
export const prerender = true;
// Now this page is: vite build → static .html file
// NOTE: Cannot use: cookies, form actions, dynamic request data`,
			whenToUse: 'About pages, blog posts, docs, marketing pages.'
		},
		{
			name: 'ssr',
			type: 'boolean',
			default_val: 'true',
			emoji: '🖥️',
			what: 'Server-side rendering: the page HTML is generated on the server before sending to the browser. Enables SEO and fast first paint.',
			fails:
				"Disabling SSR (ssr = false) means the page is blank on first load until JavaScript runs — search engines can't index it. Also, load() still runs on server unless you disable SSR.",
			example: `// +page.ts
export const ssr = false;
// Page skips SSR — starts as empty HTML
// JS hydrates it client-side
// NOTE: SEO will be poor — Googlebot can't read the content`,
			whenToUse:
				'Admin dashboards, auth-gated pages where SEO is not needed. Combine with csr=true.'
		},
		{
			name: 'csr',
			type: 'boolean',
			default_val: 'true',
			emoji: '🌐',
			what: 'Client-side rendering: JavaScript runs in the browser to hydrate and enable interactivity. Required for any reactivity.',
			fails:
				'Setting csr = false turns the page into pure HTML — no reactivity, no event listeners, no Svelte state. Clicks and inputs do nothing.',
			example: `// +page.ts
export const csr = false;
// 100% server-rendered HTML — no JS sent
// NOTE: onClick, $state, etc. will NOT work
// Good for: pure read-only content pages`,
			whenToUse: 'Combine with prerender=true for totally static, zero-JS pages.'
		},
		{
			name: 'trailingSlash',
			type: '"never" | "always" | "ignore"',
			default_val: '"never"',
			emoji: '🔗',
			what: 'Controls whether trailing slashes are added/removed from URLs. "never" redirects /about/ → /about. "always" adds the slash.',
			fails:
				'Inconsistent trailing slashes cause duplicate content issues for SEO. Without configuring this, /about and /about/ may return different responses.',
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
	<title>Lesson 06 — Page Options · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Page options are exported constants from +page.ts or +layout.ts that control how SvelteKit renders your page: static prerendering at build time, server-side rendering, client-side JS hydration, and URL slash behaviour."
	whatFails="Using wrong options for your use case causes: broken SEO (ssr=false on public pages), failed builds (prerender=true with cookies), zero interactivity (csr=false with reactive state), or duplicate-content URL issues (trailingSlash mismatch)."
>
	<!-- Interactive option explorer -->
	<div class="space-y-8">
		<div class="gap-2 flex flex-wrap">
			{#each options as opt (opt.name)}
				<button
					class="px-4 py-2 rounded-xl text-sm font-medium gap-2 flex items-center border transition-all {selected ===
					opt
						? 'text-white shadow-lg border-(--color-accent) bg-(--color-accent) shadow-(--color-accent)/20'
						: 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}"
					onclick={() => (selected = opt)}
				>
					<span class="text-lg">{opt.emoji}</span>
					<code class="text-xs">{opt.name}</code>
				</button>
			{/each}
		</div>

		{#key selected.name}
			<div class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur animate-fade-in border">
				<div
					class="md:flex-row md:items-center gap-6 mb-8 pb-8 border-white/10 flex flex-col justify-between border-b"
				>
					<div>
						<h3 class="text-xl font-bold text-white gap-2 mb-2 flex items-center">
							<span class="text-2xl">{selected.emoji}</span>
							<code class="text-lg text-(--color-accent)">export const {selected.name}</code>
						</h3>
						<div class="gap-3 flex flex-wrap">
							<span
								class="px-2 py-1 rounded-md bg-white/5 border-white/10 font-bold tracking-widest text-white/40 border text-[10px] uppercase"
								>Type: <code class="text-white/80">{selected.type}</code></span
							>
							<span
								class="px-2 py-1 rounded-md bg-white/5 border-white/10 font-bold tracking-widest text-white/40 border text-[10px] uppercase"
								>Default: <code class="text-white/80">{selected.default_val}</code></span
							>
						</div>
					</div>
				</div>

				<div class="lg:grid-cols-3 gap-6 mb-10 grid grid-cols-1">
					<div class="p-6 rounded-xl border-white/5 bg-white/2 space-y-3 glass-blur border">
						<span
							class="font-bold tracking-widest text-white/30 gap-2 flex items-center text-[10px] uppercase"
						>
							<LessonIcon name="Lightbulb" size={14} class="text-(--color-accent)" />
							What it does
						</span>
						<p class="text-sm text-white/70 leading-relaxed">{selected.what}</p>
					</div>
					<div class="p-6 rounded-xl border-white/5 bg-white/2 space-y-3 glass-blur border">
						<span
							class="font-bold tracking-widest text-white/30 gap-2 flex items-center text-[10px] uppercase"
						>
							<LessonIcon name="ShieldAlert" size={14} class="text-red-400" />
							Failure mode
						</span>
						<p class="text-sm text-white/70 leading-relaxed">{selected.fails}</p>
					</div>
					<div class="p-6 rounded-xl border-white/5 bg-white/2 space-y-3 glass-blur border">
						<span
							class="font-bold tracking-widest text-white/30 gap-2 flex items-center text-[10px] uppercase"
						>
							<LessonIcon name="CheckCircle" size={14} class="text-green-400" />
							When to use
						</span>
						<p class="text-sm text-white/70 leading-relaxed">{selected.whenToUse}</p>
					</div>
				</div>

				<CodeBlock code={selected.example} lang="typescript" filename="+page.ts" />
			</div>
		{/key}
	</div>

	<div class="bg-white/10 my-12 h-px"></div>

	<h3 class="text-xl font-bold text-white mb-6">Combining Options</h3>
	<CodeBlock code={exportCode} lang="typescript" filename="+layout.ts / +page.ts" />

	<!-- Visual matrix -->
	<div class="mt-12 rounded-xl border-white/10 bg-white/5 glass-blur overflow-hidden border">
		<table class="w-full border-collapse text-left">
			<thead>
				<tr class="bg-white/2 border-white/10 border-b">
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>Use case</th
					>
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>prerender</th
					>
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>ssr</th
					>
					<th class="px-6 py-4 font-bold tracking-widest text-white/40 text-[10px] uppercase"
						>csr</th
					>
				</tr>
			</thead>
			<tbody class="divide-white/5 divide-y">
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Blog post</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Admin dashboard</td>
					<td class="px-6 py-4 text-sm text-red-400 font-mono">false</td>
					<td class="px-6 py-4 text-sm text-red-400 font-mono">false</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Zero-JS static page</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
					<td class="px-6 py-4 text-sm text-red-400 font-mono">false</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Marketing page</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
					<td class="px-6 py-4 text-sm text-green-400 font-mono">true</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>
