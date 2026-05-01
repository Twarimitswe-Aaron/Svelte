<script lang="ts">
	import { resolve } from '$app/paths';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { onMount } from 'svelte';

	interface Post {
		id: number;
		slug: string;
		title: string;
		author: string;
		date: string;
		excerpt: string;
		tags: string[];
	}

	let posts = $state<Post[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch('/api/posts');
			posts = await res.json();
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Articles — SvelteKit Course</title>
</svelte:head>

<div class="w-full mx-auto px-6 py-12 pb-24 animate-fade-in max-w-[1000px]">
	<header class="mb-16">
		<div class="flex items-center gap-3 mb-4">
			<span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-(--color-accent)">Knowledge Base</span>
		</div>
		<h1 class="text-[3rem] font-black leading-tight mb-4 text-white sm:text-[3.5rem] tracking-tight">
			Latest <span class="text-(--color-accent)">Insights</span>
		</h1>
		<p class="text-white/50 text-[1.1rem] leading-relaxed max-w-[600px]">
			Deep dives into Svelte development, performance optimizations, and the future of web applications.
		</p>
	</header>

	{#if loading}
		<div class="flex items-center justify-center py-24">
			<div class="w-8 h-8 border-2 border-(--color-accent)/20 border-t-(--color-accent) rounded-full animate-spin"></div>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each posts as post (post.id)}
				<a 
					href={resolve(`/articles/${post.slug}` as unknown as "/")}
					class="group flex flex-col p-10 rounded-xl glass-blur bg-[rgba(255,255,255,0.03)] border border-white/5 no-underline transition-all hover:border-(--color-accent)/30 hover:bg-[rgba(255,255,255,0.05)] relative overflow-hidden"
				>
					<div class="absolute -top-12 -right-12 w-24 h-24 bg-(--color-accent)/5 rounded-full blur-2xl group-hover:bg-(--color-accent)/10 transition-colors"></div>
					
					<div class="flex items-center gap-3 mb-6">
						{#each post.tags as tag (tag)}
							<span class="text-[10px] font-bold uppercase tracking-widest text-white/30">{tag}</span>
						{/each}
						<div class="flex-1"></div>
						<span class="text-[10px] font-bold text-white/20 uppercase tracking-widest">{post.date}</span>
					</div>

					<h2 class="text-xl font-bold text-white mb-3 group-hover:text-(--color-accent) transition-colors">{post.title}</h2>
					<p class="text-white/40 text-sm leading-relaxed mb-8 flex-1">{post.excerpt}</p>

					<div class="flex items-center justify-between mt-auto">
						<div class="flex items-center gap-2">
							<div class="w-6 h-6 rounded-full bg-(--color-accent)/20 flex items-center justify-center">
								<LessonIcon name="User" size={12} class="text-(--color-accent)" />
							</div>
							<span class="text-xs font-medium text-white/40">{post.author}</span>
						</div>
						<div class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-(--color-accent)/50 group-hover:bg-(--color-accent) group-hover:text-white transition-all">
							<LessonIcon name="ArrowRight" size={14} />
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.glass-blur {
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transform: translateZ(0);
	}
</style>
