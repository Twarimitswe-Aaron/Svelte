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

	const lesson = lessons[0];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// The SvelteKit project file tree shown as an interactive explanation
	const files = [
		{
			name: 'src/routes/',
			icon: '📁',
			type: 'dir',
			desc: 'Every file here becomes a route. The folder name = the URL path.',
			failing: 'If you rename this to "pages/" SvelteKit 404s on everything.'
		},
		{
			name: '+page.svelte',
			icon: '📄',
			type: 'page',
			desc: 'The UI rendered for a route. Must be named exactly "+page.svelte".',
			failing: 'Without it, navigating to that URL returns a 404 error.'
		},
		{
			name: '+layout.svelte',
			icon: '🧩',
			type: 'layout',
			desc: 'Wraps all sibling pages and child routes. Contains {@render children()}.',
			failing: 'Without {@render children()}, child pages never display — silent blank screen.'
		},
		{
			name: '+page.server.ts',
			icon: '🔒',
			type: 'server',
			desc: 'Server-only load functions and form actions. Never sent to the browser.',
			failing: 'Sensitive logic placed in +page.ts instead leaks to the client bundle.'
		},
		{
			name: '+page.ts',
			icon: '⚡',
			type: 'universal',
			desc: 'Universal load: runs on server for first load, then in browser on navigation.',
			failing: 'Without it, you cannot pass structured data to your +page.svelte component.'
		},
		{
			name: '+server.ts',
			icon: '🌐',
			type: 'api',
			desc: 'Creates a REST API endpoint (GET, POST, DELETE, etc.) at that URL.',
			failing: 'Without it, fetching that URL from a form or fetch() returns 405 Method Not Allowed.'
		},
		{
			name: '+error.svelte',
			icon: '🚨',
			type: 'error',
			desc: 'Custom error page shown when load() throws or returns error().',
			failing: 'Without it, SvelteKit falls back to a plain default error page with no branding.'
		},
		{
			name: 'src/lib/',
			icon: '📦',
			type: 'dir',
			desc: 'Importable as $lib/... — shared utilities, components, types.',
			failing: 'Without $lib alias, every import needs a long relative path like ../../../../utils.'
		},
		{
			name: 'src/app.html',
			icon: '🏠',
			type: 'template',
			desc: 'The HTML shell. %sveltekit.head% and %sveltekit.body% are required placeholders.',
			failing: 'Remove %sveltekit.body% and the entire app goes blank — no JS mounts at all.'
		},
		{
			name: 'svelte.config.js',
			icon: '⚙️',
			type: 'config',
			desc: 'Controls the adapter (how the app is deployed) and compiler options.',
			failing: 'Without an adapter, `vite build` produces no server — not deployable.'
		},
		{
			name: 'vite.config.ts',
			icon: '🔧',
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
	<div class="tree-section">
		<h3 class="sub-heading">📁 Click each file to learn its role</h3>
		<div class="tree-layout">
			<div class="file-list">
				{#each files as file}
					<button
						class="file-btn"
						class:active={selected === file}
						onclick={() => (selected = selected === file ? null : file)}
						style="--type-color: {typeColors[file.type]}"
					>
						<span class="file-icon">{file.icon}</span>
						<code class="file-name">{file.name}</code>
					</button>
				{/each}
			</div>

			<div class="file-detail" class:visible={!!selected}>
				{#if selected}
					<div class="detail-card animate-fade-in">
						<div class="detail-header">
							<span class="detail-icon">{selected.icon}</span>
							<code class="detail-name">{selected.name}</code>
						</div>
						<div class="detail-body">
							<div class="detail-section">
								<span class="detail-label detail-what">💡 What it does</span>
								<p>{selected.desc}</p>
							</div>
							<div class="detail-section">
								<span class="detail-label detail-fails">⚠️ What fails without it</span>
								<p>{selected.failing}</p>
							</div>
						</div>
					</div>
				{:else}
					<div class="detail-placeholder">
						← Click a file on the left to see what it does and what breaks without it
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="separator"></div>

	<!-- File structure code -->
	<h3 class="sub-heading">🗂️ Standard Project Structure</h3>
	<CodeBlock code={structureCode} lang="bash" filename="project tree" />

	<!-- SvelteKit vs Svelte comparison -->
	<div class="compare-grid">
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

<style>
	.tree-layout {
		display: grid;
		grid-template-columns: 240px 1fr;
		gap: 1rem;
		align-items: start;
	}

	@media (max-width: 640px) {
		.tree-layout { grid-template-columns: 1fr; }
	}

	.file-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.file-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s;
		color: var(--color-text);
	}
	.file-btn:hover {
		border-color: var(--type-color);
		background: rgba(255,255,255,0.04);
	}
	.file-btn.active {
		border-color: var(--type-color);
		background: rgba(255,255,255,0.06);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--type-color) 25%, transparent);
	}

	.file-icon { font-size: 1rem; }
	.file-name { font-size: 0.775rem; color: var(--type-color); }

	.file-detail {
		min-height: 160px;
	}

	.detail-card {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		overflow: hidden;
	}

	.detail-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
	}
	.detail-icon { font-size: 1.1rem; }
	.detail-name { font-size: 0.85rem; color: var(--color-accent); }

	.detail-body { padding: 1rem; }

	.detail-section { margin-bottom: 0.75rem; }
	.detail-section:last-child { margin-bottom: 0; }
	.detail-section p {
		font-size: 0.85rem;
		color: var(--color-text-muted);
		margin: 0.25rem 0 0;
		line-height: 1.6;
	}

	.detail-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.detail-what { color: var(--color-accent); }
	.detail-fails { color: var(--color-danger); }

	.detail-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 160px;
		color: var(--color-text-muted);
		font-size: 0.85rem;
		text-align: center;
		border: 1px dashed var(--color-border);
		border-radius: 10px;
		padding: 1rem;
	}

	.sub-heading {
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0 0 1rem;
		color: var(--color-text);
	}

	.tree-section { margin-bottom: 1.5rem; }

	.separator {
		height: 1px;
		background: var(--color-border);
		margin: 1.5rem 0;
	}

	.compare-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 1.25rem;
	}
	@media (max-width: 500px) { .compare-grid { grid-template-columns: 1fr; } }

	.compare-card {
		border-radius: 10px;
		padding: 1rem 1.25rem;
		border: 1px solid var(--color-border);
	}
	.compare-svelte { border-color: rgba(248,81,73,0.4); background: rgba(248,81,73,0.05); }
	.compare-kit { border-color: rgba(63,185,80,0.4); background: rgba(63,185,80,0.05); }

	.compare-card h4 { margin: 0 0 0.75rem; font-size: 0.9rem; }
	.compare-card ul {
		margin: 0; padding-left: 1.25rem;
		font-size: 0.825rem;
		color: var(--color-text-muted);
		line-height: 1.8;
	}
</style>
