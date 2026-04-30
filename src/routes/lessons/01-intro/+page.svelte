<!--
  Lesson 01 — Introduction & Project Structure
  
  CONCEPT: SvelteKit is a framework built on Svelte + Vite.
  Every file in src/routes/ maps to a URL.
  +page.svelte = the page UI
  +layout.svelte = shared wrapper
  +server.ts = server-only API
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { LayoutTemplate, Box, Folder, FileText, Puzzle, Lock, Zap, Globe, AlertTriangle, Package, Home, Settings, Wrench } from 'lucide-svelte';

	const lesson = lessons[0];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// The SvelteKit project file tree shown as an interactive explanation
	const files = [
		{
			name: 'src/routes/',
			icon: Folder,
			type: 'dir',
			desc: 'Every file here becomes a route. The folder name = the URL path.',
			failing: 'If you rename this to "pages/" SvelteKit 404s on everything.'
		},
		{
			name: '+page.svelte',
			icon: FileText,
			type: 'page',
			desc: 'The UI rendered for a route. Must be named exactly "+page.svelte".',
			failing: 'Without it, navigating to that URL returns a 404 error.'
		},
		{
			name: '+layout.svelte',
			icon: Puzzle,
			type: 'layout',
			desc: 'Wraps all sibling pages and child routes. Contains {@render children()}.',
			failing: 'Without {@render children()}, child pages never display — silent blank screen.'
		},
		{
			name: '+page.server.ts',
			icon: Lock,
			type: 'server',
			desc: 'Server-only load functions and form actions. Never sent to the browser.',
			failing: 'Sensitive logic placed in +page.ts instead leaks to the client bundle.'
		},
		{
			name: '+page.ts',
			icon: Zap,
			type: 'universal',
			desc: 'Universal load: runs on server for first load, then in browser on navigation.',
			failing: 'Without it, you cannot pass structured data to your +page.svelte component.'
		},
		{
			name: '+server.ts',
			icon: Globe,
			type: 'api',
			desc: 'Creates a REST API endpoint (GET, POST, DELETE, etc.) at that URL.',
			failing: 'Without it, fetching that URL from a form or fetch() returns 405 Method Not Allowed.'
		},
		{
			name: '+error.svelte',
			icon: AlertTriangle,
			type: 'error',
			desc: 'Custom error page shown when load() throws or returns error().',
			failing: 'Without it, SvelteKit falls back to a plain default error page with no branding.'
		},
		{
			name: 'src/lib/',
			icon: Package,
			type: 'dir',
			desc: 'Importable as $lib/... — shared utilities, components, types.',
			failing: 'Without $lib alias, every import needs a long relative path like ../../../../utils.'
		},
		{
			name: 'src/app.html',
			icon: Home,
			type: 'template',
			desc: 'The HTML shell. %sveltekit.head% and %sveltekit.body% are required placeholders.',
			failing: 'Remove %sveltekit.body% and the entire app goes blank — no JS mounts at all.'
		},
		{
			name: 'svelte.config.js',
			icon: Settings,
			type: 'config',
			desc: 'Controls the adapter (how the app is deployed) and compiler options.',
			failing: 'Without an adapter, `vite build` produces no server — not deployable.'
		},
		{
			name: 'vite.config.ts',
			icon: Wrench,
			type: 'config',
			desc: 'Vite bundler config. The sveltekit() plugin is required.',
			failing: 'Remove sveltekit() plugin and HMR, SSR, and routing all break immediately.'
		}
	];

	const typeColors: Record<string, string> = {
		dir: '#58a6ff',
		page: '#3fb950',
		layout: '#bc8cff',
		server: '#f85149',
		universal: '#d29922',
		api: '#58a6ff',
		error: '#f85149',
		template: '#8b949e',
		config: '#8b949e'
	};

	let selected = $state<(typeof files)[0] | null>(null);

	const structureCode = `src/
├── app.html          ← HTML shell (%sveltekit.head%, %sveltekit.body%)
├── app.css           ← global styles
└── routes/
    ├── +layout.svelte       ← root layout (wraps ALL pages)
    ├── +page.svelte         ← renders at "/"
    ├── about/
    │   └── +page.svelte     ← renders at "/about"
    └── blog/
        ├── +layout.svelte   ← layout for /blog/*
        ├── +page.svelte     ← renders at "/blog"
        └── [slug]/
            ├── +page.svelte        ← renders at "/blog/hello-world"
            └── +page.server.ts     ← server-only load`;

	const cssCode = `\x3Cscript lang="ts">
	// 1. Component logic & state
	let greeting = "Hello World";
\x3C/script>

<!-- 2. Markup -->
<div class="my-class">{greeting}</div>

\x3Cstyle>
	/* 3. Native Svelte styles are scoped by default */
	.my-class {
		color: red;
	}
\x3C/style>`;
</script>

