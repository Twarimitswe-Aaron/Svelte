<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	const lesson = lessons[13];
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
	<title>Lesson 14 — Server-Only Modules</title>
</svelte:head>

<LessonLayout
	{lesson} {prev} {next}
	whatItDoes="Prevents sensitive code or secrets from accidentally leaking into the client bundle."
	whatFails="Without server-only guardrails, developers can inadvertently import database logic or API keys into client components, exposing them to attackers."
>
	<h3 class="sub-heading">Guarding Secrets</h3>
	<ul style="color: var(--color-text-muted); font-size: 0.9rem; margin-left:1.5rem; line-height: 1.5;">
		<li>Any file containing <code>.server</code> in its name (e.g. <code>+page.server.ts</code>, <code>secrets.server.ts</code>) is stripped from the client.</li>
		<li>The <code>src/lib/server</code> directory is strictly for server-side code. Imports from here into client components result in errors.</li>
		<li><code>$env/static/private</code> and <code>$env/dynamic/private</code> enforce that environment variables aren't exposed in the browser.</li>
	</ul>

	<div class="separator"></div>

	<h3 class="sub-heading">Examples</h3>
	<CodeBlock code={serverModuleCode} lang="typescript" filename="src/lib/server/database.ts" />
	<br>
	<CodeBlock code={privateEnvCode} lang="typescript" filename="src/routes/+page.server.ts" />
</LessonLayout>
