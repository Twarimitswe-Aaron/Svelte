<!--
  Lesson 09 — Hooks
  
  CONCEPTS SHOWN:
  1. hooks.server.ts → handle() runs for every request
  2. event.locals — per-request state set in handle() 
  3. handleError() — catches unexpected errors
  4. handleFetch() — intercepts server-side fetch requests
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { TriangleAlert } from 'lucide-svelte';

	const lesson = lessons[8];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// data comes from +page.server.ts which reads event.locals set by hooks
	let { data } = $props();

	const handleCode = `// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // 1. Set event.locals — available in ALL load() functions
  event.locals.user = await getUserFromSession(event.cookies);

  // 2. Run the actual route handler
  const response = await  event ;

  // 3. Modify the response — add headers globally
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
  // NOTE: Forgetting await event returns undefined — app breaks entirely
};`;

	const handleErrorCode = `// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, status }) => {
  // Log to your error tracking service (Sentry, Datadog...)
  console.error('Unhandled error:', error);

  // This becomes $page.error — keep it vague so you don't leak internals
  return { message: status === 404 ? 'Not found' : 'Something went wrong' };
  // NOTE: Without this, SvelteKit shows a raw error message that may leak code paths
};`;

	const localsCode = `// src/app.d.ts — TypeScript type for locals
declare global {
  namespace App {
    interface Locals {
      user: { id: string; name: string; role: string } | null;
    }
  }
}

// In any +page.server.ts or +layout.server.ts:
export const load = ({ locals }) => {
  if (!locals.user) throw redirect(302, '/login');
  return { user: locals.user };
  // NOTE: Without the hook setting locals.user, this always throws a redirect
};`;
</script>

<svelte:head>
	<title>Lesson 09 — Hooks · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Hooks in hooks.server.ts run server-side middleware for every request. handle() is called before every route — use it to check auth, inject locals, add response headers. handleError() intercepts unhandled exceptions. handleFetch() modifies outgoing server-side fetch requests."
	whatFails="Without handle(): event.locals is empty, all auth checks fail, no global headers. Without handleError(): stack traces may leak to users. Without the await  event  call inside handle(): ALL routes return undefined — complete app failure."
>
	<!-- Live proof: hooks are active -->
	<section class="mb-12">
		<h3 class="text-xl font-bold text-white mb-6 gap-2 flex items-center">
			<LessonIcon name="Activity" size={20} class="text-(--color-accent)" />
			Live proof: hooks are active
		</h3>
		<p class="text-sm text-white/60 leading-relaxed mb-8">
			The following user data was injected by <code
				class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
				>hooks.server.ts handle()</code
			>
			into
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">event.locals</code>, then
			read by
			<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">+page.server.ts</code>.
			Without the hook, all fields would be
			<code class="text-red-400 font-mono italic">undefined</code>.
		</p>

		<div
			class="p-8 rounded-xl border {data.hookActive
				? 'border-green-500/20 bg-green-500/5 shadow-lg shadow-green-500/5'
				: 'border-red-500/20 bg-red-500/5 shadow-lg shadow-red-500/5'} group relative overflow-hidden transition-all"
		>
			<div
				class="-top-12 -right-12 w-48 h-48 absolute {data.hookActive
					? 'bg-green-500/10'
					: 'bg-red-500/10'} blur-3xl rounded-full"
			></div>

			<div class="gap-2 mb-8 relative z-10 flex items-center">
				<div
					class="w-2.5 h-2.5 rounded-full {data.hookActive
						? 'bg-green-500 animate-pulse'
						: 'bg-red-500'}"
				></div>
				<span
					class="text-xs font-bold tracking-widest uppercase {data.hookActive
						? 'text-green-400'
						: 'text-red-400'}"
				>
					{data.hookActive ? 'hooks.server.ts is active' : 'hook inactive'}
				</span>
			</div>

			{#if data.user}
				<div class="md:grid-cols-2 gap-4 relative z-10 grid grid-cols-1">
					<div class="p-4 rounded-xl bg-white/5 border-white/5 space-y-1 glass-blur border">
						<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
							>event.locals.user.id</span
						>
						<code class="text-sm text-white block truncate">{data.user.id}</code>
					</div>
					<div class="p-4 rounded-xl bg-white/5 border-white/5 space-y-1 glass-blur border">
						<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
							>event.locals.user.name</span
						>
						<code class="text-sm text-white block truncate">{data.user.name}</code>
					</div>
					<div class="p-4 rounded-xl bg-white/5 border-white/5 space-y-1 glass-blur border">
						<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
							>event.locals.user.role</span
						>
						<div class="gap-2 flex items-center">
							<code class="text-sm text-white">{data.user.role}</code>
							<span
								class="px-1.5 py-0.5 rounded font-bold tracking-widest bg-(--color-accent)/20 text-[10px] text-(--color-accent) uppercase"
								>Active</span
							>
						</div>
					</div>
					<div class="p-4 rounded-xl bg-white/5 border-white/5 space-y-1 glass-blur border">
						<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
							>Response header</span
						>
						<code class="block text-[11px] text-(--color-accent)">X-SvelteKit-Lesson: 09-hooks</code
						>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<div class="bg-white/10 my-12 h-px"></div>

	<!-- Hooks overview cards -->
	<div class="sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 grid grid-cols-1">
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="space-y-1">
				<div class="text-sm font-bold text-white font-mono">handle()</div>
				<div class="font-bold tracking-widest text-white/30 text-[10px] uppercase">
					hooks.server.ts
				</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Runs on EVERY request. Must call <code class="text-white/70">event</code>. Set locals,
				modify response.
			</p>
			<div class="font-medium text-red-400 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Missing await = blank app
			</div>
		</div>
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="space-y-1">
				<div class="text-sm font-bold text-white font-mono">handleError()</div>
				<div class="font-bold tracking-widest text-white/30 text-[10px] uppercase">
					hooks.server.ts
				</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Catches unexpected thrown errors. Log them to Sentry/Datadog here.
			</p>
			<div class="font-medium text-red-400 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Missing = stack traces leak
			</div>
		</div>
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="space-y-1">
				<div class="text-sm font-bold text-white font-mono">handleFetch()</div>
				<div class="font-bold tracking-widest text-white/30 text-[10px] uppercase">
					hooks.server.ts
				</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Intercepts fetch() inside server load functions. Add API keys.
			</p>
			<div class="font-medium text-red-400 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Missing = no shared auth headers
			</div>
		</div>
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="space-y-1">
				<div class="text-sm font-bold text-white font-mono">reroute()</div>
				<div class="font-bold tracking-widest text-white/30 text-[10px] uppercase">
					hooks.ts (universal)
				</div>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Modify which routes are matched before routing. A/B testing.
			</p>
			<div class="font-medium text-red-400 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Missing = no routing logic
			</div>
		</div>
	</div>

	<div class="bg-white/10 my-12 h-px"></div>
	<h3 class="text-lg font-bold mb-6 tracking-widest text-white/30 uppercase">Implementation</h3>
	<CodeBlock code={handleCode} lang="typescript" filename="hooks.server.ts — handle()" />
	<CodeBlock code={handleErrorCode} lang="typescript" filename="hooks.server.ts — handleError()" />
	<CodeBlock code={localsCode} lang="typescript" filename="Using locals in load()" />
</LessonLayout>
