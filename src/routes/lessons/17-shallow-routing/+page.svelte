<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[16];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const shallowRoutingCode = `import { pushState, replaceState } from '$app/navigation';
import { page } from '$app/stores';

function openModal(id) {
    // updates the URL to /gallery?image=id without page navigation
    pushState('', { showModal: id });
}

// Subscribe to $page.state to react to shallow routing
$: modalId = $page.state.showModal;`;
</script>

<svelte:head>
	<title>Lesson 17 — Shallow Routing</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Lets you update the URL and the browser history without running a full navigation (load functions do not run again). Great for modals, tabs, or image galleries."
	whatFails="Without shallow routing, opening a modal might require a full page load, losing client-side state and causing a jarring layout shift."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Shuffle" size={20} class="text-(--color-accent)" />
		State History
	</h3>
	<div class="p-8 rounded-xl border border-white/10 bg-white/5 space-y-4 mb-12">
		<p class="text-sm text-white/70 leading-relaxed">
			You can push objects into the history state using <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">pushState</code>. To access it, SvelteKit exposes <code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) font-mono">$page.state</code>.
		</p>
		<p class="text-sm text-white/50 leading-relaxed italic">
			If you just want to update the current history state without adding a new history entry, use <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">replaceState</code>.
		</p>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Example</h3>
	<CodeBlock code={shallowRoutingCode} lang="javascript" filename="Shallow routing for a modal" />
</LessonLayout>

