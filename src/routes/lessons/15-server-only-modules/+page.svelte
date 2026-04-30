<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	const lesson = lessons[14];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	const serverModuleCode = `// src/lib/server/database.ts
// This file can ONLY be imported by server-side code (e.g. +page.server.ts)
export const db = createDatabaseConnection({
    secret: process.env.DB_PASSWORD
});`;

	const privateEnvCode = `// src/routes/+page.server.ts
import { API_KEY } from '$env/static/private';
// If a client-side component tries to import API_KEY, SvelteKit will throw a build error!

export function load() {
    return { data: fetchSomething(API_KEY) };
}`;
</script>

<svelte:head>
	<title>Lesson 15 — Server-Only Modules</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Prevents sensitive code or secrets from accidentally leaking into the client bundle."
	whatFails="Without server-only guardrails, developers can inadvertently import database logic or API keys into client components, exposing them to attackers."
>
	<h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
		<LessonIcon name="ShieldAlert" size={20} class="text-(--color-accent)" />
		Guarding Secrets
	</h3>
	<div class="grid grid-cols-1 gap-4 mb-12">
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
			<div class="flex items-center gap-3">
				<LessonIcon name="Lock" size={18} class="text-(--color-accent)" />
				<span class="text-sm font-bold text-white">The .server Suffix</span>
			</div>
			<p class="text-xs text-white/50 leading-relaxed italic">
				Any file containing <code class="text-white/70">.server</code> in its name (e.g. <code class="text-white/70">secrets.server.ts</code>) is strictly stripped from the client bundle.
			</p>
		</div>
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
			<div class="flex items-center gap-3">
				<LessonIcon name="FolderTree" size={18} class="text-(--color-accent)" />
				<span class="text-sm font-bold text-white">src/lib/server</span>
			</div>
			<p class="text-xs text-white/50 leading-relaxed italic">
				The entire <code class="text-white/70">src/lib/server</code> directory is a protected zone. SvelteKit will throw a build error if any client-side code tries to import from here.
			</p>
		</div>
		<div class="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
			<div class="flex items-center gap-3">
				<LessonIcon name="Settings" size={18} class="text-(--color-accent)" />
				<span class="text-sm font-bold text-white">Private Environment Variables</span>
			</div>
			<p class="text-xs text-white/50 leading-relaxed italic">
				Modules like <code class="text-white/70">$env/static/private</code> enforce that sensitive environment variables NEVER reach the browser.
			</p>
		</div>
	</div>

	<div class="h-px bg-white/10 my-12"></div>

	<h3 class="text-lg font-bold mb-6 uppercase tracking-widest text-white/30">Examples</h3>
	<CodeBlock code={serverModuleCode} lang="typescript" filename="src/lib/server/database.ts" />
	<div class="h-4"></div>
	<CodeBlock code={privateEnvCode} lang="typescript" filename="src/routes/+page.server.ts" />
</LessonLayout>
