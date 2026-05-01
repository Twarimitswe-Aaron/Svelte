<!--
  Lesson 07 — State Management
  
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
	import { TriangleAlert } from 'lucide-svelte';

	const lesson = lessons[6];
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
		await goto(resolve(url.toString() as "/"), { keepFocus: true, replaceState: true });
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
  await goto(resolve(url.toString() as any), { replaceState: true });
  // NOTE: Without replaceState: every increment adds to browser history
}`;
</script>

<svelte:head>
	<title>Lesson 07 — State Management · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit runs on the server and client. Module-level state (let x = 0) is SHARED across all users on the server — dangerous! Context API ($setContext) scopes state to a component tree. The URL ($page.url) makes state bookmarkable."
	whatFails="Using module-level state on the server leaks one user's data to another. Without context API, deeply nested components can't share state without prop-drilling. Without URL state, refreshing the page loses the current view."
>
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
		<!-- DEMO 1: Context Counter -->
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4 flex flex-col justify-between">
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<span class="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">Context API</span>
					<span class="text-xs font-bold text-white/40 font-mono">setContext / getContext</span>
				</div>
				<p class="text-sm text-white/60 leading-relaxed">
					This counter uses <code>setContext</code> — scoped to this component tree, safe on the
					server. Each user gets their own instance.
				</p>
			</div>
			
			<div class="flex items-center justify-center gap-4 py-4 bg-black/40 rounded-xl border border-white/5">
				<button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95" onclick={() => contextCount--}>−</button>
				<span class="text-3xl font-bold text-(--color-accent) min-w-12 text-center font-mono">{contextCount}</span>
				<button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95" onclick={() => contextCount++}>+</button>
			</div>
			
			<p class="text-[11px] text-red-400/70 font-medium italic flex items-center gap-2">
				<TriangleAlert size={14} /> If this were <code>let count = 0</code> at module level in a server file, all users
				would share this counter!
			</p>
		</div>

		<!-- DEMO 2: URL state -->
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4 flex flex-col justify-between">
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<span class="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">URL State</span>
					<span class="text-xs font-bold text-white/40 font-mono">?n= search param</span>
				</div>
				<p class="text-sm text-white/60 leading-relaxed">
					This counter is stored in the URL as <code>?n=</code>. Refresh the page — the count
					persists! Share the URL and others see the same value.
				</p>
			</div>

			<div class="flex items-center justify-center gap-4 py-4 bg-black/40 rounded-xl border border-white/5">
				<button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95" onclick={() => setUrlCount(urlCount - 1)}>−</button>
				<span class="text-3xl font-bold text-(--color-accent) min-w-12 text-center font-mono">{urlCount}</span>
				<button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95" onclick={() => setUrlCount(urlCount + 1)}>+</button>
			</div>

			<div class="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 flex items-center justify-between gap-2 overflow-hidden">
				<span class="text-[10px] font-bold uppercase tracking-widest text-white/20 whitespace-nowrap">URL:</span>
				<code class="text-[10px] text-white/60 font-mono truncate">{$page.url.pathname}{$page.url.search || ''}</code>
			</div>
		</div>

		<!-- DEMO 3: Local state -->
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4 flex flex-col justify-between">
			<div class="space-y-2">
				<div class="flex items-center gap-2">
					<span class="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-widest">Local $state</span>
					<span class="text-xs font-bold text-white/40 font-mono">Component-scoped rune</span>
				</div>
				<p class="text-sm text-white/60 leading-relaxed">
					Plain <code>$state()</code> — fine for UI-only state that doesn't need to survive
					navigation or be shared between components.
				</p>
			</div>

			<div class="flex items-center justify-center gap-4 py-4 bg-black/40 rounded-xl border border-white/5">
				<button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95" onclick={() => localCount--}>−</button>
				<span class="text-3xl font-bold text-(--color-accent) min-w-12 text-center font-mono">{localCount}</span>
				<button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-all active:scale-95" onclick={() => localCount++}>+</button>
			</div>

			<p class="text-[11px] text-yellow-400/50 font-medium italic flex items-center gap-2"><TriangleAlert size={14} /> Navigating away and back resets this to 0.</p>
		</div>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Code Patterns</h3>
	<CodeBlock code={badCode} lang="typescript" filename="❌ WRONG — module state on server" />
	<CodeBlock code={goodCode} lang="typescript" filename="✅ CORRECT — context API" />
	<CodeBlock code={urlStateCode} lang="typescript" filename="URL as persistent state" />

	<!-- When to use which -->
	<div class="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-white/2 border-b border-white/10">
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">State Type</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Survives navigation</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Shareable URL</th>
					<th class="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white/40">Safe on server</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-white/5">
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium"><code>$state()</code> in component</td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold font-mono">❌ No</td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold font-mono">❌ No</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold font-mono">✅ Yes</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium"><code>setContext()</code></td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold font-mono">❌ No</td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold font-mono">❌ No</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold font-mono">✅ Yes</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">URL search params</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold font-mono">✅ Yes</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold font-mono">✅ Yes</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold font-mono">✅ Yes</td>
				</tr>
				<tr class="hover:bg-white/1 transition-colors">
					<td class="px-6 py-4 text-sm text-white font-medium">Module-level <code>let</code> (server)</td>
					<td class="px-6 py-4 text-sm text-green-400 font-bold font-mono">✅ Yes</td>
					<td class="px-6 py-4 text-sm text-red-400 font-bold font-mono">❌ No</td>
					<td class="px-6 py-4 text-sm text-red-600 font-bold font-mono italic">🚨 DANGER</td>
				</tr>
			</tbody>
		</table>
	</div>
</LessonLayout>

