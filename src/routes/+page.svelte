<script lang="ts">
	import { lessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { resolve } from '$app/paths';

	const articles = [
		{
			title: 'Why Svelte is the Best Modern Framework',
			slug: 'why-svelte-is-the-best-framework',
			description:
				'Explore the revolutionary features that make Svelte a game-changer: true reactivity, zero boilerplate, and lightning-fast performance.',
			date: 'April 30, 2026',
			tag: 'Featured',
			author: {
				name: 'Antigravity',
				icon: 'CircleHelp'
			}
		},
		{
			title: 'Svelte 5 Runes Explained',
			slug: 'svelte-5-runes-explained',
			description:
				'Svelte 5 introduces runes — a new reactivity system that replaces the old store API for better performance and DX.',
			date: 'March 22, 2025',
			tag: null,
			author: {
				name: 'Rich Harris',
				icon: 'User'
			}
		}
	];
</script>

<div class="px-10 py-16 md:py-24">
	<!-- Hero Section -->
	<div class="mx-auto flex w-full flex-col items-center text-center">
		<!-- New Badge -->
		<div class="mb-6 flex items-center justify-center">
			<div
				class="gap-2 border-white/10 bg-black p-1 pr-3 backdrop-blur-md flex items-center rounded-full border"
			>
				<div class="px-2.5 backdrop-blur-xl rounded-full bg-[#3b82f6]">
					<span class="font-bold text-white text-[10px]">New</span>
				</div>
				<span
					class="bg-linear-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-[12px] text-transparent"
				>
					SvelteKit Tutorial
				</span>
			</div>
		</div>

		<!-- Main Heading -->
		<h1
			class="font-medium text-white mb-6 text-[clamp(2.5rem,8vw,3.5rem)] leading-[1.1] tracking-[-1px]"
		>
			Master SvelteKit with <br /> expert best practices & source code
		</h1>

		<!-- Description -->
		<p class="text-white/50 mb-10 leading-relaxed max-w-[500px] text-[1.1rem]">
			Learn how to build production-ready applications by studying elite patterns and clean source
			code.
		</p>

		<!-- Buttons -->
		<div class="gap-4 mb-24 flex flex-wrap items-center justify-center">
			<a
				href={resolve('/lessons/01-intro')}
				class="px-8 py-3.5 bg-white text-black hover:bg-white/80 gap-2 flex cursor-pointer items-center rounded-[800px] no-underline transition-transform"
			>
				Get started
				<LessonIcon name="ExternalLink" size={16} />
			</a>
			<a
				href="https://github.com/Twarimitswe-Aaron/Svelte"
				target="_blank"
				class="px-8 py-3.5 bg-white/5 border-white/10 backdrop-blur-md text-white font-semiBold rounded-[800px] border no-underline transition-all hover:bg-transparent hover:backdrop-blur-none"
			>
				View on GitHub
			</a>
		</div>

		<!-- Latest Section -->
		<div class="w-full text-left">
			<div class="gap-4 mb-12 flex items-center">
				<h3 class="font-bold text-white text-[18px]">Lessons</h3>
				<div class="bg-white/10 h-px flex-1"></div>
			</div>

			<div class="md:grid-cols-2 lg:grid-cols-3 gap-6 grid grid-cols-1">
				{#each lessons as lesson (lesson.slug)}
					<a
						href={resolve(`/lessons/${lesson.slug}` as '/')}
						class="group flex flex-col no-underline"
					>
						<div
							class="p-4 rounded-xl border-white/10 bg-white/5 mb-4 group-hover:border-white/20 group-hover:bg-black/20 glass-blur relative aspect-4/3 overflow-hidden border transition-all"
						>
							<!-- Tag Badge -->
							<div class="top-4 right-4 absolute z-20">
								<span
									class="px-2.5 py-1 font-bold tracking-widest bg-black/40 backdrop-blur-md border-white/10 text-white/90 rounded-full border text-[10px] uppercase"
								>
									{lesson.tags[0]}
								</span>
							</div>
							<!-- Hover Icon -->
							<div
								class="inset-0 absolute z-20 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"
							>
								<div
									class="w-12 h-12 bg-white translate-y-4 group-hover:translate-y-0 ease-out flex items-center justify-center rounded-full opacity-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:opacity-100"
								>
									<LessonIcon name="ExternalLink" class="text-black" size={20} />
								</div>
							</div>

							<!-- Main Image Container -->
							<div
								class="inset-3 rounded-xl border-white/10 glass-blur absolute z-10 overflow-hidden border bg-[#0c0c0e]"
							>
								{#if lesson.image}
									<img
										src={lesson.image}
										alt={lesson.title}
										class="h-full w-full object-cover opacity-100 transition-opacity duration-500"
									/>
									<!-- Dark Overlay -->
									<div
										class="inset-0 group-hover:bg-black/20 absolute transition-colors duration-300"
									></div>
								{:else}
									<div
										class="from-white/5 to-white/0 p-8 flex h-full w-full items-end bg-linear-to-br"
									>
										<div
											class="font-bold text-white/5 tracking-tighter text-[4rem] leading-none select-none"
										>
											#{lesson.id.toString().padStart(2, '0')}
										</div>
									</div>
								{/if}
							</div>
						</div>
						<div class="px-1">
							<h4
								class="font-bold text-white text-[16px] transition-colors group-hover:text-[#3b82f6]"
							>
								{lesson.title}
							</h4>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Articles Section -->
		<div class="mt-32 w-full text-left">
			<div class="gap-4 mb-12 flex items-center">
				<h3 class="font-bold text-white text-[18px]">Latest Articles</h3>
				<div class="bg-white/10 h-px flex-1"></div>
				<a
					href={resolve('/articles')}
					class="font-bold tracking-widest text-white/30 gap-2 flex items-center text-[12px] uppercase no-underline transition-colors hover:text-(--color-accent)"
				>
					View All <LessonIcon name="ArrowRight" size={12} />
				</a>
			</div>

			<div class="md:grid-cols-2 gap-8 grid grid-cols-1">
				{#each articles as article (article.slug)}
					<a
						href={resolve(`/articles/${article.slug}` as '/')}
						class="group p-5 backdrop-blur-md rounded-xl glass-blur border-white/5 relative flex flex-col overflow-hidden border bg-[rgba(255,255,255,0.03)] no-underline transition-all hover:border-(--color-accent)/30 hover:bg-[rgba(255,255,255,0.05)]"
					>
						<div
							class="-top-24 -right-24 w-64 h-64 blur-3xl absolute rounded-full bg-(--color-accent)/5 transition-colors group-hover:bg-(--color-accent)/10"
						></div>

						<div class="gap-3 mb-8 flex items-center">
							{#if article.tag}
								<span
									class="px-3 py-1 tracking-widest border-white/10 bg-black/40 backdrop-blur-md text-white rounded-full border text-[10px] uppercase"
									>{article.tag}</span
								>
							{/if}
							<span class="font-bold tracking-widest text-white/20 text-[10px] uppercase"
								>{article.date}</span
							>
						</div>

						<h2
							class="text-2xl font-bold text-white mb-4 transition-colors group-hover:text-(--color-accent)"
						>
							{article.title}
						</h2>
						<p class="text-white/40 leading-relaxed mb-10 text-[1.1rem]">
							{article.description}
						</p>

						<div class="pt-6 border-white/5 gap-3 mt-auto flex items-center border-t">
							<div
								class="w-8 h-8 bg-white/5 border-white/10 flex items-center justify-center rounded-full border"
							>
								<LessonIcon name={article.author.icon} size={14} class="text-white/40" />
							</div>
							<span class="text-sm font-medium text-white/40">{article.author.name}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
