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

<article class="lesson-page animate-fade-in">
	<!-- Header -->
	<header class="lesson-header">
		<div class="lesson-meta">
			<span class="lesson-number">Lesson {lesson.id}</span>
			<span class="badge badge-blue">{lesson.tags[0]}</span>
			<a href={lesson.docUrl} target="_blank" rel="noreferrer" class="badge badge-purple">
				📖 Official Docs ↗
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
		{#if prev}
			<a href="/lessons/{prev.slug}" class="nav-btn nav-prev">
				<svg viewBox="0 0 16 16" width="16" fill="currentColor">
					<path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06z"/>
				</svg>
				<div class="nav-text">
					<span class="nav-label">Previous</span>
					<span class="nav-title">{prev.emoji} {prev.title}</span>
				</div>
			</a>
		{:else}
			<div></div>
		{/if}

		{#if next}
			<a href="/lessons/{next.slug}" class="nav-btn nav-next">
				<div class="nav-text nav-text--right">
					<span class="nav-label">Next</span>
					<span class="nav-title">{next.emoji} {next.title}</span>
				</div>
				<svg viewBox="0 0 16 16" width="16" fill="currentColor">
					<path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06z"/>
				</svg>
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
