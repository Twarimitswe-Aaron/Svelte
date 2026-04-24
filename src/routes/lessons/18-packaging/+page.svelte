<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[17];
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
	<title>Lesson 18 — Packaging</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Provides official tooling to convert your SvelteKit $lib folder into an npm package that others can install."
	whatFails="Without @sveltejs/package, sharing Svelte components across repositories requires manual bundling configs which easily go out of sync or create invalid TypeScript definitions."
>
	<h3 class="sub-heading">Svelte-Package Tool</h3>
	<p style="color: var(--color-text-muted); font-size: 0.9rem;">
		Running <code>npx svelte-package</code> takes the contents of your <code>src/lib</code> directory and generates a <code>dist</code> folder containing all the code and type definitions formatted for npm publishing.
	</p>

	<div class="separator"></div>

	<h3 class="sub-heading">Example</h3>
	<CodeBlock code={packageCode} lang="json" filename="package.json library setup" />
</LessonLayout>

<style>
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }
	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }
	code { background: var(--color-surface-2); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
</style>
