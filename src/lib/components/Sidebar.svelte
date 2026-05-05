<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import LessonIcon from './LessonIcon.svelte';

	let { sidebarOpen = $bindable(false) } = $props();

	const navItems = [
		{ name: 'Home', href: '/', icon: 'Home' },
		{ name: 'Articles', href: '/articles', icon: 'FileText' }
	] as const;

	const courses = [
		{ name: 'SvelteKit 101', href: '/lessons/01-intro', icon: 'BookOpen' },
		{ name: 'Data Loading', href: '/lessons/04-loading-data', icon: 'Download' },
		{ name: 'Form Actions', href: '/lessons/05-form-actions', icon: 'MousePointerClick' },
		{ name: 'Hooks & API', href: '/lessons/09-hooks', icon: 'Link' },
		{ name: 'State Mastery', href: '/lessons/07-state-management', icon: 'Zap' }
	] as const;
</script>

<aside
	class="border-white/10 md:static fixed z-30 flex h-full w-(--sidebar-width) flex-col border-r bg-[rgba(0,0,0,0.08)] backdrop-blur-[5px] transition-transform duration-300 {sidebarOpen
		? 'translate-x-0'
		: 'md:translate-x-0 -translate-x-full'}"
>
	<!-- Top / Logo -->
	<div class="px-6 py-8">
		<a href={resolve('/')} class="gap-3 group flex items-center no-underline">
			<div class="ml-1 w-5 h-5 flex shrink-0 flex-col gap-[2px]">
				<div class="flex h-1/2 gap-[2px]">
					<div
						class="h-full w-1/2 rounded-tl-[8px] rounded-tr-[8px] rounded-bl-[8px] bg-[#3b82f6]"
					></div>
					<div
						class="h-full w-1/2 rounded-tl-[8px] rounded-tr-[8px] rounded-br-[8px] bg-[#3b82f6] opacity-60"
					></div>
				</div>
				<div class="flex h-1/2 gap-[2px]">
					<div
						class="h-full w-1/2 rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px] bg-[#3b82f6] opacity-40"
					></div>
					<div
						class="h-full w-1/2 rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] bg-[#3b82f6]"
					></div>
				</div>
			</div>
			<span class="font-bold text-white tracking-tight text-[1.2rem]">svelte</span>
		</a>
	</div>

	<!-- Menu -->
	<nav class="px-4 space-y-1 scrollbar-hide flex-1 overflow-y-auto">
		{#each navItems as item (item.name)}
			<a
				href={resolve(item.href as unknown as '/')}
				class="gap-3 px-3 py-3 rounded-xl flex items-center no-underline transition-all {$page.url
					.pathname === item.href
					? 'text-white bg-[rgba(255,255,255,0.08)]'
					: 'text-white/70 hover:text-white hover:bg-[rgba(255,255,255,0.04)]'}"
				onclick={() => (sidebarOpen = false)}
			>
				<LessonIcon name={item.icon} size={18} class="font-bold opacity-100" />
				<span class="font-bold text-[14px]">{item.name}</span>
			</a>
		{/each}

		<div class="py-6">
			<div class="gap-3 px-3 mb-4 flex items-center">
				<span class="font-bold tracking-widest text-white/50 text-[10px] uppercase">Courses</span>
				<div class="bg-white/10 h-px flex-1"></div>
			</div>
			{#each courses as course (course.name)}
				<a
					href={resolve(course.href as unknown as '/')}
					class="gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white flex items-center no-underline transition-all hover:bg-[rgba(255,255,255,0.04)]"
					onclick={() => (sidebarOpen = false)}
				>
					<LessonIcon name={course.icon} size={18} class="opacity-80" />
					<span class="font-medium text-[14px]">{course.name}</span>
				</a>
			{/each}
		</div>
	</nav>

	<!-- Bottom -->
	<div class="p-6 border-white/10 gap-4 flex border-t">
		<a
			href="https://www.instagram.com/twarimitswe/"
			target="_blank"
			class="text-white/50 hover:text-white transition-colors"
		>
			<LessonIcon name="Camera" size={18} />
		</a>
	</div>
</aside>
