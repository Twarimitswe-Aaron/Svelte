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
	import { lessons } from '$lib/lessons.js';	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import { resolve } from '$app/paths';

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

    BEST PRACTICES applied here:
    - og:type / og:description / og:url for rich social sharing
    - Twitter Card for rich Twitter/X link previews
    - Font loading is handled in app.html (not here) because:
      Svelte 5 rejects inline string event handlers (onload="..."),
      but app.html is raw HTML where that pattern is perfectly valid.
  -->
	<title>SvelteKit Course</title>
	<meta name="description" content="Learn SvelteKit from scratch with real, interactive demos." />

	<!-- Open Graph -->
	<meta property="og:title" content="SvelteKit Interactive Course" />
	<meta property="og:description" content="Master SvelteKit with 19 interactive lessons — routing, hooks, auth, SSR and more." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sveltekit-course.dev" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="SvelteKit Interactive Course" />
	<meta name="twitter:description" content="Master SvelteKit with 19 interactive lessons." />
</svelte:head>

<!-- Mobile overlay -->
{#if sidebarOpen}
	<button
		class="fixed inset-0 z-[19] cursor-pointer border-none bg-black/60"
		aria-label="Close sidebar"
		onclick={toggle}
	></button>
{/if}

<div class="flex h-screen overflow-hidden">
	<!-- ===== SIDEBAR ===== -->
	<aside
		class="scrollbar-hide z-20 flex h-full w-[var(--sidebar-width)] min-w-[var(--sidebar-width)] flex-col overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-250 ease-in-out fixed md:static inset-y-0 left-0 {sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
	>
		<!-- Logo / Brand -->
		<a
			href={resolve('/')}
			class="flex items-center gap-3 px-4 py-5 font-bold text-[var(--color-text)] no-underline hover:bg-[var(--color-surface-2)]"
			onclick={() => (sidebarOpen = false)}
		>
			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[0.8rem] font-black text-[#0d1117]"
			>
				SK
			</div>
			<div class="flex flex-col text-left">
				<span class="text-[0.95rem] font-bold">SvelteKit</span>
				<span class="text-[0.7rem] text-[var(--color-text-muted)]">Interactive Course</span>
			</div>
		</a>

		<div class="h-px bg-[var(--color-border)]"></div>

		<!-- Home link -->
		<a
			href={resolve('/')}
			class="flex items-center px-4 py-2.5 text-[0.875rem] font-medium no-underline transition-all hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] {$page.url.pathname === '/' ? 'bg-[var(--color-surface-2)] text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}"
			onclick={() => (sidebarOpen = false)}
		>
			<LessonIcon
				name="Home"
				class="shrink-0 transition-colors {$page.url.pathname === '/' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}"
			/>
			<span class="ml-2">Home</span>
		</a>

		<div class="h-px bg-[var(--color-border)]"></div>

		<!-- Lesson list -->
		<nav class="scrollbar-hide flex-1 overflow-y-auto py-2" aria-label="Course lessons">
			<p
				class="m-0 px-4 pb-1 pt-4 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
			>
				Lessons
			</p>
			{#each lessons as lesson (lesson.id)}
				<a
					href={resolve(("/lessons/" + lesson.slug) as unknown as "/")}
					class="group flex items-center gap-2 border-l-2 px-4 py-[0.55rem] text-[0.825rem] font-medium no-underline transition-all hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] {activeSlug === lesson.slug ? 'border-[var(--color-accent)] bg-[rgba(88,166,255,0.08)] text-[var(--color-accent)]' : 'border-transparent text-[var(--color-text-muted)]'}"
					onclick={() => (sidebarOpen = false)}
					title={lesson.description}
				>
					<LessonIcon
						name={lesson.icon}
						class="shrink-0 transition-colors group-hover:text-[var(--color-accent)] {activeSlug === lesson.slug ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}"
					/>
					<span class="flex-1 min-w-0 overflow-hidden truncate whitespace-nowrap">
						<span class="text-[0.75rem] text-[var(--color-text-muted)]">{lesson.id}.</span>
						{lesson.title}
					</span>
					<span class="badge {tagColors[lesson.tags[0]]} shrink-0 px-[0.35rem] py-[0.1rem] text-[0.6rem]">{lesson.tags[0]}</span>
				</a>
			{/each}
		</nav>

		<div class="border-t border-[var(--color-border)] p-4">
			<a
				href="https://svelte.dev/docs/kit"
				target="_blank"
				rel="noreferrer"
				class="flex items-center text-[0.8rem] text-[var(--color-text-muted)] no-underline hover:text-[var(--color-accent)]"
			>
				<LessonIcon name="BookOpen" size={14} class="mr-[0.4rem] shrink-0 opacity-80" />
				<span>Official Docs</span>
				<LessonIcon name="ExternalLink" size={11} class="ml-1 opacity-50" />
			</a>
		</div>
	</aside>

	<!-- ===== MAIN CONTENT ===== -->
	<div class="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
		<!-- Top bar (mobile only) -->
		<header
			class="sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] p-3 md:hidden shrink-0"
		>
			<button
				class="flex cursor-pointer flex-col gap-1 border-none bg-transparent p-1"
				aria-label="Toggle menu"
				onclick={toggle}
			>
				<span class="block h-0.5 w-5 rounded-sm bg-[var(--color-text)]"></span>
				<span class="block h-0.5 w-5 rounded-sm bg-[var(--color-text)]"></span>
				<span class="block h-0.5 w-5 rounded-sm bg-[var(--color-text)]"></span>
			</button>
			<span class="text-[0.9rem] font-bold">SvelteKit Course</span>
		</header>

		<main class="scrollbar-hide flex-1 overflow-y-auto">
			<!-- 
        {@render children()} — This is Svelte 5's snippet system.
        WHAT FAILS WITHOUT IT: The child page (+page.svelte) content will NEVER appear.
        It's the equivalent of <slot /> in Svelte 4.  
      -->
			{@render children()}
		</main>
	</div>
</div>


