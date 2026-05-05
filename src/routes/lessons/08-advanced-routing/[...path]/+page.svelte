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
	<a
		href={resolve('/lessons/08-advanced-routing')}
		class="gap-2 text-sm text-white/40 hover:text-white inline-flex items-center no-underline transition-colors"
	>
		<LessonIcon name="ArrowLeft" size={16} />
		Back to Advanced Routing
	</a>

	<div class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur relative overflow-hidden border">
		<div
			class="-top-24 -right-24 w-64 h-64 blur-3xl absolute rounded-full bg-(--color-accent)/10"
		></div>

		<div class="space-y-4 relative z-10">
			<div class="font-bold tracking-widest text-[10px] text-(--color-accent) uppercase">
				Catch-all Triggered
			</div>
			<div class="text-2xl font-bold text-white break-all">
				/lessons/08-advanced-routing/<span class="text-(--color-accent)">{data.path}</span>
			</div>
		</div>
	</div>

	<div class="lg:grid-cols-2 gap-8 grid grid-cols-1">
		<div class="space-y-6">
			<h3 class="text-lg font-bold text-white gap-2 flex items-center">
				<LessonIcon name="Hash" size={18} class="text-(--color-accent)" />
				Path segments (array)
			</h3>
			<div class="gap-2 grid grid-cols-1">
				{#each data.segments as seg, i (i)}
					<div
						class="gap-4 p-4 rounded-xl border-white/5 bg-white/2 group hover:bg-white/4 glass-blur flex items-center border transition-all"
					>
						<span class="font-mono text-white/20 text-[10px]">[{i}]</span>
						<code class="text-sm text-white font-mono">{seg}</code>
					</div>
				{:else}
					<div
						class="p-8 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 glass-blur"
					>
						<LessonIcon name="Inbox" size={32} class="text-white/10" />
						<span class="text-sm text-white/30">No segments captured (empty path)</span>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="p-8 rounded-xl border-white/10 bg-black/20 gap-4 glass-blur flex flex-col justify-center border"
		>
			<div
				class="w-12 h-12 rounded-xl flex items-center justify-center bg-(--color-accent)/10 text-(--color-accent)"
			>
				<LessonIcon name="Waves" size={24} />
			</div>
			<p class="text-sm text-white/60 leading-relaxed">
				The folder <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono"
					>[...path]</code
				>
				captures <strong>zero or more</strong> URL segments. Try changing the URL path and see how the
				segments array updates.
			</p>
			<a
				href={resolve('/lessons/08-advanced-routing')}
				class="px-6 py-3 rounded-xl bg-white/5 border-white/10 text-white font-bold text-sm hover:bg-white/10 mt-4 glass-blur inline-flex items-center justify-center border no-underline transition-all"
			>
				Return to lesson
			</a>
		</div>
	</div>
</div>
