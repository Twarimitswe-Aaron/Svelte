<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { resolve } from '$app/paths';

	const lesson = lessons[15];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	let text = $state('');

	// SvelteKit automatically calls capture() when leaving the page,
	// and restore() when navigating back to it.
	export const snapshot = {
		capture: () => text,
		restore: (value: string) => (text = value)
	};

	const snapshotCode = `<script lang="ts">
	let text = $state('');

	// SvelteKit automatically calls capture() when leaving the page,
	// and restore() when navigating back to it.
	export const snapshot = {
		capture: () => text,
		restore: (value) => text = value
	};
</${'script'}>

<textarea bind:value={text}></textarea>`;
</script>

<svelte:head>
	<title>Lesson 16 — Snapshots · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Allows you to preserve transient UI state (like textarea contents or scroll positions within elements) when the user navigates away and then hits the Back button."
	whatFails="Without snapshots, if a user types a long comment and clicks a link before submitting, pressing Back will return to an empty textarea."
>
	<h3 class="text-xl font-bold text-white mb-6 gap-2 flex items-center">
		<LessonIcon name="Camera" size={20} class="text-(--color-accent)" />
		State Restoration
	</h3>

	<div
		class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur space-y-6 mb-12 relative overflow-hidden border"
	>
		<div
			class="-top-24 -right-24 w-64 h-64 blur-3xl absolute rounded-full bg-(--color-accent)/5"
		></div>

		<p class="text-sm text-white/70 leading-relaxed relative z-10">
			If you export a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
				>snapshot</code
			>
			object from a
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">+page.svelte</code>,
			SvelteKit stores the captured state in
			<code class="px-1.5 py-0.5 rounded bg-white/10 font-mono text-(--color-accent)"
				>sessionStorage</code
			>.
		</p>

		<!-- Live Demo Area -->
		<div
			class="p-6 rounded-xl bg-black/40 border-white/5 space-y-4 glass-blur relative z-10 border"
		>
			<div class="flex items-center justify-between">
				<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
					>Interactive Demo</span
				>
				<div class="gap-2 flex items-center">
					<div class="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full"></div>
					<span class="text-green-400 font-bold text-[10px] uppercase">Snapshot Active</span>
				</div>
			</div>

			<div class="space-y-3">
				<label for="snapshot-input" class="text-xs text-white/40 italic"
					>Type something here, then click the link below:</label
				>
				<textarea
					id="snapshot-input"
					bind:value={text}
					placeholder="Type your message here..."
					class="p-4 rounded-xl bg-white/5 border-white/10 text-sm text-white font-mono glass-blur min-h-[100px] w-full border transition-all outline-none focus:border-(--color-accent)"
				></textarea>
			</div>

			<div
				class="pt-4 border-white/5 sm:flex-row gap-4 flex flex-col items-center justify-between border-t"
			>
				<p class="text-white/30 leading-tight text-[11px]">
					1. Type text above.<br />2. Click "Navigate Away".<br />3. Hit the <strong>Back</strong> button.
				</p>
				<a
					href={resolve('/lessons/01-intro')}
					class="px-6 py-2.5 rounded-xl bg-white/5 border-white/10 text-white font-bold text-xs hover:bg-white/10 glass-blur border no-underline transition-all"
				>
					Navigate Away →
				</a>
			</div>
		</div>
	</div>

	<div class="bg-white/10 my-12 h-px"></div>

	<h3 class="text-lg font-bold mb-6 tracking-widest text-white/30 uppercase">Implementation</h3>
	<CodeBlock code={snapshotCode} lang="svelte" filename="+page.svelte" />
</LessonLayout>
