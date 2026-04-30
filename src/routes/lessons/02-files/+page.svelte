<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import {
		FileCode,
		Layout,
		ShieldAlert,
		Server,
		Zap,
		Globe,
		FileJson,
		Info,
		CheckCircle2,
		XCircle
	} from 'lucide-svelte';

	const lesson = lessons[1]; // 02-files
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const fileTypes = [
		{
			id: '+page.svelte',
			name: '+page.svelte',
			icon: FileCode,
			color: '#3fb950',
			title: 'The Route UI',
			role: 'Renders the actual HTML/UI for the route.',
			where: 'Browser + Server (SSR)',
			fails: 'The route won\'t exist. Navigating to the folder URL returns a 404.',
			code: `<script lang="ts">
  let { data } = $props(); // Receives data from load()
${'</'}script>

<h1>Hello {data.user.name}</h1>
<p>Welcome to your dashboard.</p>

<style>
  h1 { color: var(--color-accent); }
</style>`,
			lang: 'svelte'
		},
		{
			id: '+layout.svelte',
			name: '+layout.svelte',
			icon: Layout,
			color: '#bc8cff',
			title: 'The Shared Shell',
			role: 'Wraps sibling +page components and nested child routes.',
			where: 'Browser + Server (SSR)',
			fails: 'Child pages won\'t render if you forget the {@render children()} snippet.',
			code: `<script lang="ts">
  let { children } = $props();
${'</'}script>

<nav>
  <a href="/">Home</a>
</nav>

<main>
  {@render children()} <!-- Required for children to appear -->
</main>`,
			lang: 'svelte'
		},
		{
			id: '+page.server.ts',
			name: '+page.server.ts',
			icon: Server,
			color: '#f85149',
			title: 'Server Data & Actions',
			role: 'Loads data from databases/APIs and handles Form Actions.',
			where: 'Server Only (Secure)',
			fails: 'Forms won\'t submit to the server, and you can\'t access private env variables.',
			code: `import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) error(401, 'Unauthorized');
  return { user: locals.user };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    // Save to DB...
  }
};`,
			lang: 'typescript'
		},
		{
			id: '+page.ts',
			name: '+page.ts',
			icon: Zap,
			color: '#d29922',
			title: 'Universal Load',
			role: 'Loads data for a page. Runs on server for first hit, then browser for SPA nav.',
			where: 'Server + Browser',
			fails: 'Navigation becomes slower as every page requires a full server round-trip.',
			code: `import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(\`/api/items/\${params.id}\`);
  const item = await res.json();

  return { item };
};`,
			lang: 'typescript'
		},
		{
			id: '+server.ts',
			name: '+server.ts',
			icon: Globe,
			color: '#58a6ff',
			title: 'API Endpoints',
			role: 'Creates a REST API (GET, POST, etc.) that returns JSON/Raw data.',
			where: 'Server Only',
			fails: 'You can\'t create custom API routes for external tools or mobile apps.',
			code: `import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({
    status: 'success',
    data: [1, 2, 3]
  });
};`,
			lang: 'typescript'
		},
		{
			id: '+error.svelte',
			name: '+error.svelte',
			icon: ShieldAlert,
			color: '#f85149',
			title: 'Error Boundary',
			role: 'Shown when a load function throws an error.',
			where: 'Browser + Server',
			fails: 'Users see a plain, unbranded "Internal Error" page when things go wrong.',
			code: `<script lang="ts">
  import { page } from '$app/state';
${'</'}script>

<h1>Error {page.status}</h1>
<p>{page.error?.message}</p>`,
			lang: 'svelte'
		}
	];

	let activeId = $state('+page.svelte');
	const activeFile = $derived(fileTypes.find((f) => f.id === activeId)!);
</script>

<svelte:head>
	<title>Lesson 02 — SvelteKit File Types · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="SvelteKit uses a file-based routing system with strict naming conventions. By naming a file +page.svelte, +layout.svelte, or +server.ts, you tell the framework exactly how to handle that route's UI, data, and logic."
	whatFails="If you name your files anything else (like index.svelte or page.ts), SvelteKit will simply ignore them. Understanding these + prefixed filenames is the key to mastering the framework."
