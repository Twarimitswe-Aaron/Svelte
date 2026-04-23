<!--
  Dynamic route page: /lessons/02-routing/[slug]
  
  This shows how [slug] captures anything from the URL.
  Try visiting /lessons/02-routing/your-text-here
-->
<script lang="ts">
	import { lessons, getAdjacentLessons } from '$lib/lessons.js';

	// data.slug comes from the load() function in +page.ts
	// Without +page.ts, this would be undefined.
	let { data } = $props();

	const lesson = lessons[1];
	const { prev, next } = getAdjacentLessons(lesson.slug);
</script>

<svelte:head>
	<title>/{data.slug} — Dynamic Route Demo · SvelteKit Course</title>
</svelte:head>

<div class="dynamic-page">
	<a href="/lessons/02-routing" class="back-link">← Back to Routing lesson</a>

	<div class="slug-hero">
		<div class="slug-label">You navigated to</div>
		<div class="slug-url">/lessons/02-routing/<span class="slug-highlight">{data.slug}</span></div>
	</div>

	<div class="explanation">
		<h2>How this works</h2>
		<ol class="steps">
			<li>
				The folder <code>[slug]</code> in src/routes matches <em>any</em> URL segment.
			</li>
			<li>
				<code>+page.ts</code> exports a <code>load(&#123; params &#125;)</code> function that returns
				<code>&#123; slug: params.slug &#125;</code>.
			</li>
			<li>
				<code>+page.svelte</code> receives <code>data.slug</code> from <code>$props()</code>.
			</li>
		</ol>

		<div class="meta-box">
			<div class="meta-row">
				<span class="meta-key">Route pattern</span>
				<code class="meta-val">/lessons/02-routing/[slug]</code>
			</div>
			<div class="meta-row">
				<span class="meta-key">Captured value</span>
				<code class="meta-val slug-val">{data.slug}</code>
			</div>
			<div class="meta-row">
				<span class="meta-key">File location</span>
				<code class="meta-val">src/routes/lessons/02-routing/[slug]/+page.svelte</code>
			</div>
		</div>

		<p class="tip">
			⚡ Try changing the URL slug — type anything after <code>/lessons/02-routing/</code>!
		</p>
	</div>

	<a href="/lessons/02-routing" class="btn btn-secondary back-btn">← Return to Routing lesson</a>
</div>

<style>
	.dynamic-page {
		max-width: 700px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.back-link {
		font-size: 0.825rem;
		color: var(--color-text-muted);
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-bottom: 2rem;
	}

	.slug-hero {
		background: linear-gradient(135deg, rgba(88,166,255,0.1), rgba(188,140,255,0.1));
		border: 1px solid rgba(88,166,255,0.3);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		margin-bottom: 2rem;
	}

	.slug-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	.slug-url {
		font-family: monospace;
		font-size: clamp(1rem, 3vw, 1.4rem);
		color: var(--color-text);
		word-break: break-all;
	}

	.slug-highlight {
		color: var(--color-accent);
		font-weight: 700;
		background: rgba(88,166,255,0.12);
		padding: 0.1em 0.3em;
		border-radius: 4px;
	}

	.explanation h2 {
		font-size: 1rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.steps {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		line-height: 1.8;
		padding-left: 1.4rem;
		margin: 0 0 1.25rem;
	}

	.meta-box {
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 1.25rem;
	}

	.meta-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid var(--color-border);
		font-size: 0.825rem;
	}
	.meta-row:last-child { border-bottom: none; }

	.meta-key {
		width: 130px;
		flex-shrink: 0;
		color: var(--color-text-muted);
		font-size: 0.75rem;
	}

	.meta-val { font-size: 0.8rem; color: var(--color-accent); }
	.slug-val { color: var(--color-accent-2); font-weight: 700; }

	.tip {
		font-size: 0.825rem;
		color: var(--color-text-muted);
		background: rgba(210,153,34,0.1);
		border: 1px solid rgba(210,153,34,0.3);
		border-radius: 8px;
		padding: 0.75rem 1rem;
		margin: 0 0 1.5rem;
	}

	.back-btn { text-decoration: none; }
</style>
