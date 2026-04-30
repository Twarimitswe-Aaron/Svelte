<!--
  Global +error.svelte — shown when an error occurs anywhere in the app
  
  WHY: Without this, SvelteKit shows its default plain-text error page.
       This gives you full control over the error UI.
  WHAT FAILS WITHOUT IT: Users see an unstyled, unbranded error page.
  
  SCOPE: This root version catches errors from ALL routes.
         Put +error.svelte inside a subfolder to scope it to that route.
-->
<script lang="ts">
	import { page } from '$app/stores';
	import {  resolve } from '$app/paths';
	import type { ComponentType, SvelteComponent } from 'svelte';
	import type { IconProps } from 'lucide-svelte';

	import {
		Search,
		Lock,
		Bomb,
		FileWarning,
		AlertTriangle,
		Home,
		ArrowLeft,
		CheckCircle,
		Lightbulb
	} from 'lucide-svelte';

	// $page.status is the HTTP status code (404, 500, etc.)
	// $page.error is the error object returned from handleError() or error()
	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'An unknown error occurred');

	const statusInfo: Record<number, { icon: ComponentType<SvelteComponent<IconProps>>; title: string }> = {
		404: { icon: Search, title: 'Page Not Found' },
		403: { icon: Lock, title: 'Access Denied' },
		500: { icon: Bomb, title: 'Internal Server Error' },
		422: { icon: FileWarning, title: 'Validation Error' }
	};

	const info = $derived(statusInfo[status] ?? { icon: AlertTriangle, title: 'Something went wrong' });
</script>

<svelte:head>
	<title>{status} — {info.title} · SvelteKit Course</title>
</svelte:head>

<div class="error-page">
	<div class="error-card animate-fade-in">
		<div class="error-icon">
			<info.icon size={64} strokeWidth={1.5} />
		</div>
		<div class="error-status">{status}</div>
		<h1 class="error-title">{info.title}</h1>
		<p class="error-message">{message}</p>

		<div class="error-meta">
			<div class="meta-item">
				<span class="meta-key">Type</span>
				<span class="meta-val">{status < 500 ? 'Expected (HttpError)' : 'Unexpected error'}</span>
			</div>
			<div class="meta-item">
				<span class="meta-key">handleError called</span>
				<span class="meta-val">
					{#if status >= 500}
						Yes <span class="inline-icon success-text"><CheckCircle size={14} /></span>
					{:else}
						No (expected error)
					{/if}
				</span>
			</div>
		</div>

		<div class="error-actions">
			<a href={resolve('/')} class="btn btn-primary">
				<Home size={18} /> Go Home
			</a>
			<a href={resolve('/lessons/10-errors')} class="btn btn-secondary">
				<ArrowLeft size={18} /> Back to Error lesson
			</a>
		</div>

		<div class="error-tip">
			<span class="inline-icon tip-icon"><Lightbulb size={16} /></span> This page is rendered by
			<code>src/routes/+error.svelte</code> — you can customise it completely. Place a
			<code>+error.svelte</code> in a subfolder to scope it to just that section.
		</div>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
	}

	.error-card {
		max-width: 520px;
		width: 100%;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 16px;
		padding: 2rem;
		text-align: center;
	}

	.error-icon {
		display: flex;
		justify-content: center;
		color: var(--color-danger);
		margin-bottom: 1.5rem;
	}

	.error-status {
		font-size: 4rem;
		font-weight: 900;
		background: linear-gradient(135deg, var(--color-danger), var(--color-warning));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1;
		margin-bottom: 0.5rem;
	}

	.error-title {
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
	}

	.error-message {
		font-size: 0.9rem;
		color: var(--color-text-muted);
		margin: 0 0 1.5rem;
		line-height: 1.6;
	}

	.error-meta {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.75rem 1rem;
		margin-bottom: 1.5rem;
		text-align: left;
	}

	.meta-item {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		gap: 1rem;
	}

	.meta-key { color: var(--color-text-muted); }
	.meta-val { color: var(--color-text); font-weight: 600; }

	.error-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.error-actions a { text-decoration: none; }

	.error-tip {
		font-size: 0.78rem;
		color: var(--color-text-muted);
		background: rgba(88, 166, 255, 0.06);
		border: 1px solid rgba(88, 166, 255, 0.2);
		border-radius: 8px;
		padding: 0.7rem 0.9rem;
		line-height: 1.6;
		text-align: left;
		display: flex;
		gap: 0.5rem;
	}

	.inline-icon {
		display: inline-flex;
		align-items: center;
		flex-shrink: 0;
	}

	.tip-icon {
		color: var(--color-warning);
	}

	.success-text {
		color: #238636;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
