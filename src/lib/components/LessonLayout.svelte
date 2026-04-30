<!--
  LessonLayout.svelte — Reusable wrapper for every lesson page.

  WHY: Provides consistent chrome (title, doc link, prev/next nav, concept cards)
       around each lesson's unique demo content.
  WHAT FAILS WITHOUT IT: Every lesson page would repeat the same boilerplate HTML,
       making it hard to change the lesson UI globally.

  Props:
    - lesson: the current Lesson metadata object
    - prev / next: adjacent lessons (from getAdjacentLessons)
-->
<script lang="ts">
	import { resolve } from '$app/paths';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import type { Lesson } from '$lib/lessons.js';
	import ConceptCard from './ConceptCard.svelte';
	import LessonIcon from './LessonIcon.svelte';

	interface Props {
		lesson: Lesson;
		prev?: Lesson | null;
		next?: Lesson | null;
		whatItDoes: string;
		whatFails: string;
		children: import('svelte').Snippet;
	}

	let { lesson, prev = null, next = null, whatItDoes, whatFails, children }: Props = $props();
</script>

<!--
  ACCESSIBILITY + SEO: Each lesson page gets a unique <title> so that:
  - SvelteKit's built-in live region announces the new page name to screen readers on navigation.
  - Search engines index each lesson with a distinct, descriptive title.
  - og:description makes shared links informative.
-->
<svelte:head>
	<title>{lesson.title} — SvelteKit Course</title>
	<meta name="description" content={lesson.description} />
	<meta property="og:title" content="{lesson.title} — SvelteKit Course" />
	<meta property="og:description" content={lesson.description} />
</svelte:head>

<article class="w-full mx-auto px-6 py-8 pb-16 animate-fade-in">
	<!-- Header -->
	<header class="mb-8">
		<div class="flex items-center gap-2 mb-3 flex-wrap">
			<span class="text-[0.75rem] font-bold tracking-widest uppercase ">Lesson {lesson.id}</span>
			<span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md border border-white/10 text-white/90">{lesson.tags[0]}</span>
			<a href={resolve(lesson.docUrl as unknown as "/")} target="_blank" rel="noreferrer" class="badge px-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest h-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90">
				<BookOpen size={13} class="mr-1" />
				<span>Official Docs</span>
				<ExternalLink size={11} class="ml-1 opacity-70" />
			</a>
		</div>
		<h1 class="text-[2.2rem] font-extrabold leading-tight mb-3 flex items-center gap-2 text-(--color-text) sm:text-[2.5rem]">
			<LessonIcon name={lesson.icon} size={32} class="text-(--color-accent) shrink-0" />
			{lesson.title}
		</h1>
		<p class="text-(--color-text-muted) text-[1rem] leading-relaxed max-w-[680px]">{lesson.description}</p>
	</header>

	<!-- Concept cards: what it does / what fails -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
		<ConceptCard type="what" text={whatItDoes} />
		<ConceptCard type="fails" text={whatFails} />
	</div>

	<!-- Demo content (each lesson fills this) -->
	<section class="bg-transparent backdrop-blur-md border border-(--color-border) rounded-xl p-7 mb-10">
		<h2 class="flex items-center gap-2 text-[0.8rem] font-bold tracking-widest uppercase text-(--color-text-muted) mb-6">
			<span class="w-2 h-2 bg-(--color-success) rounded-full animate-pulse-glow"></span>
			Live Demo
		</h2>
		{@render children()}
	</section>

	<!-- Lesson navigation -->
	<nav class="flex justify-between gap-4">
		{#if prev}
			<a
				href={resolve(`/lessons/${prev.slug}` as unknown as "/")}
				class="flex items-center gap-3 p-4 bg-transparent backdrop-blur-md border border-(--color-border) rounded-[10px] text-(--color-text) no-underline flex-1 max-w-[280px] transition-all hover:border-(--color-accent)"
				aria-label="Previous lesson: {prev.title}"
			>
				<ChevronLeft size={20} />
				<div class="flex flex-col">
					
					<div class="flex items-center gap-2 mt-0.5">
						<LessonIcon name={prev.icon} size={14} />
						<span class="text-[0.875rem] font-semibold text-(--color-text)">{prev.title}</span>
					</div>
				</div>
			</a>
		{:else}
			<div class="flex-1 max-w-[280px]"></div>
		{/if}

		{#if next}
			<a
				href={resolve(`/lessons/${next.slug}` as unknown as "/")}
				class="flex items-center justify-end gap-3 p-4 bg-transparent backdrop-blur-md border border-(--color-border) rounded-[10px] text-(--color-text) no-underline flex-1 max-w-[280px] transition-all hover:border-(--color-accent) ml-auto"
				aria-label="Next lesson: {next.title}"
			>
				<div class="flex flex-col text-right">

					<div class="flex items-center justify-end gap-2 mt-0.5">
						<span class="text-[0.875rem] font-semibold text-(--color-text)">{next.title}</span>
						<LessonIcon name={next.icon} size={14} />
					</div>
				</div>
				<ChevronRight size={20} />
			</a>
		{:else}
			<div class="flex-1 max-w-[280px]"></div>
		{/if}
	</nav>
</article>
