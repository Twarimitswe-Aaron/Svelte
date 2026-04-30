<script lang="ts">
	import { lessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { resolve } from '$app/paths';
</script>

<div class="px-10 py-16 md:py-24">
	<!-- Hero Section -->
	<div class="w-full mx-auto text-center flex flex-col items-center">
		<!-- New Badge -->
		<div class="mb-6 flex items-center justify-center">
			<div class="flex items-center gap-2 rounded-full border border-white/10 bg-black p-1 pr-3 backdrop-blur-md">
				<div class="rounded-full bg-[#3b82f6] px-2.5  backdrop-blur-xl">
					<span class="text-[10px] font-bold text-white ">New</span>
				</div>
				<span class="bg-linear-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-[12px]  text-transparent">
					SvelteKit Tutorial
				</span>
			</div>
		</div>

		<!-- Main Heading -->
		<h1 class="text-[clamp(2.5rem,8vw,3.5rem)] font-medium text-white leading-[1.1] tracking-[-1px] mb-6">
			Master SvelteKit with <br /> expert best practices & source code
		</h1>

		<!-- Description -->
		<p class="text-[1.1rem] text-white/50 max-w-[500px] mb-10 leading-relaxed">
			Learn how to build production-ready applications by studying elite patterns and clean source code.
		</p>

		<!-- Buttons -->
		<div class="flex flex-wrap items-center justify-center gap-4 mb-24">
			<a
				href={resolve('/lessons/01-intro')}
				class="px-8 py-3.5 bg-white text-black rounded-[800px] cursor-pointer hover:bg-white/80  transition-transform no-underline flex items-center gap-2"
			>
				Get started
				<LessonIcon name="ExternalLink" size={16} />
			</a>
			<a
				href="https://github.com/Twarimitswe-Aaron/Svelte"
				target="_blank"
				class="px-8 py-3.5 hover:bg-transparent bg-white/5 border border-white/10 backdrop-blur-md hover:backdrop-blur-none text-white font-semiBold rounded-[800px] transition-all no-underline"
			>
				View on GitHub
			</a>
		</div>

		<!-- Latest Section -->
		<div class="w-full text-left">
			<div class="flex items-center gap-4 mb-12">
				<h3 class="text-[18px] font-bold text-white">Lessons</h3>
				<div class="flex-1 h-px bg-white/10"></div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each lessons as lesson (lesson.slug)}
					<a
						href={resolve(`/lessons/${lesson.slug}` as any)}
						class="group flex flex-col no-underline"
					>
						<div class="aspect-4/3 p-4 rounded-2xl border border-white/10 bg-white/5 overflow-hidden mb-4 relative transition-all group-hover:border-white/20 group-hover:bg-black/20">
							<!-- Tag Badge -->
							<div class="absolute top-4 right-4 z-20">
								<span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md border border-white/10 text-white/90">
									{lesson.tags[0]}
								</span>
							</div>
							<!-- Hover Icon -->
							<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
								<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
									<LessonIcon name="ExternalLink" class="text-black" size={20} />
								</div>
							</div>

							<!-- Main Image Container -->
							<div class="absolute inset-3 rounded-xl overflow-hidden border border-white/10 bg-[#0c0c0e] z-10">
								{#if lesson.image}
									<img src={lesson.image} alt={lesson.title} class="w-full h-full object-cover opacity-100 transition-opacity duration-500" />
									<!-- Dark Overlay -->
									<div class="absolute inset-0 group-hover:bg-black/20 transition-colors duration-300"></div>
								{:else}
									<div class="w-full h-full bg-linear-to-br from-white/5 to-white/0 p-8 flex items-end">
										<div class="text-[4rem] font-bold text-white/5 select-none leading-none tracking-tighter">
											#{lesson.id.toString().padStart(2, '0')}
										</div>
									</div>
								{/if}
							</div>
						</div>
						<div class="px-1">
							<h4 class="text-[16px] font-bold text-white group-hover:text-[#3b82f6] transition-colors">
								{lesson.title}
							</h4>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>

