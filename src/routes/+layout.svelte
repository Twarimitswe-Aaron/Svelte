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

	let { children } = $props();

	// Sidebar open/closed state (mobile)
	let sidebarOpen = $state(false);

	function toggle() {
		sidebarOpen = !sidebarOpen;
	}
</script>

<svelte:head>
	<title>Gallereee — Directory & Curation</title>
	<meta name="description" content="Build your own curation website with this template." />
</svelte:head>

<HeroBackground height="150vh" />

<div class="flex h-screen overflow-hidden bg-transparent">
	<!-- Mobile overlay -->
	{#if sidebarOpen}
		<button
			class="fixed inset-0 z-[29] cursor-pointer border-none bg-black/60 md:hidden"
			aria-label="Close sidebar"
			onclick={toggle}
		></button>
	{/if}

	<Sidebar bind:sidebarOpen />

	<!-- ===== MAIN CONTENT ===== -->
	<div class="flex min-w-0 flex-1 flex-col h-full overflow-hidden relative">
		<!-- Top bar (mobile only) -->
		<header
			class="sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-black/20 backdrop-blur-md p-4 md:hidden shrink-0"
		>
			<button
				class="flex cursor-pointer flex-col gap-1 border-none bg-transparent p-1"
				aria-label="Toggle menu"
				onclick={toggle}
			>
				<span class="block h-0.5 w-5 rounded-sm bg-white"></span>
				<span class="block h-0.5 w-5 rounded-sm bg-white"></span>
				<span class="block h-0.5 w-5 rounded-sm bg-white"></span>
			</button>
			<span class="text-[0.9rem] font-bold text-white">Gallereee</span>
		</header>

		<main class="flex-1 overflow-y-auto scrollbar-hide">
			<div class="framer-vsngcy w-full min-h-full">
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


