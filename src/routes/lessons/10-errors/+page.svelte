<!--
  Lesson 10 — Error Handling
  
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
	import { resolve } from '$app/paths';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[9];
	const { prev, next } = getAdjacentLessons(lesson.slug);

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
<${'/'}script>

<h1>Error {$page.status}</h1>
<p>{$page.error?.message}</p>

<!-- Route-scoped +error.svelte overrides this for specific directories -->`;
</script>

<svelte:head>
	<title>Lesson 10 — Errors · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit has two error types: expected (error() from @sveltejs/kit — known HTTP errors like 404) and unexpected (any other thrown value — bugs, crashes). Both render +error.svelte but only unexpected errors call handleError() in hooks.server.ts."
	whatFails="Without +error.svelte: SvelteKit shows a plain default error page with no branding. Without error(): throwing a raw Error gives a 500 even for 'not found' cases. Confusing expected/unexpected errors causes incorrect logging and misleading status codes."
>
	<!-- Live error demos -->
	<section class="mb-12">
		<h3 class="text-xl font-bold text-white mb-6 gap-2 flex items-center">
			<LessonIcon name="Bomb" size={20} class="text-(--color-accent)" />
			Trigger a Live Error
		</h3>
		<p class="text-sm text-white/60 leading-relaxed mb-8">
			Both buttons navigate to this same page with a <code
				class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">?trigger=</code
			>
			query param. The server load reads it and throws the appropriate error. You'll see the
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">+error.svelte</code> page.
		</p>

		<div class="sm:grid-cols-2 gap-4 mb-12 grid grid-cols-1">
			<button
				class="group gap-4 p-6 rounded-xl border-white/10 bg-white/5 glass-blur hover:bg-white/10 hover:border-blue-500/30 flex items-start border text-left transition-all"
				onclick={() => goto(resolve('?trigger=expected' as '/'))}
			>
				<div
					class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110"
				>
					<LessonIcon name="CircleAlert" size={24} />
				</div>
				<div>
					<div class="text-sm font-bold text-white mb-1">Trigger 404 (Expected)</div>
					<div class="text-xs text-white/40 leading-relaxed">
						Uses error(404, ...) — shows +error.svelte
					</div>
				</div>
			</button>

			<button
				class="group gap-4 p-6 rounded-xl border-white/10 bg-white/5 glass-blur hover:bg-white/10 hover:border-red-500/30 flex items-start border text-left transition-all"
				onclick={() => goto(resolve('?trigger=unexpected' as '/'))}
			>
				<div
					class="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center transition-transform group-hover:scale-110"
				>
					<LessonIcon name="Bomb" size={24} />
				</div>
				<div>
					<div class="text-sm font-bold text-white mb-1">Trigger 500 (Unexpected)</div>
					<div class="text-xs text-white/40 leading-relaxed">
						Throws new Error() — handleError() called
					</div>
				</div>
			</button>
		</div>

		<!-- Error Flow Visual -->
		<div class="p-8 rounded-xl bg-black/40 border-white/5 glass-blur overflow-x-auto border">
			<div class="gap-4 flex min-w-[600px] items-center justify-between">
				<div class="gap-3 w-32 flex flex-col items-center">
					<div class="w-12 h-12 bg-white/10 text-xl flex items-center justify-center rounded-full">
						💥
					</div>
					<span class="font-bold tracking-widest text-white/40 text-center text-[10px] uppercase"
						>Thrown in load()</span
					>
				</div>

				<LessonIcon name="ArrowRight" size={20} class="text-white/10" />

				<div class="gap-3 w-32 flex flex-col items-center">
					<div class="w-12 h-12 bg-white/10 text-xl flex items-center justify-center rounded-full">
						<LessonIcon name="Search" size={20} />
					</div>
					<span class="font-bold tracking-widest text-white/40 text-center text-[10px] uppercase"
						>SvelteKit inspects</span
					>
				</div>

				<LessonIcon name="ArrowRight" size={20} class="text-white/10" />

				<div class="gap-6 relative flex flex-col">
					<div
						class="gap-4 p-4 rounded-xl border-blue-500/20 bg-blue-500/5 glass-blur flex min-w-[200px] items-center border"
					>
						<div class="text-xl">🔵</div>
						<div class="flex flex-col">
							<span class="text-xs font-bold text-blue-400">HttpError</span>
							<span class="text-blue-400/50 text-[10px]">Render +error.svelte</span>
						</div>
					</div>
					<div
						class="-top-3 px-2 bg-black font-bold text-white/20 absolute left-1/2 -translate-x-1/2 text-[10px]"
					>
						OR
					</div>
					<div
						class="gap-4 p-4 rounded-xl border-red-500/20 bg-red-500/5 glass-blur flex min-w-[200px] items-center border"
					>
						<div class="text-xl">🔴</div>
						<div class="flex flex-col">
							<span class="text-xs font-bold text-red-400">Other Error</span>
							<span class="text-red-400/50 text-[10px]">handleError() → +error.svelte</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="bg-white/10 my-12 h-px"></div>

	<!-- Error page anatomy -->
	<div class="md:grid-cols-2 gap-6 mb-12 grid grid-cols-1">
		<div class="p-8 rounded-xl border-blue-500/20 bg-blue-500/5 space-y-6 glass-blur border">
			<div class="text-sm font-bold text-blue-400 gap-2 flex items-center">
				<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
				Expected Error
			</div>
			<ul class="space-y-3">
				<li class="text-sm text-white/60 gap-2 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-blue-500 mt-1 shrink-0" />
					Created with <code class="text-blue-400">error(status, message)</code>
				</li>
				<li class="text-sm text-white/60 gap-2 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-blue-500 mt-1 shrink-0" />
					Has a specific HTTP status (404, 403, etc.)
				</li>
				<li class="text-sm text-white/60 gap-2 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-blue-500 mt-1 shrink-0" />
					User-triggered, anticipated
				</li>
				<li class="text-sm text-white/60 gap-2 font-bold flex items-start italic">
					<LessonIcon name="X" size={14} class="text-red-500 mt-1 shrink-0" />
					NOT sent to handleError()
				</li>
			</ul>
		</div>
		<div class="p-8 rounded-xl border-red-500/20 bg-red-500/5 space-y-6 glass-blur border">
			<div class="text-sm font-bold text-red-400 gap-2 flex items-center">
				<div class="w-2 h-2 bg-red-500 rounded-full"></div>
				Unexpected Error
			</div>
			<ul class="space-y-3">
				<li class="text-sm text-white/60 gap-2 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-red-500 mt-1 shrink-0" />
					Any thrown non-HttpError value
				</li>
				<li class="text-sm text-white/60 gap-2 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-red-500 mt-1 shrink-0" />
					Always results in status 500
				</li>
				<li class="text-sm text-white/60 gap-2 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-red-500 mt-1 shrink-0" />
					Programmer error, DB crash, etc.
				</li>
				<li class="text-sm gap-2 font-bold text-green-400 flex items-start italic">
					<LessonIcon name="Check" size={14} class="text-green-500 mt-1 shrink-0" />
					IS sent to handleError() for logging
				</li>
			</ul>
		</div>
	</div>

	<div class="bg-white/10 my-12 h-px"></div>
	<h3 class="text-lg font-bold mb-6 tracking-widest text-white/30 uppercase">Implementation</h3>
	<CodeBlock code={expectedErrorCode} lang="typescript" filename="+page.server.ts — expected" />
	<CodeBlock code={unexpectedErrorCode} lang="typescript" filename="+page.server.ts — unexpected" />
	<CodeBlock code={errorPageCode} lang="svelte" filename="+error.svelte" />
</LessonLayout>
