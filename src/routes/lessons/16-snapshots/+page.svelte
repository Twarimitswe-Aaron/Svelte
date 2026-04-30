<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[15];
	const { prev, next } = getAdjacentLessons(lesson.slug);
	const snapshotCode = `<script lang="ts">
	let text = $state('');

	// SvelteKit automatically calls capture() when leaving the page,
	// and restore() when navigating back to it.
	export const snapshot = {
		capture: () => text,
		restore: (value) => text = value
	};
<${'/'}script>

<textarea bind:value={text}></textarea>`;
</script>

<svelte:head>
	<title>Lesson 16 — Snapshots</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Allows you to preserve transient UI state (like textarea contents or scroll positions within elements) when the user navigates away and then hits the Back button."
	whatFails="Without snapshots, if a user types a long comment and clicks a link before submitting, pressing Back will return to an empty textarea."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Camera" size={20} class="text-(--color-accent)" />
		State Restoration
	</h3>
	<div class="p-8 rounded-2xl border border-white/10 bg-white/5 space-y-4 mb-12">
		<p class="text-sm text-white/70 leading-relaxed">
			If you export a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">snapshot</code> object from a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">+page.svelte</code>, SvelteKit stores the captured state in <code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) font-mono">sessionStorage</code>.
		</p>
		<p class="text-sm text-white/50 leading-relaxed italic">
			This automatically restores transient UI state (like form inputs) when the user navigates back to the page.
		</p>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold text-white mb-6 uppercase tracking-widest text-white/30">Example</h3>
	<CodeBlock code={snapshotCode} lang="svelte" filename="+page.svelte" />
</LessonLayout>
