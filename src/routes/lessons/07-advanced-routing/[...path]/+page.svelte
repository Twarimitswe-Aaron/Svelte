<!--
  Catch-all route for Lesson 07 demo: [...path]
  Matches any sub-URL under /lessons/07-advanced-routing/
-->
<script lang="ts">
	interface PageData {
		path: string;
		segments: string[];
	}
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Rest Params Demo: /{data.path} · SvelteKit Course</title>
</svelte:head>

<div class="rest-page">
	<a href="/lessons/07-advanced-routing" class="back-link">← Back to Advanced Routing</a>

	<div class="rest-hero">
		<div class="rest-label">You triggered the [...path] catch-all route</div>
		<div class="rest-path">/lessons/07-advanced-routing/<span class="path-highlight">{data.path}</span></div>
	</div>

	<div class="segments-box">
		<h3>Path segments (array)</h3>
		<div class="segments">
			{#each data.segments as seg, i}
				<div class="segment">
					<span class="seg-index">[{i}]</span>
					<code class="seg-val">{seg}</code>
				</div>
			{:else}
				<div class="no-segments">No segments captured (empty path)</div>
			{/each}
		</div>
	</div>

	<div class="explanation">
		<p>
			The folder <code>[...path]</code> captures <strong>zero or more</strong> URL segments. Try
			changing the URL path and see how the segments array updates.
		</p>
	</div>

	<a href="/lessons/07-advanced-routing" class="btn btn-secondary">← Return to lesson</a>
</div>

<style>
	.rest-page {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.back-link {
		font-size: 0.825rem;
		color: var(--color-text-muted);
		display: inline-block;
		margin-bottom: 1.5rem;
	}

	.rest-hero {
		background: linear-gradient(135deg, rgba(188,140,255,0.1), rgba(88,166,255,0.1));
		border: 1px solid rgba(188,140,255,0.3);
		border-radius: 12px;
		padding: 1.5rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.rest-label {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	.rest-path {
		font-family: monospace;
		font-size: clamp(0.85rem, 2.5vw, 1.1rem);
		word-break: break-all;
		color: var(--color-text);
	}

	.path-highlight {
		color: var(--color-accent-2);
		font-weight: 700;
		background: rgba(188, 140, 255, 0.12);
		padding: 0.1em 0.3em;
		border-radius: 4px;
	}

	.segments-box {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 1rem;
		margin-bottom: 1.25rem;
	}

	.segments-box h3 {
		font-size: 0.85rem;
		font-weight: 700;
		margin: 0 0 0.75rem;
	}

	.segments {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.segment {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 6px;
	}

	.seg-index {
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-family: monospace;
		min-width: 2em;
	}

	.seg-val {
		color: var(--color-accent-2);
		font-size: 0.875rem;
	}

	.no-segments {
		font-size: 0.825rem;
		color: var(--color-text-muted);
		font-style: italic;
	}

	.explanation {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		line-height: 1.65;
		margin-bottom: 1.5rem;
	}

	.btn { text-decoration: none; }
</style>
