<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[14];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const snapshotCode = `<script lang="ts">
	let text = $state('');

	// SvelteKit automatically calls capture() when leaving the page,
	// and restore() when navigating back to it.
	export const snapshot = {
		capture: () => text,
		restore: (value) => text = value
	};
<\/script>

<textarea bind:value={text}><\/textarea>`;
</script>

<svelte:head>
	<title>Lesson 15 — Snapshots</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Allows you to preserve transient UI state (like textarea contents or scroll positions within elements) when the user navigates away and then hits the Back button."
	whatFails="Without snapshots, if a user types a long comment and clicks a link before submitting, pressing Back will return to an empty textarea."
>
	<h3 class="sub-heading">State Restoration</h3>
	<p style="color: var(--color-text-muted); font-size: 0.9rem;">
		If you export a <code>snapshot</code> object from a <code>+page.svelte</code>, SvelteKit stores the captured state in <code>sessionStorage</code> and automatically applies it upon backward/forward navigation.
	</p>

	<div class="separator"></div>

	<h3 class="sub-heading">Example</h3>
	<CodeBlock code={snapshotCode} lang="svelte" filename="+page.svelte" />
</LessonLayout>
