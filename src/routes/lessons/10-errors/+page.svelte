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
		<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
			<LessonIcon name="Bomb" size={20} class="text-(--color-accent)" />
			Trigger a Live Error
		</h3>
		<p class="text-sm text-white/60 leading-relaxed mb-8">
			Both buttons navigate to this same page with a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">?trigger=</code> query param. The server
			load reads it and throws the appropriate error. You'll see the <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">+error.svelte</code> page.
		</p>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
			<button
				class="group flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all text-left"
				onclick={() => goto(resolve('?trigger=expected' as any))}
			>
				<div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
					<LessonIcon name="CircleAlert" size={24} />
				</div>
				<div>
					<div class="text-sm font-bold text-white mb-1">Trigger 404 (Expected)</div>
					<div class="text-xs text-white/40 leading-relaxed">Uses error(404, ...) — shows +error.svelte</div>
				</div>
			</button>

			<button
				class="group flex items-start gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-red-500/30 transition-all text-left"
				onclick={() => goto(resolve('?trigger=unexpected' as any))}
			>
				<div class="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
					<LessonIcon name="Bomb" size={24} />
				</div>
				<div>
					<div class="text-sm font-bold text-white mb-1">Trigger 500 (Unexpected)</div>
					<div class="text-xs text-white/40 leading-relaxed">Throws new Error() — handleError() called</div>
				</div>
			</button>
		</div>

		<!-- Error Flow Visual -->
		<div class="p-8 rounded-2xl bg-black/40 border border-white/5 overflow-x-auto">
			<div class="flex items-center justify-between min-w-[600px] gap-4">
				<div class="flex flex-col items-center gap-3 w-32">
					<div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">💥</div>
					<span class="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center">Thrown in load()</span>
				</div>
				
				<LessonIcon name="ArrowRight" size={20} class="text-white/10" />

				<div class="flex flex-col items-center gap-3 w-32">
					<div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl"><LessonIcon name="Search" size={20} /></div>
					<span class="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center">SvelteKit inspects</span>
				</div>

				<LessonIcon name="ArrowRight" size={20} class="text-white/10" />

				<div class="relative flex flex-col gap-6">
					<div class="flex items-center gap-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 min-w-[200px]">
						<div class="text-xl">🔵</div>
						<div class="flex flex-col">
							<span class="text-xs font-bold text-blue-400">HttpError</span>
							<span class="text-[10px] text-blue-400/50">Render +error.svelte</span>
						</div>
					</div>
					<div class="absolute left-1/2 -translate-x-1/2 -top-3 px-2 bg-black text-[10px] font-bold text-white/20">OR</div>
					<div class="flex items-center gap-4 p-4 rounded-xl border border-red-500/20 bg-red-500/5 min-w-[200px]">
						<div class="text-xl">🔴</div>
						<div class="flex flex-col">
							<span class="text-xs font-bold text-red-400">Other Error</span>
							<span class="text-[10px] text-red-400/50">handleError() → +error.svelte</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<div class="h-px bg-white/10 my-12"></div>

	<!-- Error page anatomy -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
		<div class="p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 space-y-6">
			<div class="text-sm font-bold text-blue-400 flex items-center gap-2">
				<div class="w-2 h-2 rounded-full bg-blue-500"></div>
				Expected Error
			</div>
			<ul class="space-y-3">
				<li class="text-sm text-white/60 flex items-start gap-2 italic">
					<LessonIcon name="Check" size={14} class="text-blue-500 mt-1 shrink-0" />
					Created with <code class="text-blue-400">error(status, message)</code>
				</li>
				<li class="text-sm text-white/60 flex items-start gap-2 italic">
					<LessonIcon name="Check" size={14} class="text-blue-500 mt-1 shrink-0" />
					Has a specific HTTP status (404, 403, etc.)
				</li>
				<li class="text-sm text-white/60 flex items-start gap-2 italic">
					<LessonIcon name="Check" size={14} class="text-blue-500 mt-1 shrink-0" />
					User-triggered, anticipated
				</li>
				<li class="text-sm text-white/60 flex items-start gap-2 italic font-bold">
					<LessonIcon name="X" size={14} class="text-red-500 mt-1 shrink-0" />
					NOT sent to handleError()
				</li>
			</ul>
		</div>
		<div class="p-8 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-6">
			<div class="text-sm font-bold text-red-400 flex items-center gap-2">
				<div class="w-2 h-2 rounded-full bg-red-500"></div>
				Unexpected Error
			</div>
			<ul class="space-y-3">
				<li class="text-sm text-white/60 flex items-start gap-2 italic">
					<LessonIcon name="Check" size={14} class="text-red-500 mt-1 shrink-0" />
					Any thrown non-HttpError value
				</li>
				<li class="text-sm text-white/60 flex items-start gap-2 italic">
					<LessonIcon name="Check" size={14} class="text-red-500 mt-1 shrink-0" />
					Always results in status 500
				</li>
				<li class="text-sm text-white/60 flex items-start gap-2 italic">
					<LessonIcon name="Check" size={14} class="text-red-500 mt-1 shrink-0" />
					Programmer error, DB crash, etc.
				</li>
				<li class="text-sm flex items-start gap-2 italic font-bold text-green-400">
					<LessonIcon name="Check" size={14} class="text-green-500 mt-1 shrink-0" />
					IS sent to handleError() for logging
				</li>
			</ul>
		</div>
	</div>

	<div class="h-px bg-white/10 my-12"></div>
	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Implementation</h3>
	<CodeBlock code={expectedErrorCode} lang="typescript" filename="+page.server.ts — expected" />
	<CodeBlock code={unexpectedErrorCode} lang="typescript" filename="+page.server.ts — unexpected" />
	<CodeBlock code={errorPageCode} lang="svelte" filename="+error.svelte" />
</LessonLayout>

