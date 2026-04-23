<!--
  routes/+layout.svelte — Root layout for the ENTIRE application.

  WHY: Every page in SvelteKit renders inside the closest layout.
       The root layout wraps ALL pages, giving us a shared shell (nav, sidebar).
  WHAT FAILS WITHOUT IT:
    - {@render children()} is how Svelte 5 injects child page content.
    - If you remove it, no page content will ever render.
    - The sidebar would need to be duplicated in every single page file.
  
  The <svelte:head> block lets us set global meta tags that appear in <head>.
-->
<script lang="ts">
	import '../app.css'; // Pull in global styles + Tailwind

	import { page } from '$app/stores';
	import { lessons } from '$lib/lessons.js';

	let { children } = $props();

	// Sidebar open/closed state (mobile)
	let sidebarOpen = $state(false);

	// Determine if a lesson slug is "active" for highlighted nav item
	const activeSlug = $derived($page.url.pathname.replace('/lessons/', '').split('/')[0]);

	const tagColors: Record<string, string> = {
		'getting-started': 'badge-green',
		core: 'badge-blue',
		advanced: 'badge-purple'
	};

	function toggle() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<!-- 
    These meta tags apply to every page unless a child overrides them.
    Without svelte:head here, pages would have no title/description for SEO.
  -->
	<title>SvelteKit Course</title>
	<meta name="description" content="Learn SvelteKit from scratch with real, interactive demos." />
	<meta property="og:title" content="SvelteKit Interactive Course" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Mobile overlay -->
{#if sidebarOpen}
	<button class="overlay" aria-label="Close sidebar" onclick={toggle}></button>
{/if}

<div class="app-shell">
	<!-- ===== SIDEBAR ===== -->
	<aside class="sidebar" class:sidebar--open={sidebarOpen}>
		<!-- Logo / Brand -->
		<a href="/" class="sidebar-logo" onclick={() => (sidebarOpen = false)}>
			<div class="logo-icon">SK</div>
			<div class="logo-text">
				<span class="logo-title">SvelteKit</span>
				<span class="logo-sub">Interactive Course</span>
			</div>
		</a>

		<div class="sidebar-divider"></div>

		<!-- Home link -->
		<a
			href="/"
			class="sidebar-home"
			class:active={$page.url.pathname === '/'}
			onclick={() => (sidebarOpen = false)}
		>
			🏠 Home
		</a>

		<div class="sidebar-divider"></div>

		<!-- Lesson list -->
		<nav class="sidebar-nav" aria-label="Course lessons">
			<p class="nav-section-label">Lessons</p>
			{#each lessons as lesson}
				<a
					href="/lessons/{lesson.slug}"
					class="sidebar-link"
					class:active={activeSlug === lesson.slug}
					onclick={() => (sidebarOpen = false)}
					title={lesson.description}
				>
					<span class="sidebar-emoji">{lesson.emoji}</span>
					<span class="sidebar-link-text">
						<span class="sidebar-link-num">{lesson.id}.</span>
						{lesson.title}
					</span>
					<span class="badge {tagColors[lesson.tags[0]]} sidebar-tag">{lesson.tags[0]}</span>
				</a>
			{/each}
		</nav>

		<div class="sidebar-footer">
			<a href="https://svelte.dev/docs/kit" target="_blank" rel="noreferrer" class="sidebar-docs-link">
				📚 Official Docs ↗
			</a>
		</div>
	</aside>

	<!-- ===== MAIN CONTENT ===== -->
	<div class="main-wrap">
		<!-- Top bar (mobile only) -->
		<header class="topbar">
			<button class="menu-btn" aria-label="Toggle menu" onclick={toggle}>
				<span></span><span></span><span></span>
			</button>
			<span class="topbar-title">SvelteKit Course</span>
		</header>

		<main class="main-content">
			<!-- 
        {@render children()} — This is Svelte 5's snippet system.
        WHAT FAILS WITHOUT IT: The child page (+page.svelte) content will NEVER appear.
        It's the equivalent of <slot /> in Svelte 4.  
      -->
			{@render children()}
		</main>
	</div>
</div>

<style>
	.app-shell {
		display: flex;
		min-height: 100vh;
	}

	/* ---- Sidebar ---- */
	.sidebar {
		width: var(--sidebar-width);
		min-width: var(--sidebar-width);
		background: var(--color-surface);
		border-right: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		height: 100vh;
		position: sticky;
		top: 0;
		overflow-y: auto;
		z-index: 20;
		transition: transform 0.25s ease;
	}

	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem 1rem;
		text-decoration: none;
		color: var(--color-text);
	}
	.sidebar-logo:hover { text-decoration: none; background: var(--color-surface-2); }

	.logo-icon {
		width: 36px;
		height: 36px;
		background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 900;
		font-size: 0.8rem;
		color: #0d1117;
		flex-shrink: 0;
	}

	.logo-text {
		display: flex;
		flex-direction: column;
	}
	.logo-title { font-weight: 700; font-size: 0.95rem; }
	.logo-sub { font-size: 0.7rem; color: var(--color-text-muted); }

	.sidebar-divider {
		height: 1px;
		background: var(--color-border);
		margin: 0;
	}

	.sidebar-home {
		display: flex;
		align-items: center;
		padding: 0.6rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: all 0.15s;
	}
	.sidebar-home:hover, .sidebar-home.active {
		color: var(--color-text);
		background: var(--color-surface-2);
		text-decoration: none;
	}

	.sidebar-nav {
		flex: 1;
		padding: 0.5rem 0;
		overflow-y: auto;
	}

	.nav-section-label {
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		padding: 0.5rem 1rem 0.25rem;
		margin: 0;
	}

	.sidebar-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 1rem;
		font-size: 0.825rem;
		font-weight: 500;
		color: var(--color-text-muted);
		text-decoration: none;
		transition: all 0.15s;
		border-left: 2px solid transparent;
	}
	.sidebar-link:hover {
		color: var(--color-text);
		background: var(--color-surface-2);
		text-decoration: none;
	}
	.sidebar-link.active {
		color: var(--color-accent);
		background: rgba(88, 166, 255, 0.08);
		border-left-color: var(--color-accent);
	}

	.sidebar-emoji { font-size: 1rem; flex-shrink: 0; }
	.sidebar-link-text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.sidebar-link-num { color: var(--color-text-muted); font-size: 0.75rem; }
	.sidebar-tag { font-size: 0.6rem; padding: 0.1rem 0.35rem; flex-shrink: 0; }

	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid var(--color-border);
	}
	.sidebar-docs-link {
		font-size: 0.8rem;
		color: var(--color-text-muted);
	}
	.sidebar-docs-link:hover { color: var(--color-accent); }

	/* ---- Main area ---- */
	.main-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0; /* prevents overflow */
	}

	.main-content {
		flex: 1;
	}

	/* ---- Top bar (mobile) ---- */
	.topbar {
		display: none;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.topbar-title {
		font-weight: 700;
		font-size: 0.9rem;
	}

	.menu-btn {
		display: flex;
		flex-direction: column;
		gap: 4px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
	}
	.menu-btn span {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--color-text);
		border-radius: 2px;
	}

	/* Mobile overlay */
	.overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 19;
		border: none;
		cursor: pointer;
	}

	/* ---- Responsive ---- */
	@media (max-width: 768px) {
		.topbar { display: flex; }
		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			transform: translateX(-100%);
			z-index: 20;
		}
		.sidebar--open {
			transform: translateX(0);
		}
	}
</style>
