<!--
  routes/+page.svelte — Home / Landing page

  WHY: This is the first thing learners see. It needs to be visually compelling
       and clearly communicate what the course offers.
  WHAT FAILS WITHOUT +page.svelte: The "/" route returns 404 — SvelteKit only
       renders routes that have a +page.svelte (or +server.ts) file.
-->
<script lang="ts">
	import { lessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import Rocket from 'lucide-svelte/icons/rocket';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import Zap from 'lucide-svelte/icons/zap';
	import Gamepad2 from 'lucide-svelte/icons/gamepad-2';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import Monitor from 'lucide-svelte/icons/monitor';
	import CheckCircle from 'lucide-svelte/icons/check-circle';

	const tagColors: Record<string, string> = {
		'getting-started': 'badge-green',
		core: 'badge-blue',
		advanced: 'badge-purple'
	};
</script>

<svelte:head>
	<title>SvelteKit Interactive Course — Learn by Building</title>
	<meta
		name="description"
		content="Master SvelteKit from routing to hooks with interactive live demos in every lesson."
	/>
</svelte:head>

<div class="home">
	<!-- Hero section -->
	<section class="hero">
		<div class="hero-badge">
			<span class="badge badge-purple">v2 · Svelte 5 Runes</span>
		</div>
		<h1 class="hero-title">
			Learn <span class="gradient-text">SvelteKit</span><br />
			by Building Real Things
		</h1>
		<p class="hero-desc">
			10 interactive lessons covering every major feature of SvelteKit — routing, loading data,
			form actions, hooks, error handling and more. Every lesson has a live demo and explains what
			breaks if you remove the feature.
		</p>
		<div class="hero-actions">
			<a href="/lessons/01-intro" class="btn btn-primary hero-cta">
				<Rocket size={18} /> Start with Lesson 1
			</a>
			<a
				href="https://svelte.dev/docs/kit"
				target="_blank"
				rel="noreferrer"
				class="btn btn-secondary"
			>
				<BookOpen size={18} /> Official Docs <ExternalLink size={14} class="opacity-50" />
			</a>
		</div>

		<!-- Stats row -->
		<div class="hero-stats">
			<div class="stat">
				<span class="stat-num">10</span>
				<span class="stat-label">Lessons</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat">
				<span class="stat-num">Live</span>
				<span class="stat-label">Demos in every lesson</span>
			</div>
			<div class="stat-divider"></div>
			<div class="stat">
				<span class="stat-num">100%</span>
				<span class="stat-label">SvelteKit docs coverage</span>
			</div>
		</div>
	</section>

	<!-- Lesson grid -->
	<section class="lessons-section">
		<h2 class="section-title">Course Curriculum</h2>
		<div class="lessons-grid">
			{#each lessons as lesson}
				<a href="/lessons/{lesson.slug}" class="lesson-card">
					<div class="lesson-card-top">
						<LessonIcon name={lesson.icon} size={28} class="lesson-card-icon" />
						<div class="lesson-card-num">#{lesson.id}</div>
					</div>
					<h3 class="lesson-card-title">{lesson.title}</h3>
					<p class="lesson-card-desc">{lesson.description}</p>
					<div class="lesson-card-footer">
						<span class="badge {tagColors[lesson.tags[0]]}">{lesson.tags[0]}</span>
						<span class="lesson-card-arrow">→</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- How it works -->
	<section class="how-section">
		<h2 class="section-title">How This Works</h2>
		<div class="how-grid">
			<div class="how-card">
				<div class="how-icon"><BookOpen size={28} color="var(--color-accent)" /></div>
				<h3>Read the Concept</h3>
				<p>
					Each lesson explains the SvelteKit feature, what it does, and links to the official docs.
				</p>
			</div>
			<div class="how-card">
				<div class="how-icon"><Gamepad2 size={28} color="var(--color-accent)" /></div>
				<h3>Use the Live Demo</h3>
				<p>
					Interact with running SvelteKit code right in the browser — no sandboxes, this is the real
					app.
				</p>
			</div>
			<div class="how-card">
				<div class="how-icon"><AlertTriangle size={28} color="#d29922" /></div>
				<h3>Understand the Failure Mode</h3>
				<p>
					Every lesson tells you exactly what breaks if you skip or misuse the feature — the most
					important part of learning.
				</p>
			</div>
			<div class="how-card">
				<div class="how-icon"><Monitor size={28} color="var(--color-accent)" /></div>
				<h3>Read the Code</h3>
				<p>
					All source files are annotated with comments. Open DevTools or the source to see exactly
					how each demo works.
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.home {
		padding: 0 0 4rem;
	}

	/* ---- Hero ---- */
	.hero {
		padding: 4rem 2rem 3rem;
		text-align: center;
		position: relative;
	}

	.hero::before {
		content: '';
		position: absolute;
		top: 0; left: 50%;
		transform: translateX(-50%);
		width: 600px;
		height: 300px;
		background: radial-gradient(ellipse at center top, rgba(88, 166, 255, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.hero-badge {
		margin-bottom: 1.5rem;
	}

	.hero-title {
		font-size: clamp(2.2rem, 5vw, 3.5rem);
		font-weight: 900;
		line-height: 1.15;
		margin: 0 0 1.25rem;
	}

	.hero-desc {
		color: var(--color-text-muted);
		font-size: 1.05rem;
		line-height: 1.75;
		max-width: 580px;
		margin: 0 auto 2rem;
	}

	.hero-actions {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 2.5rem;
	}

	.hero-cta {
		font-size: 1rem;
		padding: 0.75rem 1.5rem;
		animation: pulse-glow 3s ease-in-out infinite;
	}

	.hero-stats {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.stat {
		text-align: center;
	}
	.stat-num {
		display: block;
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--color-text);
	}
	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}
	.stat-divider {
		width: 1px;
		height: 32px;
		background: var(--color-border);
	}

	/* ---- Lessons grid ---- */
	.lessons-section {
		padding: 2rem;
	}

	.section-title {
		font-size: 1.3rem;
		font-weight: 800;
		margin: 0 0 1.5rem;
		color: var(--color-text);
	}

	.lessons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 1rem;
	}

	.lesson-card {
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 1.25rem;
		text-decoration: none;
		color: var(--color-text);
		transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
	}

	.lesson-card:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		text-decoration: none;
	}

	.lesson-card-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.lesson-card :global(.lesson-card-icon) {
		color: var(--color-accent);
	}

	.lesson-card-num {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--color-text-muted);
		background: var(--color-surface-2);
		border: 1px solid var(--color-border);
		border-radius: 6px;
		padding: 0.1rem 0.4rem;
	}

	.lesson-card-title {
		font-size: 0.95rem;
		font-weight: 700;
		margin: 0 0 0.5rem;
	}

	.lesson-card-desc {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		flex: 1;
		margin: 0 0 1rem;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.lesson-card-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.lesson-card-arrow {
		font-size: 1rem;
		color: var(--color-text-muted);
		transition: transform 0.15s;
	}
	.lesson-card:hover .lesson-card-arrow {
		transform: translateX(4px);
		color: var(--color-accent);
	}

	/* ---- How it works ---- */
	.how-section {
		padding: 2rem;
		border-top: 1px solid var(--color-border);
		margin-top: 1rem;
	}

	.how-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.how-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 1.25rem;
	}

	.how-icon {
		font-size: 1.75rem;
		margin-bottom: 0.75rem;
	}

	.how-card h3 {
		font-size: 0.9rem;
		font-weight: 700;
		margin: 0 0 0.4rem;
	}

	.how-card p {
		font-size: 0.8rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
	}
</style>
