<!--
  Lesson 12 — Remote Functions
  
  CONCEPTS SHOWN:
  1. query()   — server function that reads data (like server load, but callable anywhere)
  2. command() — server mutation callable from any component (like fetch to a +server.ts)
  3. form()    — server function bound to an HTML <form> (progressive enhancement built-in)
  4. prerender() — server function optimised for static prerender time
  5. .remote.ts files — SvelteKit auto-generates the HTTP endpoints

  Remote functions require SvelteKit >= 2.27 (Svelte 5 era).
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { TriangleAlert } from 'lucide-svelte';
	// Import remote functions as if they're local — SvelteKit generates the HTTP layer
	import { getPosts, likePost, addPost } from '$lib/remote-demo.remote.js';

	const lesson = lessons[11];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// ── Live posts from server via query() ──────────────────────────────────
	// getPosts() is a remote query — on first render it returns a Promise.
	// In a real app you'd use {#await} or $derived with async.
	let postsPromise = $state(getPosts());

	let addTitle = $state('');
	let adding = $state(false);
	let likingId = $state<number | null>(null);
	let lastAction = $state<string | null>(null);

	async function handleLike(id: number) {
		likingId = id;
		try {
			// command() call — sends a POST-like request to the generated endpoint
			const result = await likePost(id);
			if (result.success) {
				lastAction = `❤️ Liked! New count: ${result.newLikes}`;
			}
			// Refresh the posts list
			postsPromise = getPosts();
		} finally {
			likingId = null;
		}
	}

	async function handleAdd() {
		if (!addTitle.trim()) return;
		adding = true;
		try {
			await addPost(addTitle.trim());
			lastAction = `✅ Added: "${addTitle}"`;
			addTitle = '';
			postsPromise = getPosts();
		} finally {
			adding = false;
		}
	}

	// ── Code examples ────────────────────────────────────────────────────────
	const remoteFileCode = `// src/lib/posts.remote.ts
// .remote.ts — SvelteKit auto-generates the HTTP endpoint for each export
// You NEVER write fetch() or +server.ts manually for these
// TriangleAlert NOTE: Must NOT be inside src/lib/server 
import { query, command, form } from '$app/server';

// query() — server-side read, callable from any component
export const getPosts = query(async () => {
  return await db.select('SELECT * FROM posts');
  // Runs on server only — safe to query DB/secrets
  // TriangleAlert Without query(): must write +server.ts GET + fetch('/api/posts') manually
});

// command() — server-side mutation, called from JS (not HTML form)
export const likePost = command(async (id: number) => {
  await db.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', id);
  return { success: true };
  // TriangleAlert Without command(): must write +server.ts POST + manual fetch call
});

// form() — server-side mutation bound to an HTML <form>
// Works WITHOUT JavaScript (progressive enhancement)
export const addPost = form(async ({ title }) => {
  await db.run('INSERT INTO posts (title) VALUES (?)', title);
  // TriangleAlert Without form(): no JS-free form submission support
});`;

	const usageCode = `<!-- +page.svelte — use remote functions like normal async calls -->
<script lang="ts">
  import { getPosts, likePost, addPost } from '$lib/posts.remote.js';
  // ⚡ These look like local functions but they actually call the server!

  let posts = $state(getPosts()); // starts as a Promise
  
  async function like(id: number) {
    await likePost(id);   // command() — sends POST to generated endpoint
    posts = getPosts();    // refresh the query
  }
<${'/'}script>

{#await posts}
  <p>Loading...</p>
{:then data}
  {#each data as post}
    <div>
      {post.title}
      <button onclick={() => like(post.id)}>❤️ {post.likes}</button>
    </div>
  {/each}
{/await}

<!-- form() — works even without JavaScript! -->
<form use:addPost.enhance>
  <input name="title" placeholder="New post title" />
  <button>Add Post</button>
</form>`;

	const compareCode = `// OLD WAY — without remote functions:
// 1. Write +server.ts endpoint
export const POST = async ({ request }) => {
  const { title } = await request.json();
  await db.run('INSERT...');
  return json({ ok: true });
};
// 2. Write client-side fetch wrapper
async function addPost(title: string) {
  await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title }),
    headers: { 'Content-Type': 'application/json' }
  });
}

// NEW WAY — with remote functions (SvelteKit >= 2.27):
// Just write the business logic, SvelteKit generates the endpoint
export const addPost = command(async (title: string) => {
  await db.run('INSERT...');
});
// Client: await addPost(title)  ← that's it!`;
</script>

