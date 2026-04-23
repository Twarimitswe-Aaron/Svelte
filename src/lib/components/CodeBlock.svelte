<!--
  CodeBlock.svelte — Displays a code snippet in a styled pre/code block
                     with a copy-to-clipboard button.

  WHY: Every lesson shows code. Centralising the UI avoids repeating <pre><code>
       wrappers with inconsistent styles. The copy button is a critical UX feature.
  WHAT FAILS WITHOUT IT: Learners can't easily copy examples; code is unstyled.
-->
<script lang="ts">
	interface Props {
		code: string;
		lang?: string;
		filename?: string;
	}
	let { code, lang = 'svelte', filename = '' }: Props = $props();

	let copied = $state(false);

	async function copyCode() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="code-block">
	<div class="code-header">
		<div class="code-meta">
			{#if filename}
				<span class="filename">{filename}</span>
			{/if}
			<span class="lang-badge">{lang}</span>
		</div>
		<button
			class="copy-btn"
			onclick={copyCode}
			title="Copy code"
			aria-label="Copy code to clipboard"
		>
			{#if copied}
				✅ Copied!
			{:else}
				📋 Copy
			{/if}
		</button>
	</div>
	<pre><code>{code}</code></pre>
</div>

<style>
	.code-block {
		background: #0d1117;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		overflow: hidden;
		margin: 1rem 0;
	}

	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1rem;
		background: var(--color-surface-2);
		border-bottom: 1px solid var(--color-border);
	}

	.code-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filename {
		font-size: 0.8rem;
		font-family: 'JetBrains Mono', monospace;
		color: var(--color-text-muted);
	}

	.lang-badge {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent-2);
		background: rgba(188, 140, 255, 0.1);
		border: 1px solid rgba(188, 140, 255, 0.25);
		padding: 0.1rem 0.45rem;
		border-radius: 4px;
	}

	.copy-btn {
		background: none;
		border: 1px solid var(--color-border);
		border-radius: 6px;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		padding: 0.25rem 0.6rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.copy-btn:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
		background: rgba(88, 166, 255, 0.08);
	}

	pre {
		margin: 0;
		padding: 1.25rem 1.5rem;
		overflow-x: auto;
		font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
		font-size: 0.85rem;
		line-height: 1.7;
		color: #e6edf3;
		tab-size: 2;
	}

	code {
		background: none;
		border: none;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		white-space: pre;
	}
</style>
