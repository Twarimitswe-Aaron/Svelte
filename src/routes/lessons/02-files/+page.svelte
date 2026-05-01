<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import {
		CheckCircle2,
		XCircle,
		FileJson
	} from 'lucide-svelte';

	const lesson = lessons[1]; // 02-files
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const fileTypes = [
		{
			id: '+page.svelte',
			name: '+page.svelte',
			icon: 'FileCode',
			color: 'text-green-400',
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
			icon: 'Layout',
			color: 'text-purple-400',
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
			icon: 'Server',
			color: 'text-red-400',
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
			icon: 'Zap',
			color: 'text-yellow-400',
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
			icon: 'Globe',
			color: 'text-blue-400',
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
			icon: 'ShieldAlert',
			color: 'text-red-500',
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
	<div class="mb-12">
		<h3 class="text-xl font-bold text-white mb-8 flex items-center gap-3">
			<LessonIcon name="Info" size={20} class="text-(--color-accent)" />
			The "Holy Trinity" of Route Files
		</h3>

		<div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
			<!-- Sidebar Selection -->
			<div class="flex flex-col gap-3">
				{#each fileTypes as file (file.id)}
					<button
						class="group flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300 {activeId === file.id
							? 'bg-white/10 border-white/20 shadow-lg shadow-black/20'
							: 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/8'}"
						onclick={() => (activeId = file.id)}
					>
						<div
							class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/40 {file.color} transition-transform group-hover:scale-105"
						>
							<LessonIcon name={file.icon} size={22} />
						</div>
						<div class="flex flex-col">
							<span
								class="text-[13px] font-bold tracking-tight transition-colors {activeId === file.id
									? 'text-white'
									: 'text-white/40 group-hover:text-white/60'}">{file.name}</span
							>
							<span class="text-[10px] uppercase font-bold tracking-widest opacity-20">{file.title}</span>
						</div>
					</button>
				{/each}
			</div>

			<!-- Content Area -->
			<div class="relative min-h-[500px]">
				{#key activeId}
					<div class="animate-fade-in absolute inset-0 space-y-6">
						<div class="p-8 rounded-xl border border-white/10 bg-white/5 space-y-8 backdrop-blur-md">
							<div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
								<div>
									<h4 class="text-2xl font-black text-white tracking-tight mb-1">{activeFile.name}</h4>
									<p class="text-sm text-white/50 leading-relaxed italic">{activeFile.role}</p>
								</div>
								<div
									class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 h-fit"
								>
									Runs on: <span class="text-white">{activeFile.where}</span>
								</div>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="p-6 rounded-xl bg-green-500/5 border border-green-500/10 space-y-3">
									<div class="flex items-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
										<CheckCircle2 size={14} /> Purpose
									</div>
									<p class="text-xs text-white/60 leading-relaxed">
										{activeFile.role}
									</p>
								</div>
								<div class="p-6 rounded-xl bg-red-500/5 border border-red-500/10 space-y-3">
									<div class="flex items-center gap-2 text-[10px] font-bold text-red-400 uppercase tracking-widest">
										<XCircle size={14} /> What Fails
									</div>
									<p class="text-xs text-white/60 leading-relaxed">
										{activeFile.fails}
									</p>
								</div>
							</div>

							<div class="space-y-4 pt-4">
								<div class="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
									<FileJson size={14} /> Implementation Preview
								</div>
								<CodeBlock code={activeFile.code} lang={activeFile.lang} filename={activeFile.name} />
							</div>
						</div>
					</div>
				{/key}
			</div>
		</div>
	</div>

	<!-- Comparison Section -->
	<div class="mt-16 p-10 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
		<div class="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
		
		<h3 class="text-xl font-bold text-white mb-10 relative z-10 flex items-center gap-3">
			<LessonIcon name="Zap" size={20} class="text-yellow-400" />
			Universal vs. Server-Only Loading
		</h3>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
			<div class="space-y-6">
				<div class="flex items-center gap-3 text-yellow-400">
					<LessonIcon name="Zap" size={18} />
					<h4 class="text-sm font-bold uppercase tracking-widest">+page.ts (Universal)</h4>
				</div>
				<ul class="space-y-4">
					<li class="flex items-start gap-3 group">
						<div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500 transition-colors"></div>
						<p class="text-sm text-white/50 group-hover:text-white/80 transition-colors">Best for public APIs or data that should be fetched on the client during SPA navigation.</p>
					</li>
					<li class="flex items-start gap-3 group">
						<div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500 transition-colors"></div>
						<p class="text-sm text-white/50 group-hover:text-white/80 transition-colors">Cannot use private environment variables (secrets).</p>
					</li>
					<li class="flex items-start gap-3 group">
						<div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500/40 group-hover:bg-yellow-500 transition-colors"></div>
						<p class="text-sm text-white/50 group-hover:text-white/80 transition-colors">Runs on both server and client.</p>
					</li>
				</ul>
			</div>

			<div class="space-y-6">
				<div class="flex items-center gap-3 text-red-400">
					<LessonIcon name="Server" size={18} />
					<h4 class="text-sm font-bold uppercase tracking-widest">+page.server.ts (Server-only)</h4>
				</div>
				<ul class="space-y-4">
					<li class="flex items-start gap-3 group">
						<div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors"></div>
						<p class="text-sm text-white/50 group-hover:text-white/80 transition-colors">Access databases, private APIs, and filesystem directly.</p>
					</li>
					<li class="flex items-start gap-3 group">
						<div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors"></div>
						<p class="text-sm text-white/50 group-hover:text-white/80 transition-colors">Handles Form Actions (POST requests).</p>
					</li>
					<li class="flex items-start gap-3 group">
						<div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500/40 group-hover:bg-red-500 transition-colors"></div>
						<p class="text-sm text-white/50 group-hover:text-white/80 transition-colors">Always secure — code is never shipped to the browser.</p>
					</li>
				</ul>
			</div>
		</div>
	</div>
</LessonLayout>
