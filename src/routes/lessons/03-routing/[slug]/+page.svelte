<!--
  Dynamic route page: /lessons/03-routing/[slug]
  
  This shows how [slug] captures anything from the URL.
  Try visiting /lessons/03-routing/your-text-here
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import LessonIcon from '$lib/components/LessonIcon.svelte';

	// data.slug comes from the load() function in +page.ts
	// Without +page.ts, this would be undefined.
	let { data } = $props();
</script>

<svelte:head>
	<title>/{data.slug} — Dynamic Route Demo · SvelteKit Course</title>
</svelte:head>
<div class="p-8 mx-auto w-full">
	<a
		href={resolve('/lessons/03-routing')}
		class="gap-2 text-sm font-medium mb-8 inline-flex items-center text-(--color-accent) hover:underline"
	>
		<LessonIcon name="ArrowLeft" size={16} />
		Back to Routing lesson
	</a>

	<div
		class="rounded-xl border-white/10 bg-white/5 glass-blur p-8 mb-8 relative overflow-hidden border"
	>
		<div
			class="-top-12 -right-12 w-48 h-48 blur-3xl absolute rounded-full bg-(--color-accent)/10"
		></div>

		<div class="relative z-10">
			<span
				class="font-bold tracking-widest mb-2 block text-[0.7rem] text-(--color-accent) uppercase"
				>Success</span
			>
			<h2 class="text-3xl font-bold text-white mb-2">Dynamic Route Captured!</h2>
			<div class="gap-2 text-xl font-mono text-white/70 flex items-center">
				<span>/lessons/03-routing/</span>
				<span
					class="px-2 py-0.5 rounded-lg border border-(--color-accent)/30 bg-(--color-accent)/20 text-(--color-accent)"
					>{data.slug}</span
				>
			</div>
		</div>
	</div>

	<div class="space-y-8">
		<section>
			<h3 class="text-lg font-bold text-white mb-4 gap-2 flex items-center">
				<LessonIcon name="Zap" size={18} class="text-(--color-success)" />
				How this works
			</h3>
			<div class="space-y-4">
				<div class="gap-4 p-4 rounded-xl border-white/5 bg-white/2 glass-blur flex border">
					<div
						class="w-6 h-6 bg-white/10 text-xs font-bold text-white flex shrink-0 items-center justify-center rounded-full"
					>
						1
					</div>
					<p class="text-sm text-white/60 leading-relaxed">
						The folder <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
							>[slug]</code
						> in your project structure acts as a wildcard that matches any URL segment.
					</p>
				</div>
				<div class="gap-4 p-4 rounded-xl border-white/5 bg-white/2 glass-blur flex border">
					<div
						class="w-6 h-6 bg-white/10 text-xs font-bold text-white flex shrink-0 items-center justify-center rounded-full"
					>
						2
					</div>
					<p class="text-sm text-white/60 leading-relaxed">
						SvelteKit calls the <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
							>load()</code
						>
						function in <code class="text-white">+page.ts</code>, passing the captured slug through
						the <code class="text-white">params</code> object.
					</p>
				</div>
				<div class="gap-4 p-4 rounded-xl border-white/5 bg-white/2 glass-blur flex border">
					<div
						class="w-6 h-6 bg-white/10 text-xs font-bold text-white flex shrink-0 items-center justify-center rounded-full"
					>
						3
					</div>
					<p class="text-sm text-white/60 leading-relaxed">
						The data returned from <code class="text-white">load()</code> is then available to the
						<code class="text-white">+page.svelte</code>
						component via the <code class="text-white">$props()</code>.
					</p>
				</div>
			</div>
		</section>

		<section class="rounded-xl border-white/10 bg-black/40 p-6 glass-blur border">
			<h3
				class="text-sm font-bold tracking-widest text-white/30 mb-6 gap-2 flex items-center uppercase"
			>
				<LessonIcon name="Info" size={14} />
				Route Metadata
			</h3>
			<div class="gap-4 grid">
				<div class="py-2 border-white/5 flex items-center justify-between border-b">
					<span class="text-xs text-white/40">Route Pattern</span>
					<code class="text-xs font-mono text-(--color-accent)">/lessons/03-routing/[slug]</code>
				</div>
				<div class="py-2 border-white/5 flex items-center justify-between border-b">
					<span class="text-xs text-white/40">Captured Value</span>
					<code class="text-xs font-mono font-bold text-(--color-success)">{data.slug}</code>
				</div>
				<div class="py-2 flex items-center justify-between">
					<span class="text-xs text-white/40">File Location</span>
					<code class="text-xs text-white/60 font-mono text-right"
						>src/routes/lessons/03-routing/[slug]/+page.svelte</code
					>
				</div>
			</div>
		</section>

		<div
			class="gap-4 p-4 rounded-xl glass-blur flex items-center border border-(--color-accent)/20 bg-(--color-accent)/5"
		>
			<LessonIcon name="Zap" size={18} class="shrink-0 text-(--color-accent)" />
			<p class="text-sm text-(--color-text-muted)">
				<strong>Pro Tip:</strong> Try changing the URL slug! Type anything after
				<code class="text-white">/lessons/03-routing/</code> in your browser's address bar.
			</p>
		</div>

		<a
			href={resolve('/lessons/03-routing')}
			class="gap-2 p-4 rounded-xl bg-white/5 border-white/10 text-white font-bold hover:bg-white/10 glass-blur flex w-full items-center justify-center border no-underline transition-all"
		>
			<LessonIcon name="ArrowLeft" size={18} />
			Return to Routing lesson
		</a>
	</div>
</div>
