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
<div class="w-full mx-auto p-8">
	<a href={resolve("/lessons/03-routing")} class="inline-flex items-center gap-2 text-sm font-medium text-(--color-accent) hover:underline mb-8">
		<LessonIcon name="ArrowLeft" size={16} />
		Back to Routing lesson
	</a>

	<div class="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8 overflow-hidden relative">
		<div class="absolute -top-12 -right-12 w-48 h-48 bg-(--color-accent)/10 rounded-full blur-3xl"></div>
		
		<div class="relative z-10">
			<span class="text-[0.7rem] font-bold uppercase tracking-widest text-(--color-accent) mb-2 block">Success</span>
			<h2 class="text-3xl font-bold text-white mb-2">Dynamic Route Captured!</h2>
			<div class="flex items-center gap-2 text-xl font-mono text-white/70">
				<span>/lessons/03-routing/</span>
				<span class="px-2 py-0.5 rounded-lg bg-(--color-accent)/20 text-(--color-accent) border border-(--color-accent)/30">{data.slug}</span>
			</div>
		</div>
	</div>

	<div class="space-y-8">
		<section>
			<h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
				<LessonIcon name="Zap" size={18} class="text-(--color-success)" />
				How this works
			</h3>
			<div class="space-y-4">
				<div class="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/2">
					<div class="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">1</div>
					<p class="text-sm text-white/60 leading-relaxed">
						The folder <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">[slug]</code> in your project structure acts as a wildcard that matches any URL segment.
					</p>
				</div>
				<div class="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/2">
					<div class="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">2</div>
					<p class="text-sm text-white/60 leading-relaxed">
						SvelteKit calls the <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">load()</code> function in <code class="text-white">+page.ts</code>, passing the captured slug through the <code class="text-white">params</code> object.
					</p>
				</div>
				<div class="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/2">
					<div class="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">3</div>
					<p class="text-sm text-white/60 leading-relaxed">
						The data returned from <code class="text-white">load()</code> is then available to the <code class="text-white">+page.svelte</code> component via the <code class="text-white">$props()</code>.
					</p>
				</div>
			</div>
		</section>

		<section class="rounded-2xl border border-white/10 bg-black/40 p-6">
			<h3 class="text-sm font-bold uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
				<LessonIcon name="Info" size={14} />
				Route Metadata
			</h3>
			<div class="grid gap-4">
				<div class="flex items-center justify-between py-2 border-b border-white/5">
					<span class="text-xs text-white/40">Route Pattern</span>
					<code class="text-xs text-(--color-accent) font-mono">/lessons/03-routing/[slug]</code>
				</div>
				<div class="flex items-center justify-between py-2 border-b border-white/5">
					<span class="text-xs text-white/40">Captured Value</span>
					<code class="text-xs text-(--color-success) font-mono font-bold">{data.slug}</code>
				</div>
				<div class="flex items-center justify-between py-2">
					<span class="text-xs text-white/40">File Location</span>
					<code class="text-xs text-white/60 font-mono text-right">src/routes/lessons/03-routing/[slug]/+page.svelte</code>
				</div>
			</div>
		</section>

		<div class="flex items-center gap-4 p-4 rounded-xl border border-(--color-accent)/20 bg-(--color-accent)/5">
			<LessonIcon name="Zap" size={18} class="text-(--color-accent) shrink-0" />
			<p class="text-sm text-(--color-text-muted)">
				<strong>Pro Tip:</strong> Try changing the URL slug! Type anything after <code class="text-white">/lessons/03-routing/</code> in your browser's address bar.
			</p>
		</div>

		<a href={resolve("/lessons/03-routing")} class="flex items-center justify-center gap-2 w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all no-underline">
			<LessonIcon name="ArrowLeft" size={18} />
			Return to Routing lesson
		</a>
	</div>
</div>