<svelte:head>
	<title>Lesson 01 — Introduction · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit is a full-stack web framework. It handles routing, server-side rendering, data loading, form handling, and deployment adaptors — all configured through a convention-based file system."
	whatFails="Without SvelteKit you'd manually wire up a router, bundler, SSR engine, and deployment pipeline. Without understanding the file conventions (+page, +layout, +server), none of your routes will work."
>
	<!-- Project tree explorer -->
	<div class="mb-6">
		<h3 class="mb-4 text-[0.95rem] font-bold text-(--color-text)">📁 Click each file to learn its role</h3>
		<div class="grid grid-cols-1 items-start gap-4 sm:grid-cols-[240px_1fr]">
			<div class="flex flex-col gap-1">
				{#each files as file (file.name)}
					{@const Icon = file.icon}
					<button
						class="flex cursor-pointer items-center gap-2 rounded-lg border bg-(--color-surface-2) px-3 py-2 text-left text-(--color-text) transition-all duration-150 hover:bg-white/5 hover:border-(--type-color) {selected === file ? 'bg-white/5 shadow-[0_0_0_2px_color-mix(in_srgb,var(--type-color)_25%,transparent)] border-(--type-color)' : 'border-(--color-border)'}"
						onclick={() => (selected = selected === file ? null : file)}
						style="--type-color: {typeColors[file.type]}"
					>
						<span class="text-base"><Icon size={16} /></span>
						<code class="text-[0.775rem] text-(--type-color)">{file.name}</code>
					</button>
				{/each}
			</div>

			<div class="min-h-[160px]" class:visible={!!selected}>
				{#if selected}
					{@const SelectedIcon = selected.icon}
					<div class="animate-fade-in overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface-2)">
						<div class="flex items-center gap-2 border-b border-(--color-border) bg-(--color-surface) px-4 py-3">
							<span class="text-[1.1rem]"><SelectedIcon size={20} /></span>
							<code class="text-[0.85rem] text-(--color-accent)">{selected.name}</code>
						</div>
						<div class="p-4">
							<div class="mb-3 last:mb-0">
								<span class="text-[0.7rem] font-bold uppercase tracking-widest text-(--color-accent)">💡 What it does</span>
								<p class="mb-0 mt-1 text-[0.85rem] leading-relaxed text-(--color-text-muted)">{selected.desc}</p>
							</div>
							<div class="mb-3 last:mb-0">
								<span class="text-[0.7rem] font-bold uppercase tracking-widest text-(--color-danger)">⚠️ What fails without it</span>
								<p class="mb-0 mt-1 text-[0.85rem] leading-relaxed text-(--color-text-muted)">{selected.failing}</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex h-[160px] items-center justify-center rounded-xl border border-dashed border-(--color-border) p-4 text-center text-[0.85rem] text-(--color-text-muted)">
						← Click a file on the left to see what it does and what breaks without it
					</div>
				{/if}
			</div>
		</div>
	</div>

	<h3 class="mb-4 mt-8 flex items-center gap-2 text-[0.95rem] font-bold text-(--color-text)">
		<LayoutTemplate size={18} /> Standard Project Structure
	</h3>
	<CodeBlock code={structureCode} lang="bash" filename="project tree" />

	<!-- Styling note -->
	<div class="my-6 h-px bg-(--color-border)"></div>

	<h3 class="mb-4 flex items-center gap-2 text-[0.95rem] font-bold text-(--color-text)">
		<Box size={18} /> A Note on Styling
	</h3>

	<CodeBlock code={cssCode} lang="svelte" filename="+page.svelte" />

	<div class="mb-8 mt-4 rounded-xl border border-(--color-border) bg-(--color-surface-2) p-5 text-[0.875rem] leading-relaxed text-(--color-text-muted)">
		<p class="m-0 mb-4 font-bold text-(--color-accent)">
			⚠️ In this codebase, we exclusively leverage Tailwind CSS.
		</p>
		<p class="m-0">
			Svelte has a powerful native styling approach (shown above) which automatically scopes styles to components. However, for large-scale apps, you can easily integrate Tailwind (as we have globally) for rapid, utility-first UI development.
		</p>
	</div>

	<!-- SvelteKit vs Svelte comparison -->
	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<div class="compare-card compare-svelte">
			<h4>🔴 Plain Svelte</h4>
			<ul>
				<li>UI components only</li>
				<li>No router included</li>
				<li>No SSR / data loading</li>
				<li>You build the app shell yourself</li>
			</ul>
		</div>
		<div class="compare-card compare-kit">
			<h4>🟢 SvelteKit</h4>
			<ul>
				<li>Full-stack framework</li>
				<li>File-based routing built in</li>
				<li>SSR + streaming + prerendering</li>
				<li>Adapters for any platform</li>
			</ul>
		</div>
	</div>
</LessonLayout>
