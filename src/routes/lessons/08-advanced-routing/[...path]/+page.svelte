<!--
  Catch-all route for Lesson 08 demo: [...path]
  Matches any sub-URL under /lessons/08-advanced-routing/
-->
<script lang="ts">
	interface PageData {
		path: string;
		segments: string[];
	}
	import { resolve } from '$app/paths';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Rest Params Demo: /{data.path} · SvelteKit Course</title>
</svelte:head>

<div class="space-y-8 animate-fade-in">
	<a href={resolve("/lessons/08-advanced-routing")} class="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors no-underline">
		<LessonIcon name="ArrowLeft" size={16} />
		Back to Advanced Routing
	</a>

	<div class="p-8 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
		<div class="absolute -top-24 -right-24 w-64 h-64 bg-(--color-accent)/10 rounded-full blur-3xl"></div>
		
		<div class="relative z-10 space-y-4">
			<div class="text-[10px] font-bold uppercase tracking-widest text-(--color-accent)">Catch-all Triggered</div>
			<div class="text-2xl font-bold text-white break-all">
				/lessons/08-advanced-routing/<span class="text-(--color-accent)">{data.path}</span>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<div class="space-y-6">
			<h3 class="text-lg font-bold text-white flex items-center gap-2">
				<LessonIcon name="Hash" size={18} class="text-(--color-accent)" />
				Path segments (array)
			</h3>
			<div class="grid grid-cols-1 gap-2">
				{#each data.segments as seg, i (i)}
					<div class="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/2 group hover:bg-white/4 transition-all">
						<span class="text-[10px] font-mono text-white/20">[{i}]</span>
						<code class="text-sm text-white font-mono">{seg}</code>
					</div>
				{:else}
					<div class="p-8 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2">
						<LessonIcon name="Inbox" size={32} class="text-white/10" />
						<span class="text-sm text-white/30">No segments captured (empty path)</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="p-8 rounded-xl border border-white/10 bg-black/20 flex flex-col justify-center gap-4">
			<div class="w-12 h-12 rounded-xl bg-(--color-accent)/10 flex items-center justify-center text-(--color-accent)">
				<LessonIcon name="Waves" size={24} />
			</div>
			<p class="text-sm text-white/60 leading-relaxed">
				The folder <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">[...path]</code> captures <strong>zero or more</strong> URL segments. Try
				changing the URL path and see how the segments array updates.
			</p>
			<a href={resolve("/lessons/08-advanced-routing")} class="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all no-underline mt-4">
				Return to lesson
			</a>
		</div>
	</div>
</div>

