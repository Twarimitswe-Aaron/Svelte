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
		restore: (value: string) => text = value
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
	{lesson} {prev} {next}
	whatItDoes="Allows you to preserve transient UI state (like textarea contents or scroll positions within elements) when the user navigates away and then hits the Back button."
	whatFails="Without snapshots, if a user types a long comment and clicks a link before submitting, pressing Back will return to an empty textarea."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Camera" size={20} class="text-(--color-accent)" />
		State Restoration
	</h3>
	
	<div class="p-8 rounded-xl border border-white/10 bg-white/5 space-y-6 mb-12 relative overflow-hidden">
		<div class="absolute -top-24 -right-24 w-64 h-64 bg-(--color-accent)/5 rounded-full blur-3xl"></div>
		
		<p class="text-sm text-white/70 leading-relaxed relative z-10">
			If you export a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">snapshot</code> object from a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">+page.svelte</code>, SvelteKit stores the captured state in <code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) font-mono">sessionStorage</code>.
		</p>
		
		<!-- Live Demo Area -->
		<div class="p-6 rounded-xl bg-black/40 border border-white/5 space-y-4 relative z-10">
			<div class="flex items-center justify-between">
				<span class="text-[10px] font-bold uppercase tracking-widest text-white/30">Interactive Demo</span>
				<div class="flex items-center gap-2">
					<div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
					<span class="text-[10px] text-green-400 font-bold uppercase">Snapshot Active</span>
				</div>
			</div>
			
			<div class="space-y-3">
				<label for="snapshot-input" class="text-xs text-white/40 italic">Type something here, then click the link below:</label>
				<textarea
					id="snapshot-input"
					bind:value={text}
					placeholder="Type your message here..."
					class="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono focus:border-(--color-accent) transition-all outline-none min-h-[100px]"
				></textarea>
			</div>

			<div class="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p class="text-[11px] text-white/30 leading-tight">1. Type text above.<br>2. Click "Navigate Away".<br>3. Hit the <strong>Back</strong> button.</p>
				<a href={resolve('/lessons/01-intro')} class="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all no-underline">
					Navigate Away →
				</a>
			</div>
		</div>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Implementation</h3>
	<CodeBlock code={snapshotCode} lang="svelte" filename="+page.svelte" />
</LessonLayout>
