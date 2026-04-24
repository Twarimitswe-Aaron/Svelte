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
	import { ChevronLeft, ChevronRight, ExternalLink, BookOpen } from 'lucide-svelte';
	import type { Lesson } from '$lib/lessons.js';
	import ConceptCard from './ConceptCard.svelte';

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
	<title>{lesson.emoji} {lesson.title} — SvelteKit Course</title>
	<meta name="description" content={lesson.description} />
	<meta property="og:title" content="{lesson.emoji} {lesson.title} — SvelteKit Course" />
	<meta property="og:description" content={lesson.description} />
</svelte:head>

<article class="lesson-page animate-fade-in">
	<!-- Header -->
	<header class="lesson-header">
		<div class="lesson-meta">
			<span class="lesson-number">Lesson {lesson.id}</span>
			<span class="badge badge-blue">{lesson.tags[0]}</span>
			<a href={lesson.docUrl} target="_blank" rel="noreferrer" class="badge badge-purple">
				<BookOpen size={13} class="icon-inline" />
				<span>Official Docs</span>
				<ExternalLink size={11} class="icon-inline opacity-70" />
			</a>
		</div>
		<h1 class="lesson-title">
			<span class="lesson-emoji">{lesson.emoji}</span>
			{lesson.title}
		</h1>
		<p class="lesson-desc">{lesson.description}</p>
	</header>

	<!-- Concept cards: what it does / what fails -->
	<div class="concept-cards">
		<ConceptCard type="what" text={whatItDoes} />
		<ConceptCard type="fails" text={whatFails} />
	</div>

	<!-- Demo content (each lesson fills this) -->
	<section class="lesson-demo">
		<h2 class="demo-heading">
			<span class="demo-dot"></span>
			Live Demo
		</h2>
		{@render children()}
	</section>

	<!-- Lesson navigation -->
	<nav class="lesson-nav">
		<!--
		  ACCESSIBILITY: The SVGs are decorative (aria-hidden) because the <a> tag's
		  visible text ("Previous / Next" + lesson title) already describes the destination.
		  Adding aria-label to the <a> gives assistive tech a clear, full description.
		-->
		{#if prev}
			<a
				href="/lessons/{prev.slug}"
				class="nav-btn nav-prev"
				aria-label="Previous lesson: {prev.title}"
			>
				<ChevronLeft size={20} />
				<div class="nav-text">
					<span class="nav-label">Previous</span>
					<span class="nav-title">{prev.emoji} {prev.title}</span>
				</div>
			</a>
		{:else}
			<div></div>
		{/if}

		{#if next}
			<a
				href="/lessons/{next.slug}"
				class="nav-btn nav-next"
				aria-label="Next lesson: {next.title}"
			>
				<div class="nav-text nav-text--right">
					<span class="nav-label">Next</span>
					<span class="nav-title">{next.emoji} {next.title}</span>
				</div>
				<ChevronRight size={20} />
			</a>
		{:else}
			<div></div>
		{/if}
	</nav>
</article>

<style>
	.lesson-page {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1.5rem 4rem;
	}

	.lesson-header {
		margin-bottom: 2rem;
	}

	.lesson-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		flex-wrap: wrap;
	}

	.badge :global(.icon-inline) {
		display: inline-block;
		vertical-align: middle;
		margin-right: 0.25rem;
	}

	.badge :global(.opacity-70) {
		opacity: 0.7;
	}

	.lesson-number {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.lesson-title {
		font-size: 2.2rem;
		font-weight: 800;
		line-height: 1.2;
		margin: 0 0 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text);
	}

	.lesson-emoji {
		font-size: 2rem;
	}

	.lesson-desc {
		color: var(--color-text-muted);
		font-size: 1rem;
		line-height: 1.7;
		max-width: 680px;
		margin: 0;
	}

	.concept-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 640px) {
		.concept-cards { grid-template-columns: 1fr; }
		.lesson-title { font-size: 1.6rem; }
	}

	.lesson-demo {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.75rem;
		margin-bottom: 2.5rem;
	}

	.demo-heading {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		margin: 0 0 1.5rem;
	}

	.demo-dot {
		width: 8px;
		height: 8px;
		background: var(--color-success);
		border-radius: 50%;
		animation: pulse-glow 2s ease-in-out infinite;
	}

	/* Navigation arrows */
	.lesson-nav {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		color: var(--color-text);
		text-decoration: none;
		flex: 1;
		max-width: 280px;
		transition: border-color 0.15s, background 0.15s;
	}

	.nav-btn:hover {
		border-color: var(--color-accent);
		background: var(--color-surface-2);
		text-decoration: none;
	}

	.nav-next { justify-content: flex-end; margin-left: auto; }

	.nav-text {
		display: flex;
		flex-direction: column;
	}
	.nav-text--right { text-align: right; }

	.nav-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
	}

	.nav-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
	}
</style>
