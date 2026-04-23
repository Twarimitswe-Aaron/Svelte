<!--
  Lesson 04 — Form Actions
  
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

	const lesson = lessons[3];
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
	
	let isLiveValid = $derived(
		liveName.length >= 3 && liveEmail.includes('@')
	);
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
    // ⚠️ Without returning from action, form.success is undefined
  }
};`;

	const formCode = `<!-- +page.svelte — use:enhance for no-reload submission -->
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props(); // action result lives here
<\/script>

<!-- use:enhance: intercepts submit, uses fetch instead of full POST reload -->
<!-- Without use:enhance: the page does a full browser reload on submit     -->
<form method="POST" use:enhance>
  <input name="name" value={form?.name ?? ''} />
  {#if form?.error}<p class="error">{form.error}</p>{/if}
  <button type="submit">Submit</button>
</form>`;
</script>

<svelte:head>
	<title>Lesson 04 — Form Actions · SvelteKit Course</title>
</svelte:head>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Form actions in +page.server.ts handle HTML form POST requests. They run server-side, can access the database, validate input with fail(), redirect, or return success data. use:enhance upgrades forms to fetch-based submission without a full page reload."
	whatFails="Without +page.server.ts actions: submitting returns 405. Without fail(): no validation errors shown. Without use:enhance: every submit causes a full browser reload. Without method='POST': the action never fires."
>
	<!-- Live form demo -->
	<div class="form-demo">
		<h3 class="sub-heading">✉️ Live Contact Form</h3>

		{#if form?.success}
			<div class="success-banner animate-fade-in">
				✅ Message sent by <strong>{form.name}</strong>!
				<span class="success-sub">Page did NOT reload — that's use:enhance at work.</span>
			</div>
		{/if}

		<!--
      use:enhance — CRITICAL for SPA-like behaviour
      Without it: every submit does a full browser navigation (page reload).
      With it: Svelte intercepts submit, uses fetch, updates form state reactively.
    -->
		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
			class="contact-form"
		>
			<div class="field">
				<label for="name">Name *</label>
				<input
					id="name"
					name="name"
					type="text"
					placeholder="Your name"
					value={form?.name ?? ''}
					class:invalid={form?.field === 'name'}
				/>
				{#if form?.field === 'name'}
					<span class="field-error">⚠️ {form.error}</span>
				{/if}
			</div>

			<div class="field">
				<label for="message">Message *</label>
				<textarea
					id="message"
					name="message"
					placeholder="Write something... (min 5 chars)"
					rows="3"
					class:invalid={form?.field === 'message'}>{form?.message ?? ''}</textarea
				>
				{#if form?.field === 'message'}
					<span class="field-error">⚠️ {form.error}</span>
				{/if}
			</div>

			<div class="form-actions">
				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{#if submitting}
						<span class="spinner-sm"></span> Sending…
					{:else}
						📨 Send (with use:enhance)
					{/if}
				</button>
				<span class="enhance-note">No page reload!</span>
			</div>
		</form>

		<!-- Test without enhance -->
		<form method="POST" class="contact-form plain-form">
			<input name="name" type="text" value="Test" hidden />
			<input name="message" type="text" value="Testing without enhance" hidden />
			<button type="submit" class="btn btn-secondary">
				⚠️ Submit WITHOUT use:enhance (triggers reload)
			</button>
		</form>

		<div class="separator"></div>

		<!-- Client-side real-time validation demo -->
		<h3 class="sub-heading">⚡ Client-Side Real-Time Validation</h3>
		<p class="demo-text">
			This form uses Svelte 5 <code>$state</code> and <code>$derived</code> to validate as you type. 
			SvelteKit doesn't have a built-in client validation rule engine, so Svelte reactivity is the standard way to do it.
		</p>
		
		{#if liveSubmitted}
			<div class="success-banner animate-fade-in" style="background: rgba(88,166,255,0.1); color: var(--color-accent); border-color: var(--color-accent);">
				✅ Everything is valid! You can now submit this to the server.
			</div>
		{/if}

		<div class="contact-form">
			<div class="field">
				<label for="live-name">Name (min 3 chars)</label>
				<!-- Using bind:value gives us the variable instantly on every keystroke -->
				<input
					id="live-name"
					type="text"
					placeholder="Type your name..."
					bind:value={liveName}
					class:invalid={nameError !== null}
					oninput={() => liveSubmitted = false}
				/>
				{#if nameError}
					<span class="field-error animate-fade-in">⚠️ {nameError}</span>
				{/if}
			</div>

			<div class="field">
				<label for="live-email">Email (must contain @)</label>
				<input
					id="live-email"
					type="email"
					placeholder="Type your email..."
					bind:value={liveEmail}
					class:invalid={emailError !== null}
					oninput={() => liveSubmitted = false}
				/>
				{#if emailError}
					<span class="field-error animate-fade-in">⚠️ {emailError}</span>
				{/if}
			</div>

			<div class="form-actions">
				<button 
					type="button" 
					class="btn btn-primary" 
					disabled={!isLiveValid}
					onclick={() => liveSubmitted = true}
				>
					{isLiveValid ? 'Ready to Submit' : 'Fix errors to submit'}
				</button>
			</div>
		</div>

		<!-- Messages list -->
		{#if data.messages.length > 0}
			<div class="messages-list">
				<h4>📮 Received Messages ({data.messages.length})</h4>
				{#each data.messages as msg}
					<div class="message-item">
						<div class="message-author">{msg.name} <span>{msg.time}</span></div>
						<p class="message-text">{msg.message}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="separator"></div>

	<h3 class="sub-heading">Code</h3>
	<CodeBlock code={actionCode} lang="typescript" filename="+page.server.ts" />
	<CodeBlock code={formCode} lang="svelte" filename="+page.svelte" />

	<!-- Actions cheatsheet -->
	<div class="actions-grid">
		<div class="action-card">
			<div class="action-type">Default</div>
			<code>&lt;form method="POST"&gt;</code>
			<p>One action per page. Simple forms.</p>
		</div>
		<div class="action-card">
			<div class="action-type">Named</div>
			<code>&lt;form action="?/login"&gt;</code>
			<p>Multiple actions on one page (login + register).</p>
		</div>
		<div class="action-card">
			<div class="action-type">fail()</div>
			<code>return fail(422, &#123; error &#125;)</code>
			<p>Returns validation errors to the form without redirect.</p>
		</div>
		<div class="action-card">
			<div class="action-type">redirect()</div>
			<code>throw redirect(303, '/dashboard')</code>
			<p>After success, send user to another page.</p>
		</div>
	</div>
</LessonLayout>

<style>
	.sub-heading { font-size: 0.95rem; font-weight: 700; margin: 0 0 1rem; }
	.separator { height: 1px; background: var(--color-border); margin: 1.5rem 0; }

	.success-banner {
		background: rgba(63,185,80,0.1);
		border: 1px solid rgba(63,185,80,0.4);
		border-radius: 8px;
		padding: 0.75rem 1rem;
		color: var(--color-success);
		font-size: 0.875rem;
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.success-sub { font-size: 0.75rem; color: var(--color-text-muted); }

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.plain-form { margin-top: 0.5rem; }

	.field { display: flex; flex-direction: column; gap: 0.35rem; }

	label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	input, textarea {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		color: var(--color-text);
		font-family: inherit;
		font-size: 0.875rem;
		outline: none;
		transition: border-color 0.15s;
	}
	input:focus, textarea:focus { border-color: var(--color-accent); }
	input.invalid, textarea.invalid { border-color: var(--color-danger); }

	textarea { resize: vertical; }

	.field-error {
		font-size: 0.78rem;
		color: var(--color-danger);
	}

	.form-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.enhance-note {
		font-size: 0.75rem;
		color: var(--color-success);
	}

	.spinner-sm {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255,255,255,0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	button:disabled { opacity: 0.6; cursor: not-allowed; }

	.messages-list {
		margin-top: 1.25rem;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		overflow: hidden;
	}

	.messages-list h4 {
		font-size: 0.8rem;
		font-weight: 700;
		margin: 0;
		padding: 0.6rem 1rem;
		background: var(--color-surface-2);
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-muted);
	}

	.message-item {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
	}
	.message-item:last-child { border-bottom: none; }

	.message-author {
		font-size: 0.8rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}
	.message-author span { font-weight: 400; color: var(--color-text-muted); margin-left: 0.5rem; }

	.message-text {
		font-size: 0.825rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.75rem;
		margin-top: 1rem;
	}

	.action-card {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 1rem;
	}

	.action-type {
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		margin-bottom: 0.4rem;
	}

	.action-card code {
		display: block;
		font-size: 0.75rem;
		margin-bottom: 0.5rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.action-card p {
		font-size: 0.78rem;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.55;
	}
</style>
