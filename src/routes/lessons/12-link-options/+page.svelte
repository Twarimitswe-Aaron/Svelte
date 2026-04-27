<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { resolve } from '$app/paths';

	const lesson = lessons[11];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const linkOptionsCode = `<a href="/about" data-sveltekit-preload-data="hover">Hover to preload</a>
<a href="/dashboard" data-sveltekit-noscroll>Do not scroll to top</a>
<a href="/login" data-sveltekit-reload>Force full page reload</a>
<a href="/settings" data-sveltekit-replacestate>Replace history state</a>`;
</script>

<svelte:head>
	<title>Lesson 12 — Link Options</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Allows you to configure navigation behavior for specific links using HTML data-attributes."
	whatFails="Without these attributes, you have to write manual click handlers to prevent scrolling or to preload data."
>
	<h3 class="sub-heading">Link Attributes</h3>
	<ul>
		<li><code>data-sveltekit-preload-data</code>: Preloads the data for the linked page when the user hovers or taps on the link.</li>
		<li><code>data-sveltekit-preload-code</code>: Preloads only the JS code, not the data.</li>
		<li><code>data-sveltekit-reload</code>: Tells SvelteKit not to handle the link, causing a full browser native page reload.</li>
		<li><code>data-sveltekit-noscroll</code>: Prevents the default behavior of scrolling to the top of the page after navigation.</li>
		<li><code>data-sveltekit-replacestate</code>: Replaces the current history entry rather than creating a new one.</li>
	</ul>

	<div class="separator"></div>

	<h3 class="sub-heading">Examples</h3>
	<CodeBlock code={linkOptionsCode} lang="html" filename="+page.svelte" />

	<div class="example-area" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem">
		<a href={resolve('/lessons/11-remote-functions')} data-sveltekit-preload-data="hover" class="badge">Hover me to observe network preload</a>
		<a href={resolve('/lessons/12-link-options')} data-sveltekit-noscroll class="badge">Click me (no scroll)</a>
	</div>
</LessonLayout>
