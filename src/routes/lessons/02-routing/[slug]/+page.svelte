<!--
  Dynamic route page: /lessons/02-routing/[slug]
  
  This shows how [slug] captures anything from the URL.
  Try visiting /lessons/02-routing/your-text-here
-->
<script lang="ts">
	import { resolve } from '$app/paths';

	// data.slug comes from the load() function in +page.ts
	// Without +page.ts, this would be undefined.
	let { data } = $props();

</script>

<svelte:head>
	<title>/{data.slug} — Dynamic Route Demo · SvelteKit Course</title>
</svelte:head>

<div class="dynamic-page">
	<a href={resolve("/lessons/02-routing" as unknown as "/")} class="back-link">← Back to Routing lesson</a>

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

	<a href={resolve("/lessons/02-routing" as unknown as "/")} class="btn btn-secondary back-btn"
		>← Return to Routing lesson</a
	>
</div>