>
	<div class="mb-10">
		<h3 class="mb-6 flex items-center gap-2 text-[1rem] font-bold text-(--color-text)">
			<Info size={18} class="text-(--color-accent)" />
			The "Holy Trinity" of Route Files
		</h3>

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
			<!-- Sidebar Selection -->
			<div class="flex flex-col gap-2">
				{#each fileTypes as file (file.id)}
					{@const Icon = file.icon}
					<button
						class="group flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200 {activeId ===
						file.id
							? 'bg-white/5 border-(--active-color)'
							: 'bg-black/20 border-(--color-border) hover:border-white/20 hover:bg-white/5'}"
						onclick={() => (activeId = file.id)}
						style="--active-color: {file.color}"
					>
						<div
							class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/40 text-(--active-color) transition-transform group-hover:scale-110"
						>
							<Icon size={20} />
						</div>
						<div class="flex flex-col">
							<span
								class="text-[0.85rem] font-bold {activeId === file.id
									? 'text-white'
									: 'text-(--color-text-muted)'}">{file.name}</span
							>
							<span class="text-[0.7rem] text-(--color-text-muted)/70">{file.title}</span>
						</div>
					</button>
				{/each}
			</div>

			<!-- Content Area -->
			<div class="flex flex-col gap-4">
				{#key activeId}
					<div class="animate-fade-in">
						<div class="rounded-2xl border border-(--color-border) bg-(--color-surface-2) p-6">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<h4 class="m-0 text-[1.2rem] font-bold text-white">{activeFile.title}</h4>
							<p class="mt-1 text-[0.9rem] text-(--color-text-muted)">{activeFile.role}</p>
						</div>
						<div
							class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest text-(--color-text-muted)"
						>
							Runs on: <span class="text-white">{activeFile.where}</span>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div class="rounded-xl border border-(--color-success)/10 bg-(--color-success)/5 p-4">
							<div class="mb-2 flex items-center gap-2 text-[0.75rem] font-bold text-(--color-success)">
								<CheckCircle2 size={14} /> PURPOSE
							</div>
							<p class="m-0 text-[0.85rem] leading-relaxed text-(--color-text-muted)">
								{activeFile.role}
							</p>
						</div>
						<div class="rounded-xl border border-(--color-danger)/20 bg-(--color-danger)/5 p-4">
							<div class="mb-2 flex items-center gap-2 text-[0.75rem] font-bold text-(--color-danger)">
								<XCircle size={14} /> WHAT FAILS
							</div>
							<p class="m-0 text-[0.85rem] leading-relaxed text-(--color-text-muted)">
								{activeFile.fails}
							</p>
						</div>
					</div>

						<div
							class="mb-2 flex items-center gap-2 text-[0.75rem] font-bold tracking-widest text-(--color-text-muted) opacity-50 uppercase"
						>
							<FileJson size={14} /> Code Preview
						</div>
						<CodeBlock code={activeFile.code} lang={activeFile.lang} filename={activeFile.name} />
					</div>
				</div>
			{/key}
		</div>
		</div>
	</div>

	<!-- Comparison Section -->
	<div class="mt-12 rounded-2xl border border-(--color-border) bg-(--color-surface) p-8">
		<h3 class="mb-6 text-[1.1rem] font-bold text-white">Universal vs. Server-Only Loading</h3>
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div>
				<h4 class="mb-3 flex items-center gap-2 text-[0.9rem] font-bold text-(--color-warning)">
					<Zap size={16} /> +page.ts (Universal)
				</h4>
				<ul class="flex flex-col gap-3 p-0 text-[0.85rem] text-(--color-text-muted) list-none">
					<li class="flex items-start gap-2">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-warning)"></span>
						Best for public APIs or data that should be fetched on the client during SPA navigation.
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-warning)"></span>
						Cannot use private environment variables (secrets).
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-warning)"></span>
						Runs on both server and client.
					</li>
				</ul>
			</div>
			<div>
				<h4 class="mb-3 flex items-center gap-2 text-[0.9rem] font-bold text-(--color-danger)">
					<Server size={16} /> +page.server.ts (Server-only)
				</h4>
				<ul class="flex flex-col gap-3 p-0 text-[0.85rem] text-(--color-text-muted) list-none">
					<li class="flex items-start gap-2">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-danger)"></span>
						Access databases, private APIs, and filesystem directly.
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-danger)"></span>
						Handles Form Actions (POST requests).
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-danger)"></span>
						Always secure — code is never shipped to the browser.
					</li>
				</ul>
			</div>
		</div>
	</div>
</LessonLayout>
