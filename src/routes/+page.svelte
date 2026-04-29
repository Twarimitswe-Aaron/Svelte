<script lang="ts">
	import { lessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { resolve } from '$app/paths';
</script>

<div class="framer-1ggw0hh px-6 py-16 md:py-24">
	<!-- Hero Section -->
	<div class="framer-1qwoli1 max-w-[800px] mx-auto text-center flex flex-col items-center">
		<!-- New Badge -->
		<div class="mb-6 flex items-center justify-center">
			<div class="backdrop-blur-[20px] bg-[#3b82f6] rounded-[80px] px-3 py-1 flex items-center justify-center">
				<span class="text-[10px] font-bold text-white uppercase">New</span>
			</div>
		</div>

		<!-- Gradient Title -->
		<div class="mb-4">
			<span class="text-[16px] font-bold tracking-tight bg-gradient-to-r from-[#3b82f6] to-[#93c5fd] bg-clip-text text-transparent">
				SvelteKit Course Category
			</span>
		</div>

		<!-- Main Heading -->
		<h1 class="text-[clamp(2.5rem,8vw,4.5rem)] font-bold text-white leading-[1.1] tracking-[-0.03em] mb-6">
			The directory & <br /> curation template
		</h1>

		<!-- Description -->
		<p class="text-[1.1rem] text-white/50 max-w-[500px] mb-10 leading-relaxed">
			Build your own curation website with this SvelteKit template. Master the framework while building a real project.
		</p>

		<!-- Buttons -->
		<div class="flex flex-wrap items-center justify-center gap-4 mb-24">
			<a
				href={resolve('/lessons/01-intro')}
				class="px-8 py-3.5 bg-white text-black font-bold rounded-[800px] hover:scale-105 transition-transform no-underline flex items-center gap-2"
			>
				Get started
				<LessonIcon name="ExternalLink" size={16} />
			</a>
			<a
				href="https://github.com"
				target="_blank"
				class="px-8 py-3.5 bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold rounded-[800px] hover:bg-white/10 transition-all no-underline"
			>
				View on GitHub
			</a>
		</div>

		<!-- Latest Section -->
		<div class="w-full text-left">
			<div class="flex items-center gap-4 mb-12">
				<h3 class="text-[18px] font-bold text-white">Latest Lessons</h3>
				<div class="flex-1 h-px bg-white/10"></div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each lessons.slice(0, 6) as lesson}
					<a
						href={resolve(("/lessons/" + lesson.slug) as unknown as "/")}
						class="group flex flex-col no-underline"
					>
						<div class="aspect-[4/3] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden mb-4 relative transition-all group-hover:border-white/20">
							<!-- Card Badge/Logo -->
							<div class="absolute top-4 left-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center z-10">
								<LessonIcon name={lesson.icon} class="text-black" size={20} />
							</div>
							
							<!-- Hover Icon -->
							<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-20">
								<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
									<LessonIcon name="ExternalLink" class="text-black" size={20} />
								</div>
							</div>

							<!-- Placeholder for Image/Pattern -->
							<div class="w-full h-full bg-gradient-to-br from-white/5 to-white/0 p-8 flex items-end">
								<div class="text-[4rem] font-bold text-white/5 select-none leading-none tracking-tighter">
									#{lesson.id.toString().padStart(2, '0')}
								</div>
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