<svelte:head>
	<title>Lesson 12 — Remote Functions · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Remote functions (SvelteKit 2.27+) let you write server-side logic in .remote.ts files and call it from any component as if it were a local function. SvelteKit auto-generates the HTTP endpoint. query() reads data, command() mutates data from JS, form() binds to HTML forms, prerender() runs at build time."
	whatFails="Without remote functions: you must manually write +server.ts endpoints AND client-side fetch() wrappers for every server call. Without .remote.ts extension: the file is treated as normal code with no generated endpoint. Importing from src/lib/server in client code throws a security build error."
>
	<!-- Live demo -->
	<section class="mb-12">
		<div class="mb-8">
			<h3 class="text-xl font-bold text-white mb-4 gap-2 flex items-center">
				<LessonIcon name="Zap" size={22} class="text-(--color-accent)" />
				Live Demo — Remote Functions in Action
			</h3>
			<p class="text-sm text-white/60 leading-relaxed max-w-3xl">
				The posts below come from <code
					class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">getPosts()</code
				>
				— a <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">query()</code> in
				<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
					>src/lib/server/remote-demo.remote.ts</code
				>. Liking calls
				<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">likePost(id)</code> — a
				<code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">command()</code>. No
				manually written endpoints!
			</p>
			{#if lastAction}
				<div
					class="mt-4 px-4 py-2 rounded-lg bg-green-500/10 border-green-500/20 text-green-400 text-xs font-bold animate-fade-in gap-2 inline-flex items-center border"
				>
					<LessonIcon name="CheckCircle" size={14} />
					{lastAction}
				</div>
			{/if}
		</div>

		{#await postsPromise}
			<div
				class="p-12 rounded-xl border-white/10 bg-white/5 glass-blur gap-4 flex flex-col items-center justify-center border"
			>
				<div
					class="w-8 h-8 border-white/20 animate-spin rounded-full border-2 border-t-(--color-accent)"
				></div>
				<span class="text-sm text-white/40 font-medium">Fetching posts via query()…</span>
			</div>
		{:then posts}
			<div class="md:grid-cols-2 gap-4 mb-8 grid grid-cols-1">
				{#each posts as post (post.id)}
					<div
						class="group p-6 rounded-xl border-white/10 bg-white/5 glass-blur hover:bg-white/10 hover:border-white/20 gap-6 flex items-center justify-between border transition-all"
					>
						<div class="space-y-3">
							<div class="gap-3 flex items-center">
								<span
									class="px-2 py-0.5 rounded bg-white/10 font-mono text-white/40 tracking-widest text-[10px] uppercase"
									>#{post.id}</span
								>
								<span
									class="text-sm font-bold text-white transition-colors group-hover:text-(--color-accent)"
									>{post.title}</span
								>
							</div>
							<div class="gap-2 flex flex-wrap">
								{#each post.tags as tag (tag)}
									<span
										class="px-2 py-0.5 rounded-md bg-white/5 border-white/10 text-white/40 border text-[10px]"
										>{tag}</span
									>
								{/each}
							</div>
						</div>
						<button
							class="gap-1 p-3 rounded-xl border-white/10 bg-white/5 glass-blur hover:bg-red-500/10 hover:border-red-500/30 flex flex-col items-center border transition-all active:scale-90 disabled:opacity-30"
							onclick={() => handleLike(post.id)}
							disabled={likingId === post.id}
						>
							{#if likingId === post.id}
								<div
									class="w-4 h-4 border-white/20 border-t-red-500 animate-spin rounded-full border-2"
								></div>
							{:else}
								<span class="text-red-500 text-lg transition-transform group-hover:scale-125"
									>❤️</span
								>
							{/if}
							<span class="font-bold text-white/60 text-[10px]">{post.likes}</span>
						</button>
					</div>
				{/each}
			</div>
		{:catch err}
			<div
				class="p-8 rounded-xl border-red-500/20 bg-red-500/5 text-red-400 text-sm font-medium glass-blur border"
			>
				Failed to load: {err.message}
			</div>
		{/await}

		<!-- Add post via command() -->
		<div
			class="max-w-xl p-1 bg-white/5 border-white/10 rounded-xl gap-2 pr-1 shadow-2xl glass-blur flex items-center border"
		>
			<input
				type="text"
				bind:value={addTitle}
				placeholder="New post title (calls addPost command)"
				class="px-5 py-3 text-sm text-white placeholder-white/20 flex-1 border-none bg-transparent outline-none"
				onkeydown={(e) => e.key === 'Enter' && handleAdd()}
			/>
			<button
				class="px-6 py-2.5 rounded-xl text-white font-bold text-sm gap-2 flex items-center bg-(--color-accent) transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-30"
				onclick={handleAdd}
				disabled={adding || !addTitle.trim()}
			>
				{adding ? '⏳' : '➕'}
				<span>{adding ? 'Adding…' : 'Add via command()'}</span>
			</button>
		</div>
	</section>

	<div class="my-6 h-px bg-(--color-border)"></div>

	<!-- 4 flavours grid -->
	<h3 class="text-lg font-bold mb-6 tracking-widest text-white/30 uppercase">
		4 Remote Function Flavours
	</h3>
	<div class="sm:grid-cols-2 gap-4 mb-12 grid grid-cols-1">
		<div
			class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 hover:border-purple-500/30 border transition-all"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-bold text-white font-mono">query()</div>
				<span
					class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold tracking-widest text-[10px] uppercase"
					>GET-like</span
				>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Reads data from the server. Returns a Promise. Useful for replacing load() inside a
				component.
			</p>
			<div class="font-medium text-red-400/50 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Without it: write +server.ts GET + fetch()
			</div>
		</div>
		<div
			class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 hover:border-blue-500/30 border transition-all"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-bold text-white font-mono">command()</div>
				<span
					class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold tracking-widest text-[10px] uppercase"
					>POST-like</span
				>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Sends data and mutates state. Pure JavaScript call. No progressive enhancement.
			</p>
			<div class="font-medium text-red-400/50 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Without it: write +server.ts POST + fetch()
			</div>
		</div>
		<div
			class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 hover:border-green-500/30 border transition-all"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-bold text-white font-mono">form()</div>
				<span
					class="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold tracking-widest text-[10px] uppercase"
					>HTML Form POST</span
				>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Binds to HTML forms. Works without JS (progressive enhancement). Modern alternative to form
				actions.
			</p>
			<div class="font-medium text-red-400/50 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Without it: no JS-free submissions
			</div>
		</div>
		<div
			class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 hover:border-yellow-500/30 border transition-all"
		>
			<div class="flex items-center justify-between">
				<div class="text-sm font-bold text-white font-mono">prerender()</div>
				<span
					class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-bold tracking-widest text-[10px] uppercase"
					>Build time</span
				>
			</div>
			<p class="text-xs text-white/50 leading-relaxed">
				Runs at build time and generates static data. Zero server round-trips at runtime.
			</p>
			<div class="font-medium text-red-400/50 gap-1 flex items-center text-[10px] italic">
				<TriangleAlert size={10} /> Without it: dynamic queries add latency
			</div>
		</div>
	</div>

	<div class="my-6 h-px bg-(--color-border)"></div>

	<!-- Version note -->
	<div
		class="p-6 rounded-xl bg-yellow-500/5 border-yellow-500/20 text-yellow-500/80 mb-12 glass-blur border"
	>
		<div class="gap-2 mb-2 font-bold text-sm flex items-center">
			<LessonIcon name="AlertCircle" size={18} />
			Version Required
		</div>
		<p class="text-sm leading-relaxed">
			Remote functions require <strong>SvelteKit ≥ 2.27</strong>. Check your version with
			<code class="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-mono"
				>pnpm list @sveltejs/kit</code
			>. If your version is older, use
			<code class="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-mono"
				>+server.ts</code
			>
			+ manual
			<code class="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 font-mono">fetch()</code> instead.
		</p>
	</div>

	<div class="my-6 h-px bg-(--color-border)"></div>

	<h3 class="mb-3 font-bold text-white text-[0.95rem]">Code</h3>
	<CodeBlock code={remoteFileCode} lang="typescript" filename="posts.remote.ts" />
	<CodeBlock code={usageCode} lang="svelte" filename="+page.svelte" />
	<CodeBlock code={compareCode} lang="typescript" filename="old way vs remote functions" />
</LessonLayout>
