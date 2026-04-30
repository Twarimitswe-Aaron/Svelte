<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[18];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const packageCode = `// package.json for your library
{
	"name": "my-svelte-components",
	"version": "1.0.0",
	"scripts": {
		"package": "svelte-package"
	},
	"exports": {
		".": {
			"types": "./dist/index.d.ts",
			"svelte": "./dist/index.js"
		}
	}
}`;
</script>

<svelte:head>
	<title>Lesson 19 — Packaging</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Provides official tooling to convert your SvelteKit $lib folder into an npm package that others can install."
	whatFails="Without @sveltejs/package, sharing Svelte components across repositories requires manual bundling configs which easily go out of sync or create invalid TypeScript definitions."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Package" size={20} class="text-(--color-accent)" />
		Svelte-Package Tool
	</h3>
	<div class="p-8 rounded-2xl border border-white/10 bg-white/5 space-y-4 mb-12">
		<p class="text-sm text-white/70 leading-relaxed">
			Running <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">npx svelte-package</code> takes the contents of your <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">src/lib</code> directory and generates a <code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) font-mono">dist</code> folder.
		</p>
		<p class="text-sm text-white/50 leading-relaxed italic">
			This folder contains all code and type definitions formatted correctly for publishing to <strong>npm</strong>.
		</p>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Example</h3>
	<CodeBlock code={packageCode} lang="json" filename="package.json library setup" />
</LessonLayout>

