<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[17];
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
	<title>Lesson 18 — Observability</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Allows you to track application health, errors, performance, and user metrics using hooks and specialized libraries."
	whatFails="Without observability, you are flying blind—bugs in production might remain hidden until users complain, and performance bottlenecks are difficult to isolate."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="Activity" size={20} class="text-(--color-accent)" />
		Logging & Tracing
	</h3>
	<div class="p-8 rounded-2xl border border-white/10 bg-white/5 space-y-4 mb-12">
		<p class="text-sm text-white/70 leading-relaxed">
			SvelteKit's <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">handleError</code> hook is the ideal place to report unhandled issues to external services like Sentry.
		</p>
		<p class="text-sm text-white/50 leading-relaxed italic">
			Similarly, the <code class="px-1.5 py-0.5 rounded bg-white/10 text-(--color-accent) font-mono">handle</code> hook can be used to track API latency or request volumes globally.
		</p>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold text-white mb-6 uppercase tracking-widest text-white/30">Example</h3>
	<CodeBlock code={observabilityCode} lang="typescript" filename="src/hooks.server.ts" />
</LessonLayout>

