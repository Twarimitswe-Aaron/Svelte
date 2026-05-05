<!--
  Lesson 05 — Form Actions
  
  CONCEPTS SHOWN:
  1. Default form action (POST to same URL)
  2. form.data for pre-filling after validation errors
  3. use:enhance — progressive enhancement (no full page reload)
  4. Showing validation error messages from fail()
  5. Success feedback from the returned action data
-->
<script lang="ts">
	import { enhance } from '$app/forms';
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';
	import { CircleCheck, Loader2, Play, ShieldAlert, Zap, TriangleAlert } from 'lucide-svelte';

	const lesson = lessons[4];
	const { prev, next } = getAdjacentLessons(lesson.slug);

	// form = the result from the last action (success data OR fail() error data)
	// data = result from load() function (messages list)
	let { data, form } = $props();

	// Track whether we're submitting (use:enhance provides this)
	let submitting = $state(false);

	// Client-side real-time validation state
	let liveName = $state('');
	let liveEmail = $state('');

	let nameError = $derived(
		liveName.length > 0 && liveName.length < 3 ? 'Name must be at least 3 characters' : null
	);
	let emailError = $derived(
		liveEmail.length > 0 && !liveEmail.includes('@') ? 'Invalid email format' : null
	);

	let isLiveValid = $derived(liveName.length >= 3 && liveEmail.includes('@'));
	let liveSubmitted = $state(false);

	const actionCode = `// +page.server.ts — Define actions
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  // Default action: handles <form method="POST"> with no action= attribute
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';

    // fail() returns 422 + error data to the page
    // Without fail(), form just reloads with no error message
    if (!name) return fail(422, { error: 'Name is required' });

    return { success: true };
    // NOTE: Without returning from action, form.success is undefined
  }
};`;

	const scriptStart = '<' + 'script lang="ts">';
	const scriptEnd = '<' + '/script>';
	const formCode = `<!-- +page.svelte — use:enhance for no-reload submission -->
${scriptStart}
  import { enhance } from '$app/forms';
  let { form } = $props(); // action result lives here
${scriptEnd}

<!-- use:enhance: intercepts submit, uses fetch instead of full POST reload -->
<!-- Without use:enhance: the page does a full browser reload on submit     -->
<form method="POST" use:enhance>
  <input name="name" value={form?.name ?? ''} />
  {#if form?.error}<p class="error">{form.error}</p>{/if}
  <button type="submit">Submit</button>
</form>`;
</script>

<svelte:head>
	<title>Lesson 05 — Form Actions · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Form actions in +page.server.ts handle HTML form POST requests. They run server-side, can access the database, validate input with fail(), redirect, or return success data. use:enhance upgrades forms to fetch-based submission without a full page reload."
	whatFails="Without +page.server.ts actions: submitting returns 405. Without fail(): no validation errors shown. Without use:enhance: every submit causes a full browser reload. Without method='POST': the action never fires."
