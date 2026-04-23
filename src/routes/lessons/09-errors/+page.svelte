<!--
  Lesson 09 — Error Handling
  
  CONCEPTS:
  1. error() — expected errors (HttpError) — triggers +error.svelte
  2. Unexpected errors — any non-HttpError thrown — handleError() is called
  3. +error.svelte — custom error UI for a route or the whole app
  4. $page.error — reactive error object in error pages
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { goto } from '$app/navigation';

	const lesson = lessons[8];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	let { data } = $props();

	const expectedErrorCode = `// +page.server.ts
import { error } from '@sveltejs/kit';

export const load = ({ params }) => {
  const post = db.findPost(params.slug);

  if (!post) {
    // error() throws an HttpError — expected, user-triggered
    // SvelteKit renders +error.svelte with status=404
    // handleError() is NOT called — this is intentional
    throw error(404, { message: 'Post not found' });
  }

  return { post };
};`;

	const unexpectedErrorCode = `// An unexpected error — NOT wrapped with error()
export const load = async () => {
  // If this crashes, it's an unexpected error
  const data = await db.fetchEverything(); // might throw

  // SvelteKit catches it → calls handleError() → shows +error.svelte
  // status=500, message="Internal Error" (unless handleError customises it)
};`;

	const errorPageCode = `<!-- src/routes/+error.svelte — root error page -->
<script lang="ts">
  import { page } from '$app/stores';
  // $page.status = HTTP status (404, 500, etc.)
  // $page.error.message = message from error() or handleError() return
<\/script>

<h1>Error {$page.status}</h1>
<p>{$page.error?.message}</p>

<!-- Route-scoped +error.svelte overrides this for specific directories -->`;
</script>

<svelte:head>
	<title>Lesson 09 — Errors · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit has two error types: expected (error() from @sveltejs/kit — known HTTP errors like 404) and unexpected (any other thrown value — bugs, crashes). Both render +error.svelte but only unexpected errors call handleError() in hooks.server.ts."
	whatFails="Without +error.svelte: SvelteKit shows a plain default error page with no branding. Without error(): throwing a raw Error gives a 500 even for 'not found' cases. Confusing expected/unexpected errors causes incorrect logging and misleading status codes."
>
	<!-- Live error demos -->
	<div class="error-demos">
		<h3 class="sub-heading">🧨 Trigger a Live Error</h3>
		<p class="demo-text">
			Both buttons navigate to this same page with a <code>?trigger=</code> query param. The server
			load reads it and throws the appropriate error. You'll see the <code>+error.svelte</code> page.
		</p>

		<div class="demo-buttons">
			<button
				class="btn btn-secondary demo-btn"
				onclick={() => goto('?trigger=expected')}
			>
				<span class="btn-icon">🔵</span>
				<div>
					<div class="btn-title">Trigger 404 (Expected)</div>
					<div class="btn-sub">Uses error(404, ...) — shows +error.svelte</div>
				</div>
			</button>

			<button
				class="btn btn-danger demo-btn"
				onclick={() => goto('?trigger=unexpected')}
			>
				<span class="btn-icon">🔴</span>
				<div>
					<div class="btn-title">Trigger 500 (Unexpected)</div>
					<div class="btn-sub">Throws new Error() — handleError() called</div>
				</div>
			</button>
		</div>

		<div class="error-flow">
			<div class="flow-step">
				<div class="flow-icon">💥</div>
				<div class="flow-text">Error thrown in load()</div>
			</div>
			<div class="flow-arrow">→</div>
			<div class="flow-step">
				<div class="flow-icon">🔍</div>
				<div class="flow-text">SvelteKit inspects error type</div>
			</div>
			<div class="flow-arrow">→</div>
			<div class="flow-step expected-step">
				<div class="flow-icon">🔵</div>
				<div class="flow-text">HttpError → render +error.svelte</div>
			</div>
			<div class="flow-mid">OR</div>
			<div class="flow-step unexpected-step">
				<div class="flow-icon">🔴</div>
				<div class="flow-text">Other → handleError() → +error.svelte</div>
			</div>
		</div>
	</div>

	<div class="separator"></div>

	<!-- Error page anatomy -->
	<div class="comparison-grid">
		<div class="comp-card expected-card">
			<div class="comp-header">🔵 Expected Error</div>
			<ul>
				<li>Created with <code>error(status, message)</code></li>
				<li>Has a specific HTTP status (404, 403, etc.)</li>
				<li>User-triggered, anticipated</li>
				<li><strong>NOT</strong> sent to handleError()</li>
				<li>Example: "Post not found", "Unauthorised"</li>
			</ul>
		</div>
		<div class="comp-card unexpected-card">
			<div class="comp-header">🔴 Unexpected Error</div>
			<ul>
				<li>Any thrown non-HttpError value</li>
				<li>Always results in status 500</li>
				<li>Programmer error, DB crash, etc.</li>
				<li><strong>IS</strong> sent to handleError() for logging</li>
				<li>Example: null pointer, network timeout</li>
			</ul>
		</div>
	</div>

	<div class="separator"></div>
	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={expectedErrorCode} lang="typescript" filename="+page.server.ts — expected" />
	<CodeBlock code={unexpectedErrorCode} lang="typescript" filename="+page.server.ts — unexpected" />
	<CodeBlock code={errorPageCode} lang="svelte" filename="+error.svelte" />
</LessonLayout>

<style>
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }
	.demo-text { font-size: 0.875rem; color: var(--color-text-muted); margin: 0 0 1rem; line-height: 1.65; }
	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }

	.error-demos { margin-bottom: 1.5rem; }

	.demo-buttons {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.demo-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		text-align: left;
		flex: 1;
		min-width: 220px;
		cursor: pointer;
	}

	.btn-icon { font-size: 1.5rem; }

	.btn-title { font-size: 0.875rem; font-weight: 700; margin-bottom: 0.2rem; }
	.btn-sub { font-size: 0.75rem; opacity: 0.85; }

	.error-flow {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 1rem;
		font-size: 0.8rem;
	}

	.flow-step {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 0.4rem 0.7rem;
	}

	.expected-step { border-color: rgba(88,166,255,0.4); }
	.unexpected-step { border-color: rgba(248,81,73,0.4); }

	.flow-icon { font-size: 1rem; }
	.flow-text { color: var(--color-text-muted); }
	.flow-arrow { color: var(--color-text-muted); font-size: 1.2rem; }
	.flow-mid { padding: 0 0.5rem; font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); }

	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	@media (max-width: 560px) { .comparison-grid { grid-template-columns: 1fr; } }

	.comp-card {
		border-radius: 10px;
		padding: 1rem 1.25rem;
		border: 1px solid var(--color-border);
	}
	.expected-card {
		background: rgba(88,166,255,0.05);
		border-color: rgba(88,166,255,0.3);
	}
	.unexpected-card {
		background: rgba(248,81,73,0.05);
		border-color: rgba(248,81,73,0.3);
	}

	.comp-header {
		font-size: 0.85rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.comp-card ul {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.8;
	}
</style>
