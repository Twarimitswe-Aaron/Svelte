<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { onMount } from 'svelte';
	import SafeHtml from '$lib/components/SafeHtml.svelte';

	interface Post {
		id: number;
		slug: string;
		title: string;
		author: string;
		date: string;
		excerpt: string;
		tags: string[];
	}

	let post = $state<Post | null>(null);
	let loading = $state(true);

	const slug = page.params.slug;

	onMount(async () => {
		try {
			const res = await fetch('/api/posts');
			const allPosts: Post[] = await res.json();
			post = allPosts.find((p: Post) => p.slug === slug) ?? null;
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});

	// Mock content for the Svelte best stuffs article
	const svelteBestContent = `
		<p>Svelte has taken the web development world by storm, and for good reason. Unlike React or Vue, which do the bulk of their work in the <em>browser</em>, Svelte shifts that work into a <strong>compile step</strong> that happens when you build your app.</p>
		
		<h2 class="text-white mt-8 mb-4">1. True Reactivity</h2>
		<p>In Svelte, reactivity is built into the language itself. You don't need <code>useState</code> or <code>ref()</code>. You simply declare a variable with <code>$state()</code> (in Svelte 5) and use it. When the variable changes, the UI updates automatically.</p>
		
		<h2 class="text-white mt-8 mb-4">2. Zero Boilerplate</h2>
		<p>Svelte components are just HTML, CSS, and JavaScript. There's no complex JSX or template syntax to master. A simple counter that takes 15 lines in React takes only 5 in Svelte.</p>
		
		<h2 class="text-white mt-8 mb-4">3. Performance by Default</h2>
		<p>Because Svelte doesn't use a Virtual DOM, it can update the real DOM directly with surgical precision. This results in smaller bundles and faster runtime performance, especially on low-powered devices.</p>
		
		<h2 class="text-white mt-8 mb-4">4. Built-in Animation</h2>
		<p>Svelte is the only major framework that includes a robust animation and transition engine out of the box. Creating beautiful, fluid UIs is a first-class citizen in the Svelte ecosystem.</p>
	`;


</script>

<svelte:head>
	{#if post}
		<title>{post.title} — Articles</title>
	{/if}
</svelte:head>

<div class="w-full mx-auto px-6 py-12 pb-24 animate-fade-in max-w-[800px]">
	<a href={resolve('/articles')} class="inline-flex items-center gap-2 text-white/30 hover:text-(--color-accent) transition-colors mb-12 no-underline text-xs font-bold uppercase tracking-widest">
		<LessonIcon name="ArrowLeft" size={14} />
		Back to Articles
	</a>

	{#if loading}
		<div class="flex items-center justify-center py-24">
			<div class="w-8 h-8 border-2 border-(--color-accent)/20 border-t-(--color-accent) rounded-full animate-spin"></div>
		</div>
	{:else if post}
		<article>
			<header class="mb-12">
				<div class="flex items-center gap-3 mb-6">
					{#each post.tags as tag (tag)}
						<span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-(--color-accent)/10 border border-(--color-accent)/20 text-(--color-accent)">{tag}</span>
					{/each}
				</div>
				<h1 class="text-[2.5rem] font-black leading-tight mb-6 text-white sm:text-[3.5rem] tracking-tight">
					{post.title}
				</h1>
				<div class="flex items-center gap-4 py-6 border-y border-white/5">
					<div class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
						<LessonIcon name="User" size={18} class="text-white/40" />
					</div>
					<div class="flex flex-col">
						<span class="text-sm font-bold text-white">{post.author}</span>
						<span class="text-[10px] uppercase font-bold tracking-widest text-white/30">{post.date}</span>
					</div>
				</div>
			</header>

			<div class="prose prose-invert max-w-none text-white/60 leading-relaxed text-lg">
				{#if post.slug === 'why-svelte-is-the-best-framework'}
					<SafeHtml content={svelteBestContent} />
				{:else}
					<p>{post.excerpt}</p>
					<p class="mt-8 italic text-white/30 underline decoration-dotted">This is a mock article preview. Full content is not yet available for this post.</p>
				{/if}
			</div>
		</article>
	{:else}
		<div class="text-center py-24">
			<h2 class="text-2xl font-bold text-white mb-4">Article Not Found</h2>
			<p class="text-white/50 mb-8">The article you are looking for doesn't exist or has been moved.</p>
			<a href={resolve('/articles')} class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
				Browse All Articles
			</a>
		</div>
	{/if}
</div>
