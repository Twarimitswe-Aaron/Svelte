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

<article class="px-6 py-8 pb-16 animate-fade-in mx-auto w-full">
	<!-- Header -->
	<header class="mb-8">
		<div class="gap-2 mb-3 flex flex-wrap items-center">
			<span class="font-bold tracking-widest text-[0.75rem] uppercase">Lesson {lesson.id}</span>
			<span
				class="px-2.5 py-1 font-bold tracking-widest bg-black/40 backdrop-blur-md border-white/10 text-white/90 rounded-full border text-[10px] uppercase"
				>{lesson.tags[0]}</span
			>
			<a
				href={lesson.docUrl}
				target="_blank"
				rel="noreferrer"
				class="badge px-2.5 font-bold tracking-widest bg-black/40 backdrop-blur-md border-white/10 text-white/90 h-full rounded-full border text-[10px] uppercase"
			>
				<BookOpen size={13} class="mr-1" />
				<span>Official Docs</span>
				<ExternalLink size={11} class="ml-1 opacity-70" />
			</a>
		</div>
		<h1
			class="font-extrabold leading-tight mb-3 gap-2 sm:text-[2.5rem] flex items-center text-[2.2rem] text-(--color-text)"
		>
			<LessonIcon name={lesson.icon} size={32} class="shrink-0 text-(--color-accent)" />
			{lesson.title}
		</h1>
		<p class="leading-relaxed max-w-[680px] text-[1rem] text-(--color-text-muted)">
			{lesson.description}
		</p>
	</header>

	<!-- Concept cards: what it does / what fails -->
	<div class="sm:grid-cols-2 gap-4 mb-8 grid grid-cols-1">
		<ConceptCard type="what" text={whatItDoes} />
		<ConceptCard type="fails" text={whatFails} />
	</div>

	<!-- Demo content (each lesson fills this) -->
	<section
		class="glass-blur rounded-xl p-7 mb-10 border border-(--color-border) bg-[rgba(255,255,255,0.02)]"
	>
		<h2
			class="gap-2 font-bold tracking-widest mb-6 flex items-center text-[0.8rem] text-(--color-text-muted) uppercase"
		>
			<span class="w-2 h-2 animate-pulse-glow rounded-full bg-(--color-success)"></span>
			Live Demo
		</h2>
		{@render children()}
	</section>

	<!-- Lesson navigation -->
	<nav class="gap-4 flex justify-between">
		{#if prev}
			<a
				href={resolve(`/lessons/${prev.slug}` as unknown as '/')}
				class="gap-3 p-4 glass-blur flex max-w-[280px] flex-1 items-center rounded-[10px] border border-(--color-border) bg-[rgba(255,255,255,0.02)] text-(--color-text) no-underline transition-all hover:border-(--color-accent)"
				aria-label="Previous lesson: {prev.title}"
			>
				<ChevronLeft size={20} />
				<div class="flex flex-col">
					<div class="gap-2 mt-0.5 flex items-center">
						<LessonIcon name={prev.icon} size={14} />
						<span class="font-semibold text-[0.875rem] text-(--color-text)">{prev.title}</span>
					</div>
				</div>
			</a>
		{:else}
			<div class="max-w-[280px] flex-1"></div>
		{/if}

		{#if next}
			<a
				href={resolve(`/lessons/${next.slug}` as unknown as '/')}
				class="gap-3 p-4 glass-blur ml-auto flex max-w-[280px] flex-1 items-center justify-end rounded-[10px] border border-(--color-border) bg-[rgba(255,255,255,0.02)] text-(--color-text) no-underline transition-all hover:border-(--color-accent)"
				aria-label="Next lesson: {next.title}"
			>
				<div class="flex flex-col text-right">
					<div class="gap-2 mt-0.5 flex items-center justify-end">
						<span class="font-semibold text-[0.875rem] text-(--color-text)">{next.title}</span>
						<LessonIcon name={next.icon} size={14} />
					</div>
				</div>
				<ChevronRight size={20} />
			</a>
		{:else}
			<div class="max-w-[280px] flex-1"></div>
		{/if}
	</nav>
</article>
