<!--
  Lesson 11 — Remote Functions
  
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
	// Import remote functions as if they're local — SvelteKit generates the HTTP layer
	import { getPosts, likePost, addPost } from '$lib/server/remote-demo.remote.js';

	const lesson = lessons[10];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// ── Live posts from server via query() ──────────────────────────────────
	// getPosts() is a remote query — on first render it returns a Promise.
	// In a real app you'd use {#await} or $derived with async.
	let postsPromise = $state(getPosts());
	let loading = $state(false);
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
	const remoteFileCode = `// src/lib/server/posts.remote.ts
// .remote.ts — SvelteKit auto-generates the HTTP endpoint for each export
// You NEVER write fetch() or +server.ts manually for these
import { query, command, form } from '$app/server';

// query() — server-side read, callable from any component
export const getPosts = query(async () => {
  return await db.select('SELECT * FROM posts');
  // Runs on server only — safe to query DB/secrets
  // ⚠️ Without query(): must write +server.ts GET + fetch('/api/posts') manually
});

// command() — server-side mutation, called from JS (not HTML form)
export const likePost = command(async (id: number) => {
  await db.run('UPDATE posts SET likes = likes + 1 WHERE id = ?', id);
  return { success: true };
  // ⚠️ Without command(): must write +server.ts POST + manual fetch call
});

// form() — server-side mutation bound to an HTML <form>
// Works WITHOUT JavaScript (progressive enhancement)
export const addPost = form(async ({ title }) => {
  await db.run('INSERT INTO posts (title) VALUES (?)', title);
  // ⚠️ Without form(): no JS-free form submission support
});`;

	const usageCode = `<!-- +page.svelte — use remote functions like normal async calls -->
<script lang="ts">
  import { getPosts, likePost, addPost } from '$lib/server/posts.remote.js';
  // ⚡ These look like local functions but they actually call the server!

  let posts = $state(getPosts()); // starts as a Promise
  
  async function like(id: number) {
    await likePost(id);   // command() — sends POST to generated endpoint
    posts = getPosts();    // refresh the query
  }
<\/script>

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
	<title>Lesson 11 — Remote Functions · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Remote functions (SvelteKit 2.27+) let you write server-side logic in .remote.ts files and call it from any component as if it were a local function. SvelteKit auto-generates the HTTP endpoint. query() reads data, command() mutates data from JS, form() binds to HTML forms, prerender() runs at build time."
	whatFails="Without remote functions: you must manually write +server.ts endpoints AND client-side fetch() wrappers for every server call. Without .remote.ts extension: the file is treated as normal code with no generated endpoint. Importing from src/lib/server in client code throws a security build error."
>
	<!-- Live demo -->
	<div class="demo-header">
		<h3 class="sub-heading">⚡ Live Demo — Remote Functions in Action</h3>
		<p class="demo-text">
			The posts below come from <code>getPosts()</code> — a <code>query()</code> in
			<code>src/lib/server/remote-demo.remote.ts</code>. Liking calls
			<code>likePost(id)</code> — a <code>command()</code>. No manually written endpoints!
		</p>
		{#if lastAction}
			<div class="action-toast animate-fade-in">{lastAction}</div>
		{/if}
	</div>

	{#await postsPromise}
		<div class="loading-posts">
			<div class="spinner"></div>
			<span>Fetching posts via query()…</span>
		</div>
	{:then posts}
		<div class="posts-grid">
			{#each posts as post}
				<div class="post-item">
					<div class="post-info">
						<span class="post-id"># {post.id}</span>
						<span class="post-title-text">{post.title}</span>
						<div class="post-tags-row">
							{#each post.tags as tag}
								<span class="tag-pill">{tag}</span>
							{/each}
						</div>
					</div>
					<button
						class="like-btn"
						onclick={() => handleLike(post.id)}
						disabled={likingId === post.id}
					>
						{likingId === post.id ? '…' : '❤️'}
						<span class="like-count">{post.likes}</span>
					</button>
				</div>
			{/each}
		</div>
	{:catch err}
		<div class="error-msg">Failed to load: {err.message}</div>
	{/await}

	<!-- Add post via command() -->
	<div class="add-form">
		<input
			type="text"
			bind:value={addTitle}
			placeholder="New post title (calls addPost command)"
			onkeydown={(e) => e.key === 'Enter' && handleAdd()}
		/>
		<button class="btn btn-primary" onclick={handleAdd} disabled={adding || !addTitle.trim()}>
			{adding ? '⏳ Adding…' : '➕ Add via command()'}
		</button>
	</div>

	<div class="separator"></div>

	<!-- 4 flavours grid -->
	<h3 class="sub-heading">4 Remote Function Flavours</h3>
	<div class="flavours-grid">
		<div class="flavour-card flavour-query">
			<div class="flavour-name">query()</div>
			<div class="flavour-method">GET-like</div>
			<p>Reads data from the server. Returns a Promise. Useful for replacing load() when you need to fetch data from inside a component, not just during page load.</p>
			<div class="flavour-fails">⚠️ Without it: write +server.ts GET + fetch() wrapper</div>
		</div>
		<div class="flavour-card flavour-command">
			<div class="flavour-name">command()</div>
			<div class="flavour-method">POST-like</div>
			<p>Sends data to the server and mutates state. Not tied to any HTML element — pure JavaScript call. No progressive enhancement.</p>
			<div class="flavour-fails">⚠️ Without it: write +server.ts POST + fetch() wrapper</div>
		</div>
		<div class="flavour-card flavour-form">
			<div class="flavour-name">form()</div>
			<div class="flavour-method">HTML Form POST</div>
			<p>Binds a server function to an HTML &lt;form&gt; element. Works without JavaScript (progressive enhancement). Use it instead of form actions for remote-function-based apps.</p>
			<div class="flavour-fails">⚠️ Without it: no JS-free form submissions</div>
		</div>
		<div class="flavour-card flavour-prerender">
			<div class="flavour-name">prerender()</div>
			<div class="flavour-method">Build time</div>
			<p>Like query() but runs at build time and generates static data. The result is embedded in the bundle — zero server round-trips at runtime.</p>
			<div class="flavour-fails">⚠️ Without it: dynamic queries add server latency to static data</div>
		</div>
	</div>

	<div class="separator"></div>

	<!-- Version note -->
	<div class="version-note">
		⚠️ Remote functions require <strong>SvelteKit ≥ 2.27</strong>. Check your version with
		<code>pnpm list @sveltejs/kit</code>. If your version is older, use
		<code>+server.ts</code> + manual <code>fetch()</code> instead (covered in Lesson 10).
	</div>

	<div class="separator"></div>

	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={remoteFileCode} lang="typescript" filename="posts.remote.ts" />
	<CodeBlock code={usageCode} lang="svelte" filename="+page.svelte" />
	<CodeBlock code={compareCode} lang="typescript" filename="old way vs remote functions" />
</LessonLayout>

<style>
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.75rem; }
	.demo-text { font-size: 0.875rem; color: var(--color-text-muted); margin: 0 0 0.75rem; line-height: 1.65; }
	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }

	.demo-header { margin-bottom: 1rem; }

	.action-toast {
		background: rgba(63,185,80,0.1);
		border: 1px solid rgba(63,185,80,0.4);
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
		font-size: 0.85rem;
		color: var(--color-success);
		margin-top: 0.5rem;
	}

	.loading-posts {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.spinner {
		width: 18px; height: 18px;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	.posts-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.post-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
	}

	.post-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }

	.post-id {
		font-size: 0.68rem;
		color: var(--color-text-muted);
		font-family: monospace;
	}

	.post-title-text {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.post-tags-row {
		display: flex;
		gap: 0.3rem;
		flex-wrap: wrap;
	}

	.tag-pill {
		font-size: 0.68rem;
		background: rgba(88,166,255,0.1);
		color: var(--color-accent);
		border: 1px solid rgba(88,166,255,0.2);
		border-radius: 999px;
		padding: 0.1rem 0.45rem;
	}

	.like-btn {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.35rem 0.7rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		color: var(--color-text);
		transition: border-color 0.15s;
		white-space: nowrap;
	}
	.like-btn:hover { border-color: var(--color-danger); }
	.like-btn:disabled { opacity: 0.5; }

	.like-count {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.add-form {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.add-form input {
		flex: 1;
		min-width: 200px;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		color: var(--color-text);
		font-family: inherit;
		font-size: 0.875rem;
		outline: none;
	}
	.add-form input:focus { border-color: var(--color-accent); }

	.error-msg {
		padding: 0.75rem;
		color: var(--color-danger);
		font-size: 0.875rem;
	}

	/* 4 flavours grid */
	.flavours-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
	}

	.flavour-card {
		border-radius: 10px;
		padding: 1rem;
		border: 1px solid var(--color-border);
		background: var(--color-surface-2);
	}

	.flavour-query  { border-color: rgba(88,166,255,0.35);  background: rgba(88,166,255,0.04); }
	.flavour-command{ border-color: rgba(188,140,255,0.35);  background: rgba(188,140,255,0.04); }
	.flavour-form   { border-color: rgba(63,185,80,0.35);   background: rgba(63,185,80,0.04); }
	.flavour-prerender { border-color: rgba(210,153,34,0.35); background: rgba(210,153,34,0.04); }

	.flavour-name {
		font-size: 0.9rem;
		font-weight: 800;
		font-family: monospace;
		margin-bottom: 0.1rem;
	}
	.flavour-query   .flavour-name { color: var(--color-accent); }
	.flavour-command .flavour-name { color: var(--color-accent-2); }
	.flavour-form    .flavour-name { color: var(--color-success); }
	.flavour-prerender .flavour-name { color: var(--color-warning); }

	.flavour-method {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	.flavour-card p {
		font-size: 0.78rem;
		color: var(--color-text-muted);
		margin: 0 0 0.6rem;
		line-height: 1.6;
	}

	.flavour-fails {
		font-size: 0.72rem;
		color: var(--color-danger);
		background: rgba(248,81,73,0.07);
		border: 1px solid rgba(248,81,73,0.2);
		border-radius: 5px;
		padding: 0.3rem 0.5rem;
		line-height: 1.4;
	}

	.version-note {
		background: rgba(210,153,34,0.08);
		border: 1px solid rgba(210,153,34,0.3);
		border-radius: 8px;
		padding: 0.75rem 1rem;
		font-size: 0.83rem;
		color: var(--color-text-muted);
		line-height: 1.65;
	}
</style>
