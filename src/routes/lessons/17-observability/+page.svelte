<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[16];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const observabilityCode = `// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	// Log the error to your monitoring service (e.g. Sentry, Datadog)
	console.error('Unhandled error:', error);
	
	// Send a generic error ID back to the user
	const errorId = crypto.randomUUID();
	return {
		message: 'Something went wrong',
		errorId
	};
};`;
</script>

<svelte:head>
	<title>Lesson 17 — Observability</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Allows you to track application health, errors, performance, and user metrics using hooks and specialized libraries."
	whatFails="Without observability, you are flying blind—bugs in production might remain hidden until users complain, and performance bottlenecks are difficult to isolate."
>
	<h3 class="sub-heading">Logging & Tracing</h3>
	<p style="color: var(--color-text-muted); font-size: 0.9rem;">
		SvelteKit's <code>handleError</code> hook is the ideal place to report unhandled issues to external services like Sentry. 
		Similarly, the <code>handle</code> hook can be used to track API latency or request volumes.
	</p>

	<div class="separator"></div>

	<h3 class="sub-heading">Example</h3>
	<CodeBlock code={observabilityCode} lang="typescript" filename="src/hooks.server.ts" />
</LessonLayout>

