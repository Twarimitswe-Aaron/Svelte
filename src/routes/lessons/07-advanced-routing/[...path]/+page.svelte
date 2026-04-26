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

