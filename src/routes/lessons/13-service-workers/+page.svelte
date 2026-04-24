<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[12];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const workerCode = `// src/service-worker.ts
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = \`cache-\${version}\`;

const ASSETS = [
	...build, // the app itself
	...files  // everything in \`static\`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	// @ts-ignore
	event.waitUntil(addFilesToCache());
});`;
</script>

<svelte:head>
	<title>Lesson 13 — Service Workers</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Provides a way to cache files and handle requests offline by injecting a service-worker.js at the root of the app."
	whatFails="Without a service worker, your app cannot function when the user's device loses internet connection, and you can't implement PWA features like background sync or push notifications."
>
	<h3 class="sub-heading">Service Worker Integration</h3>
	<p style="color: var(--color-text-muted); font-size: 0.9rem;">
		If you create a <code>src/service-worker.js</code> (or <code>.ts</code>) file, SvelteKit will automatically build it and register it.
		Inside the worker, SvelteKit provides the <code>$service-worker</code> module which gives you access to the paths of all built assets and static files.
	</p>

	<div class="separator"></div>

	<h3 class="sub-heading">Installation Example</h3>
	<CodeBlock code={workerCode} lang="typescript" filename="src/service-worker.ts" />
</LessonLayout>
<style>
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }
	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }
	code { background: var(--color-surface-2); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
</style>
