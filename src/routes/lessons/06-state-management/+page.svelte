<!--
  Lesson 06 — State Management
  
  CONCEPTS SHOWN:
  1. Avoid shared module-level state on the server (shared across ALL requests!)
  2. Use context API ($setContext/$getContext) for per-request/per-component state
  3. URL as state store (search params)
  4. $page store for reactive URL data
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { setContext } from 'svelte';

	const lesson = lessons[5];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// ─── DEMO 1: Context counter ────────────────────────────────────────────────
	// This state lives PER COMPONENT TREE, not globally per server request.
	// setContext makes it available to all child components.
	// WHY NOT module-level: module variables on the server are SHARED between
	//   ALL simultaneous users — a catastrophic data leak!
	let contextCount = $state(0);
	setContext('count', {
		get: () => contextCount,
		increment: () => contextCount++,
		decrement: () => contextCount--
	});

	// ─── DEMO 2: URL as state ───────────────────────────────────────────────────
	// Read from the URL so the state is shareable/bookmarkable
	const urlCount = $derived(parseInt($page.url.searchParams.get('n') ?? '0'));

	async function setUrlCount(n: number) {
		const url = new URL($page.url);
		url.searchParams.set('n', String(n));
		// goto() changes the URL without a full page reload
		await goto(resolve(url.toString() as unknown as '/'), { keepFocus: true, replaceState: true });
	}

	// ─── DEMO 3: Component-local state ─────────────────────────────────────────
	let localCount = $state(0);

	const badCode = `// ❌ WRONG — DO NOT DO THIS
// This is module-level state — shared across ALL server requests
// User A's click can change what User B sees!
let globalCount = 0; // on the server, this is shared by everyone

export function increment() { globalCount++; }`;

	const goodCode = `// ✅ CORRECT — Per-component state with context
// setContext lives inside a component's lifecycle — per user, per page
import { setContext, getContext } from 'svelte';

// In a layout or parent:
setContext('count', $state({ value: 0 }));

// In any child component:
const count = getContext('count');
count.value++;`;

	const urlStateCode = `// URL as state — bookmarkable & shareable
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

// Read state from URL
const count = $derived(
  parseInt($page.url.searchParams.get('n') ?? '0')
);

// Write state to URL (no page reload with goto)
async function setCount(n: number) {
  const url = new URL($page.url);
  url.searchParams.set('n', String(n));
  await goto(resolve(url.toString() as any), { replaceState: true });
  // ⚠️ Without replaceState: every increment adds to browser history
}`;
</script>

<svelte:head>
	<title>Lesson 06 — State Management · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit runs on the server and client. Module-level state (let x = 0) is SHARED across all users on the server — dangerous! Context API ($setContext) scopes state to a component tree. The URL ($page.url) makes state bookmarkable."
	whatFails="Using module-level state on the server leaks one user's data to another. Without context API, deeply nested components can't share state without prop-drilling. Without URL state, refreshing the page loses the current view."
>
	<div class="state-demos">
		<!-- DEMO 1: Context Counter -->
		<div class="demo-block">
			<div class="demo-label">
				<span class="badge badge-purple">Context API</span>
				<span class="demo-name">setContext / getContext</span>
			</div>
			<p class="demo-desc">
				This counter uses <code>setContext</code> — scoped to this component tree, safe on the
				server. Each user gets their own instance.
			</p>
			<div class="counter-ui">
				<button class="count-btn" onclick={() => contextCount--}>−</button>
				<span class="count-val">{contextCount}</span>
				<button class="count-btn" onclick={() => contextCount++}>+</button>
			</div>
			<p class="demo-warn">
				⚠️ If this were <code>let count = 0</code> at module level in a server file, all users
				would share this counter!
			</p>
		</div>

		<!-- DEMO 2: URL state -->
		<div class="demo-block">
			<div class="demo-label">
				<span class="badge badge-blue">URL State</span>
				<span class="demo-name">?n= search param</span>
			</div>
			<p class="demo-desc">
				This counter is stored in the URL as <code>?n=</code>. Refresh the page — the count
				persists! Share the URL and others see the same value.
			</p>
			<div class="counter-ui">
				<button class="count-btn" onclick={() => setUrlCount(urlCount - 1)}>−</button>
				<span class="count-val">{urlCount}</span>
				<button class="count-btn" onclick={() => setUrlCount(urlCount + 1)}>+</button>
			</div>
			<div class="url-pill">
				<span class="url-label-sm">Current URL:</span>
				<code>{$page.url.pathname}{$page.url.search || ''}</code>
			</div>
		</div>

		<!-- DEMO 3: Local state -->
		<div class="demo-block">
			<div class="demo-label">
				<span class="badge badge-green">Local $state</span>
				<span class="demo-name">Component-scoped rune</span>
			</div>
			<p class="demo-desc">
				Plain <code>$state()</code> — fine for UI-only state that doesn't need to survive
				navigation or be shared between components.
			</p>
			<div class="counter-ui">
				<button class="count-btn" onclick={() => localCount--}>−</button>
				<span class="count-val">{localCount}</span>
				<button class="count-btn" onclick={() => localCount++}>+</button>
			</div>
			<p class="demo-warn">⚠️ Navigating away and back resets this to 0.</p>
		</div>
	</div>

	<div class="separator"></div>

	<h3 class="sub-heading">Code: What fails vs what works</h3>
	<CodeBlock code={badCode} lang="typescript" filename="❌ WRONG — module state on server" />
	<CodeBlock code={goodCode} lang="typescript" filename="✅ CORRECT — context API" />
	<CodeBlock code={urlStateCode} lang="typescript" filename="URL as persistent state" />

	<!-- When to use which -->
	<div class="table-wrap">
		<table class="state-table">
			<thead>
				<tr>
					<th>State Type</th>
					<th>Survives navigation</th>
					<th>Shareable URL</th>
					<th>Safe on server</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>$state()</code> in component</td>
					<td class="no">❌</td>
					<td class="no">❌</td>
					<td class="yes">✅</td>
				</tr>
				<tr>
					<td><code>setContext()</code></td>
					<td class="no">❌</td>
					<td class="no">❌</td>
					<td class="yes">✅</td>
				</tr>
				<tr>
					<td>URL search params</td>
					<td class="yes">✅</td>
					<td class="yes">✅</td>
					<td class="yes">✅</td>
				</tr>
				<tr>
					<td>Module-level <code>let</code> (server)</td>
					<td class="yes">✅</td>
					<td class="no">❌</td>
					<td class="no">❌ DANGER</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>

