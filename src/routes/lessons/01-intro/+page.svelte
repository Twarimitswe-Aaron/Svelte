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
	import { LayoutTemplate, Box, Folder, Zap } from 'lucide-svelte';

	const lesson = lessons[0];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// Summary of the key folders
	const folders = [
		{ name: 'src/routes/', desc: 'The heart of your app. Every folder here maps to a URL segment.' },
		{ name: 'src/lib/', desc: 'Shared code (components, utils, types) accessible via the $lib alias.' },
		{ name: 'static/', desc: 'Static assets like images, fonts, and robots.txt served at the root.' },
		{ name: 'tests/', desc: 'Playwright end-to-end tests for verifying app behavior.' }
	];

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
	<!-- Folder overview -->
	<div class="mb-10">
		<h3 class="mb-4 text-[0.95rem] font-bold text-(--color-text)">📂 Key Project Folders</h3>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each folders as folder (folder.name)}
				<div class="rounded-xl border  border-(--color-border) bg-black/40 p-4 transition-all hover:bg-white/5">
					<div class="mb-2 flex items-center gap-2">
						<Folder size={16} class="text-(--color-accent)" />
						<code class="text-[0.85rem] font-bold text-white">{folder.name}</code>
					</div>
					<p class="m-0 text-[0.85rem] leading-relaxed text-(--color-text-muted)">{folder.desc}</p>
				</div>
			{/each}
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
		<p class="m-0 mb-4 font-bold text-(--color-accent) flex items-center gap-2">
			<Zap size={16} /> In this codebase, we exclusively leverage Tailwind CSS.
		</p>
		<p class="m-0">
			Svelte has a powerful native styling approach (shown above) which automatically scopes styles to components. However, for large-scale apps, you can easily integrate Tailwind (as we have globally) for rapid, utility-first UI development.
		</p>
	</div>

	<!-- SvelteKit vs Svelte comparison -->
	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<div class="rounded-xl border border-(--color-danger)/20 bg-(--color-danger)/5 p-6 transition-all hover:bg-(--color-danger)/10">
			<h4 class="m-0 mb-3 text-[1.1rem] font-bold text-(--color-danger)">🔴 Plain Svelte</h4>
			<p class="mb-4 text-[0.875rem] leading-relaxed text-(--color-text-muted)">
				Svelte is a component framework. It's a way of writing UI components that get compiled into highly efficient JavaScript.
			</p>
			<ul class="m-0 flex flex-col gap-2 p-0 text-[0.875rem] text-(--color-text-muted) [&>li]:flex [&>li]:items-center [&>li]:gap-2">
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-danger)"></span>UI components only</li>
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-danger)"></span>No router included</li>
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-danger)"></span>No SSR / data loading</li>
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-danger)"></span>You build the app shell yourself</li>
			</ul>
		</div>

		<div class="rounded-xl border border-(--color-success)/20 bg-(--color-success)/5 p-6 transition-all hover:bg-(--color-success)/10">
			<h4 class="m-0 mb-3 text-[1.1rem] font-bold text-(--color-success)">🟢 SvelteKit</h4>
			<p class="mb-4 text-[0.875rem] leading-relaxed text-(--color-text-muted)">
				SvelteKit is the <strong>full-stack framework</strong> for Svelte (think Next.js for React or Nuxt for Vue).
			</p>
			<ul class="m-0 flex flex-col gap-2 p-0 text-[0.875rem] text-(--color-text-muted) [&>li]:flex [&>li]:items-center [&>li]:gap-2">
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)"></span>File-based routing & layouts</li>
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)"></span>SSR + streaming + prerendering</li>
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)"></span>Built-in HMR via Vite</li>
				<li><span class="h-1.5 w-1.5 rounded-full bg-(--color-success)"></span>Image & Build optimizations</li>
			</ul>
		</div>
	</div>

	<!-- Extra context from official docs -->
	<div class="mt-8 rounded-xl border border-(--color-border) bg-(--color-surface) p-6">
		<h4 class="m-0 mb-4 flex items-center gap-2 text-[1rem] font-bold text-(--color-text)">
			<Zap size={18} class="text-(--color-accent)" /> 
			The "Boring Stuff" (Done for you)
		</h4>
		<p class="mb-0 text-[0.9rem] leading-relaxed text-(--color-text-muted)">
			Building a modern app is fiendishly complicated. SvelteKit handles the "boring stuff" — routing, bundling, SSR, and preloading — so you can stay in the creative flow. Levering <strong>Vite</strong> and <strong>Hot Module Replacement (HMR)</strong>, it reflects your code changes in the browser instantly for a lightning-fast development experience.
		</p>
	</div>
</LessonLayout>
