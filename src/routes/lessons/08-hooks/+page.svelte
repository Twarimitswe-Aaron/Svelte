<!--
  Lesson 08 — Hooks
  
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

	const lesson = lessons[7];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// data comes from +page.server.ts which reads event.locals set by hooks
	let { data } = $props();

	const handleCode = `// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // 1. Set event.locals — available in ALL load() functions
  event.locals.user = await getUserFromSession(event.cookies);

  // 2. Run the actual route handler
  const response = await resolve(event);

  // 3. Modify the response — add headers globally
  response.headers.set('X-Frame-Options', 'DENY');

  return response;
  // ⚠️ Forgetting await resolve(event) returns undefined — app breaks entirely
};`;

	const handleErrorCode = `// src/hooks.server.ts
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = ({ error, status }) => {
  // Log to your error tracking service (Sentry, Datadog...)
  console.error('Unhandled error:', error);

  // This becomes $page.error — keep it vague so you don't leak internals
  return { message: status === 404 ? 'Not found' : 'Something went wrong' };
  // ⚠️ Without this, SvelteKit shows a raw error message that may leak code paths
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
  // ⚠️ Without the hook setting locals.user, this always throws a redirect
};`;
</script>

<svelte:head>
	<title>Lesson 08 — Hooks · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Hooks in hooks.server.ts run server-side middleware for every request. handle() is called before every route — use it to check auth, inject locals, add response headers. handleError() intercepts unhandled exceptions. handleFetch() modifies outgoing server-side fetch requests."
	whatFails="Without handle(): event.locals is empty, all auth checks fail, no global headers. Without handleError(): stack traces may leak to users. Without the await resolve(event) call inside handle(): ALL routes return undefined — complete app failure."
>
	<!-- Live proof: hooks are active -->
	<div class="proof-section">
		<h3 class="sub-heading">🔍 Live proof: hooks added data to this page</h3>
		<p class="demo-text">
			The following user data was injected by <code>hooks.server.ts handle()</code> into
			<code>event.locals</code>, then read by <code>+page.server.ts</code>. Without the hook, all
			fields would be <code>undefined</code>.
		</p>

		<div class="proof-card" class:active={data.hookActive}>
			<div class="proof-status">
				<span class="status-dot" class:green={data.hookActive}></span>
				<span>{data.hookActive ? '✅ hooks.server.ts is active' : '❌ hook inactive'}</span>
			</div>

			{#if data.user}
				<div class="locals-grid">
					<div class="local-row">
						<span class="local-key">event.locals.user.id</span>
						<code class="local-val">{data.user.id}</code>
					</div>
					<div class="local-row">
						<span class="local-key">event.locals.user.name</span>
						<code class="local-val">{data.user.name}</code>
					</div>
					<div class="local-row">
						<span class="local-key">event.locals.user.role</span>
						<code class="local-val badge badge-blue">{data.user.role}</code>
					</div>
					<div class="local-row">
						<span class="local-key">Response header X-SvelteKit-Lesson</span>
						<code class="local-val">08-hooks (check DevTools → Network)</code>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="separator"></div>

	<!-- Hooks overview cards -->
	<div class="hooks-grid">
		<div class="hook-card">
			<div class="hook-name">handle()</div>
			<div class="hook-file">hooks.server.ts</div>
			<p>Runs on EVERY request. Must call <code>resolve(event)</code>. Set locals, modify response.</p>
			<div class="hook-fails">⚠️ Missing resolve() = blank app</div>
		</div>
		<div class="hook-card">
			<div class="hook-name">handleError()</div>
			<div class="hook-file">hooks.server.ts</div>
			<p>Catches unexpected thrown errors. Log them to Sentry/Datadog here.</p>
			<div class="hook-fails">⚠️ Missing = stack traces leak to users</div>
		</div>
		<div class="hook-card">
			<div class="hook-name">handleFetch()</div>
			<div class="hook-file">hooks.server.ts</div>
			<p>Intercepts fetch() inside server load functions. Add API keys, rewrite URLs.</p>
			<div class="hook-fails">⚠️ Missing = no way to add auth to outbound calls</div>
		</div>
		<div class="hook-card">
			<div class="hook-name">reroute()</div>
			<div class="hook-file">hooks.ts (universal)</div>
			<p>Modify which routes are matched before routing. A/B testing, feature flags.</p>
			<div class="hook-fails">⚠️ Missing = no way to redirect at the routing level</div>
		</div>
	</div>

	<div class="separator"></div>
	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={handleCode} lang="typescript" filename="hooks.server.ts — handle()" />
	<CodeBlock code={handleErrorCode} lang="typescript" filename="hooks.server.ts — handleError()" />
	<CodeBlock code={localsCode} lang="typescript" filename="Using locals in load()" />
</LessonLayout>

