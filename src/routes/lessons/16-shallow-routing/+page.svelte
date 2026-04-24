<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[15];
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
	<title>Lesson 16 — Shallow Routing</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Lets you update the URL and the browser history without running a full navigation (load functions do not run again). Great for modals, tabs, or image galleries."
	whatFails="Without shallow routing, opening a modal might require a full page load, losing client-side state and causing a jarring layout shift."
>
	<h3 class="sub-heading">State History</h3>
	<p style="color: var(--color-text-muted); font-size: 0.9rem;">
		You can push objects into the history state using <code>pushState</code>. To access it, SvelteKit exposes <code>$page.state</code>. 
		If you just want to update the current history state without adding a new history entry, use <code>replaceState</code>.
	</p>

	<div class="separator"></div>

	<h3 class="sub-heading">Example</h3>
	<CodeBlock code={shallowRoutingCode} lang="javascript" filename="Shallow routing for a modal" />
</LessonLayout>

<style>
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }
	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }
	code { background: var(--color-surface-2); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
</style>
