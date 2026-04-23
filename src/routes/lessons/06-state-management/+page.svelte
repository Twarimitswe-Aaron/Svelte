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
		await goto(url.toString(), { keepFocus: true, replaceState: true });
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

// Read state from URL
const count = $derived(
  parseInt($page.url.searchParams.get('n') ?? '0')
);

// Write state to URL (no page reload with goto)
async function setCount(n: number) {
  const url = new URL($page.url);
  url.searchParams.set('n', String(n));
  await goto(url, { replaceState: true });
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

<style>
	.state-demos {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.demo-block {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 1rem;
	}

	.demo-label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin-bottom: 0.6rem;
		flex-wrap: wrap;
	}

	.demo-name {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	.demo-desc {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0 0 0.75rem;
	}

	.counter-ui {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: center;
		padding: 0.75rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		margin-bottom: 0.75rem;
	}

	.count-btn {
		width: 32px;
		height: 32px;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		color: var(--color-text);
		font-size: 1.2rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.15s;
	}
	.count-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

	.count-val {
		font-size: 1.75rem;
		font-weight: 800;
		min-width: 3ch;
		text-align: center;
		color: var(--color-text);
	}

	.demo-warn {
		font-size: 0.75rem;
		color: var(--color-warning);
		margin: 0;
		line-height: 1.5;
	}

	.url-pill {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 0.3rem 0.6rem;
		font-size: 0.75rem;
		overflow: hidden;
	}

	.url-label-sm {
		color: var(--color-text-muted);
		flex-shrink: 0;
	}

	.url-pill code {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.75rem;
		color: var(--color-accent);
		background: none;
		border: none;
		padding: 0;
	}

	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }

	.table-wrap { overflow-x: auto; margin-top: 1rem; }

	.state-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.825rem;
	}
	.state-table th {
		text-align: left;
		padding: 0.55rem 1rem;
		background: var(--color-surface-2);
		border-bottom: 1px solid var(--color-border);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-muted);
	}
	.state-table td {
		padding: 0.55rem 1rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}
	.state-table tr:last-child td { border-bottom: none; }
	.state-table tr:hover td { background: var(--color-surface-2); }
	.yes { color: var(--color-success) !important; font-weight: 700; }
	.no  { color: var(--color-danger) !important; font-weight: 700; }
</style>
