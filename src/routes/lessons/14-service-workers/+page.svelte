<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[13];
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
	<title>Lesson 14 — Service Workers</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Provides a way to cache files and handle requests offline by injecting a service-worker.js at the root of the app."
	whatFails="Without a service worker, your app cannot function when the user's device loses internet connection, and you can't implement PWA features like background sync or push notifications."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Satellite" size={20} class="text-(--color-accent)" />
		Service Worker Integration
	</h3>
	<div class="p-8 rounded-2xl border border-white/10 bg-white/5 space-y-4 mb-12">
		<p class="text-sm text-white/70 leading-relaxed">
			If you create a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">src/service-worker.js</code> (or <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">.ts</code>) file, SvelteKit will automatically build it and register it.
		</p>
		<p class="text-sm text-white/50 leading-relaxed">
			Inside the worker, SvelteKit provides the <code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) font-mono">$service-worker</code> module which gives you access to the paths of all built assets and static files. This is essential for building <strong>Progressive Web Apps (PWAs)</strong>.
		</p>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold text-white mb-6 uppercase tracking-widest text-white/30">Installation Example</h3>
	<CodeBlock code={workerCode} lang="typescript" filename="src/service-worker.ts" />
</LessonLayout>
