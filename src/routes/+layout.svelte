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

	import HeroBackground from '$lib/components/HeroBackground.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	let mainElement: HTMLElement | undefined = $state();

	afterNavigate(() => {
		if (mainElement) {
			mainElement.scrollTo(0, 0);
		}
	});

	// Sidebar open/closed state (mobile)
	let sidebarOpen = $state(false);

	function toggle() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<title>SvelteKit Course</title>
	<meta
		name="description"
		content="Complete guide to building full-stack web apps with SvelteKit."
	/>
</svelte:head>

<HeroBackground height="150vh" />

<div class="flex h-screen overflow-hidden bg-transparent">
	<!-- Mobile overlay -->
	{#if sidebarOpen}
		<button
			class="inset-0 bg-black/60 md:hidden fixed z-29 cursor-pointer border-none"
			aria-label="Close sidebar"
			onclick={toggle}
		></button>
	{/if}

	<Sidebar bind:sidebarOpen />

	<!-- ===== MAIN CONTENT ===== -->
	<div class="min-w-0 relative flex h-full flex-1 flex-col overflow-hidden">
		<!-- Top bar (mobile only) -->
		<header
			class="top-0 gap-3 border-white/10 bg-black/20 backdrop-blur-md p-4 md:hidden sticky z-10 flex shrink-0 items-center border-b"
		>
			<button
				class="gap-1 p-1 flex cursor-pointer flex-col border-none bg-transparent"
				aria-label="Toggle menu"
				onclick={toggle}
			>
				<span class="h-0.5 w-5 rounded-sm bg-white block"></span>
				<span class="h-0.5 w-5 rounded-sm bg-white block"></span>
				<span class="h-0.5 w-5 rounded-sm bg-white block"></span>
			</button>
			<span class="font-bold text-white text-[0.9rem]">SvelteKitt</span>
		</header>

		<main bind:this={mainElement} class="scrollbar-hide flex-1 overflow-y-auto">
			<div class="min-h-full w-full">
				{@render children()}
			</div>
		</main>
	</div>
</div>

<style>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
