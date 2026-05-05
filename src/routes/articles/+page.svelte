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

<div class="px-6 py-12 pb-24 animate-fade-in mx-auto w-full max-w-[1000px]">
	<header class="mb-16">
		<div class="gap-3 mb-4 flex items-center">
			<span
				class="px-3 py-1 font-bold tracking-widest backdrop-blur-md bg-black border-white/10 text-white rounded-full border text-[10px] uppercase"
				>Knowledge Base</span
			>
		</div>
		<h1
			class="font-black leading-tight mb-4 text-white sm:text-[3.5rem] tracking-tight text-[3rem]"
		>
			Latest <span class="text-(--color-accent)">Insights</span>
		</h1>
		<p class="text-white/50 leading-relaxed max-w-[600px] text-[1.1rem]">
			Deep dives into Svelte development, performance optimizations, and the future of web
			applications.
		</p>
	</header>

	{#if loading}
		<div class="py-24 flex items-center justify-center">
			<div
				class="w-8 h-8 animate-spin rounded-full border-2 border-(--color-accent)/20 border-t-(--color-accent)"
			></div>
		</div>
	{:else}
		<div class="md:grid-cols-2 gap-6 grid grid-cols-1">
			{#each posts as post (post.id)}
				<a
					href={resolve(`/articles/${post.slug}` as unknown as '/')}
					class="group p-10 backdrop-blur-xl from-white/10 to-white/0 rounded-xl glass-blur border-white/5 relative flex flex-col overflow-hidden border bg-[rgba(255,255,255,0.03)] bg-linear-to-tr no-underline backdrop-sepia-50 transition-all hover:border-(--color-accent)/30 hover:bg-[rgba(255,255,255,0.05)]"
				>
					<div
						class="-top-12 -right-12 w-24 h-24 blur-2xl absolute rounded-full bg-(--color-accent)/5 transition-colors group-hover:bg-(--color-accent)/10"
					></div>

					<div class="gap-3 mb-6 flex items-center">
						{#each post.tags as tag (tag)}
							<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
								>{tag}</span
							>
						{/each}
						<div class="flex-1"></div>
						<span class="font-bold text-white/20 tracking-widest text-[10px] uppercase"
							>{post.date}</span
						>
					</div>

					<h2
						class="text-xl font-bold text-white mb-3 transition-colors group-hover:text-(--color-accent)"
					>
						{post.title}
					</h2>
					<p class="text-white/40 text-sm leading-relaxed mb-8 flex-1">{post.excerpt}</p>

					<div class="mt-auto flex items-center justify-between">
						<div class="gap-2 flex items-center">
							<div
								class="w-6 h-6 flex items-center justify-center rounded-full bg-(--color-accent)/20"
							>
								<LessonIcon name="User" size={12} class="text-(--color-accent)" />
							</div>
							<span class="text-xs font-medium text-white/40">{post.author}</span>
						</div>
						<div
							class="w-8 h-8 border-white/10 group-hover:text-white flex items-center justify-center rounded-full border transition-all group-hover:border-(--color-accent)/50 group-hover:bg-(--color-accent)"
						>
							<LessonIcon name="ArrowRight" size={14} />
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