>
	<!-- Live form demo -->
	<div class="space-y-12">
		<section>
			<h3 class="text-xl font-bold text-white mb-6 gap-2 flex items-center">
				<span class="text-2xl">✉️</span>
				Live Contact Form
			</h3>

			{#if form?.success}
				<div
					class="p-4 rounded-xl bg-green-500/10 border-green-500/20 text-green-400 mb-8 animate-fade-in gap-1 glass-blur flex flex-col border"
				>
					<div class="gap-2 font-bold flex items-center">
						<CircleCheck size={18} />
						Message sent by {form.name}!
					</div>
					<span class="text-xs opacity-70">Page did NOT reload — that's use:enhance at work.</span>
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update();
						submitting = false;
					};
				}}
				class="space-y-6 max-w-xl p-8 rounded-xl border-white/10 bg-white/5 glass-blur relative overflow-hidden border"
			>
				<div
					class="-top-12 -right-12 w-48 h-48 blur-3xl absolute rounded-full bg-(--color-accent)/10"
				></div>

				<div class="space-y-2 relative z-10">
					<label for="name" class="text-xs font-bold tracking-widest text-white/40 uppercase"
						>Name *</label
					>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="Your name"
						value={form?.name ?? ''}
						class="px-4 py-3 rounded-xl bg-white/5 border-white/10 text-white placeholder-white/20 w-full border transition-all outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) {form?.field ===
						'name'
							? 'border-red-500/50 focus:border-red-500'
							: ''}"
					/>
					{#if form?.field === 'name'}
						<span class="text-xs text-red-400 gap-1 font-medium flex items-center"
							><TriangleAlert size={12} /> {form.error}</span
						>
					{/if}
				</div>

				<div class="space-y-2 relative z-10">
					<label for="message" class="text-xs font-bold tracking-widest text-white/40 uppercase"
						>Message *</label
					>
					<textarea
						id="message"
						name="message"
						placeholder="Write something... (min 5 chars)"
						rows="3"
						class="px-4 py-3 rounded-xl bg-white/5 border-white/10 text-white placeholder-white/20 w-full border transition-all outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) {form?.field ===
						'message'
							? 'border-red-500/50 focus:border-red-500'
							: ''}">{form?.message ?? ''}</textarea
					>
					{#if form?.field === 'message'}
						<span class="text-xs text-red-400 gap-1 font-medium flex items-center"
							><TriangleAlert size={12} /> {form.error}</span
						>
					{/if}
				</div>

				<div class="gap-4 pt-2 relative z-10 flex items-center">
					<button
						type="submit"
						class="px-6 py-3 rounded-xl text-white font-bold text-sm gap-2 flex items-center bg-(--color-accent) transition-all hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
						disabled={submitting}
					>
						{#if submitting}
							<Loader2 size={18} class="animate-spin" />
							<span>Sending…</span>
						{:else}
							<Play size={16} />
							<span>Send (with use:enhance)</span>
						{/if}
					</button>
					<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
						>No page reload!</span
					>
				</div>
			</form>

			<!-- Test without enhance -->
			<form method="POST" class="mt-6 gap-4 flex items-center">
				<input name="name" type="text" value="Test" hidden />
				<input name="message" type="text" value="Testing without enhance" hidden />
				<button
					type="submit"
					class="font-bold tracking-widest text-white/30 hover:text-red-400 gap-2 flex items-center text-[11px] uppercase transition-colors"
				>
					<ShieldAlert size={14} />
					Submit WITHOUT use:enhance (triggers reload)
				</button>
			</form>
		</section>

		<div class="my-6 h-px bg-(--color-border)"></div>

		<!-- Client-side real-time validation demo -->
		<section>
			<h3 class="text-xl font-bold text-white mb-4 gap-2 flex items-center">
				<Zap size={22} class="text-(--color-accent)" />
				Client-Side Real-Time Validation
			</h3>
			<p class="text-sm text-white/60 leading-relaxed mb-8">
				This form uses Svelte 5 <code>$state</code> and <code>$derived</code> to validate as you type.
				SvelteKit doesn't have a built-in client validation rule engine, so Svelte reactivity is the standard
				way to do it.
			</p>

			{#if liveSubmitted}
				<div
					class="p-4 rounded-xl mb-8 animate-fade-in font-bold gap-2 glass-blur flex items-center border border-(--color-accent)/20 bg-(--color-accent)/10 text-(--color-accent)"
				>
					<CircleCheck size={20} />
					Everything is valid! You can now submit this to the server.
				</div>
			{/if}

			<div class="space-y-6 max-w-xl p-8 rounded-xl border-white/10 bg-black/40 glass-blur border">
				<div class="space-y-2">
					<label for="live-name" class="text-xs font-bold tracking-widest text-white/40 uppercase"
						>Name (min 3 chars)</label
					>
					<input
						id="live-name"
						type="text"
						placeholder="Type your name..."
						bind:value={liveName}
						oninput={() => (liveSubmitted = false)}
						class="px-4 py-3 rounded-xl bg-white/5 border-white/10 text-white placeholder-white/20 w-full border transition-all outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) {nameError
							? 'border-red-500/50 focus:border-red-500'
							: ''}"
					/>
					{#if nameError}
						<span class="text-xs text-red-400 gap-1 font-medium animate-fade-in flex items-center"
							><TriangleAlert size={12} /> {nameError}</span
						>
					{/if}
				</div>

				<div class="space-y-2">
					<label for="live-email" class="text-xs font-bold tracking-widest text-white/40 uppercase"
						>Email (must contain @)</label
					>
					<input
						id="live-email"
						type="email"
						placeholder="Type your email..."
						bind:value={liveEmail}
						oninput={() => (liveSubmitted = false)}
						class="px-4 py-3 rounded-xl bg-white/5 border-white/10 text-white placeholder-white/20 w-full border transition-all outline-none focus:border-(--color-accent) focus:ring-1 focus:ring-(--color-accent) {emailError
							? 'border-red-500/50 focus:border-red-500'
							: ''}"
					/>
					{#if emailError}
						<span class="text-xs text-red-400 gap-1 font-medium animate-fade-in flex items-center"
							><TriangleAlert size={12} /> {emailError}</span
						>
					{/if}
				</div>

				<div class="pt-2">
					<button
						type="button"
						class="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all disabled:scale-100 disabled:opacity-30 {isLiveValid
							? 'text-white bg-(--color-accent) hover:bg-(--color-accent)/80'
							: ''}"
						disabled={!isLiveValid}
						onclick={() => (liveSubmitted = true)}
					>
						{isLiveValid ? 'Ready to Submit' : 'Fix errors to submit'}
					</button>
				</div>
			</div>
		</section>

		<!-- Messages list -->
		{#if data.messages.length > 0}
			<section class="space-y-6">
				<h4
					class="text-sm font-bold tracking-widest text-white/30 gap-2 flex items-center uppercase"
				>
					<div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
					Received Messages ({data.messages.length})
				</h4>
				<div class="gap-4 grid grid-cols-1">
					{#each data.messages as msg (msg.time)}
						<div
							class="p-6 rounded-xl border-white/5 bg-white/2 hover:bg-white/4 glass-blur border transition-all"
						>
							<div class="mb-4 flex items-center justify-between">
								<div class="gap-2 flex items-center">
									<div
										class="w-8 h-8 font-bold text-xs flex items-center justify-center rounded-full bg-(--color-accent)/10 text-(--color-accent) uppercase"
									>
										{msg.name.charAt(0)}
									</div>
									<span class="text-sm font-bold text-white">{msg.name}</span>
								</div>
								<span class="font-mono text-white/30 text-[10px]">{msg.time}</span>
							</div>
							<p class="text-sm text-white/60 leading-relaxed">{msg.message}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>

	<div class="my-6 h-px bg-(--color-border)"></div>

	<h3 class="mb-3 font-bold text-white text-[0.95rem]">Code</h3>
	<CodeBlock code={actionCode} lang="typescript" filename="+page.server.ts" />
	<CodeBlock code={formCode} lang="svelte" filename="+page.svelte" />

	<!-- Actions cheatsheet -->
	<div class="sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 grid grid-cols-1">
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="font-bold tracking-widest text-[10px] text-(--color-accent) uppercase">
				Default
			</div>
			<code class="px-2 py-1 rounded bg-black/40 text-white/80 font-mono block text-[10px]"
				>&lt;form method="POST"&gt;</code
			>
			<p class="text-xs text-white/50 leading-relaxed">One action per page. Simple forms.</p>
		</div>
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="font-bold tracking-widest text-[10px] text-(--color-accent) uppercase">Named</div>
			<code class="px-2 py-1 rounded bg-black/40 text-white/80 font-mono block text-[10px]"
				>&lt;form action="?/login"&gt;</code
			>
			<p class="text-xs text-white/50 leading-relaxed">
				Multiple actions on one page (login + register).
			</p>
		</div>
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="font-bold tracking-widest text-[10px] text-(--color-accent) uppercase">
				fail()
			</div>
			<code class="px-2 py-1 rounded bg-black/40 text-white/80 font-mono block text-[10px]"
				>return fail(422, &#123; error &#125;)</code
			>
			<p class="text-xs text-white/50 leading-relaxed">
				Returns validation errors to the form without redirect.
			</p>
		</div>
		<div class="p-6 rounded-xl border-white/10 bg-white/5 glass-blur space-y-4 border">
			<div class="font-bold tracking-widest text-[10px] text-(--color-accent) uppercase">
				redirect()
			</div>
			<code class="px-2 py-1 rounded bg-black/40 text-white/80 font-mono block text-[10px]"
				>throw redirect(303, '/...')</code
			>
			<p class="text-xs text-white/50 leading-relaxed">After success, send user to another page.</p>
		</div>
	</div>
</LessonLayout>
