<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import LessonIcon from './LessonIcon.svelte';

	let { sidebarOpen = $bindable(false) } = $props();

	const navItems = [
		{ name: 'Home', href: '/', icon: 'Home' },
		{ name: 'Articles', href: '/articles', icon: 'FileText' },
	
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
	class="border-r border-white/10 backdrop-blur-[5px] bg-[rgba(0,0,0,0.08)] flex flex-col h-full w-(--sidebar-width) transition-transform duration-300 fixed md:static z-30 {sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
>
	<!-- Top / Logo -->
	<div class="px-6 py-8">
		<a href={resolve('/')} class="flex items-center gap-3 no-underline group">
			<div class="flex flex-col ml-1 gap-[2px] w-5 h-5 shrink-0">
				<div class="flex gap-[2px] h-1/2">
					<div class="w-1/2 h-full bg-[#3b82f6] rounded-tl-[8px] rounded-bl-[8px] rounded-tr-[8px]"></div>
					<div class="w-1/2 h-full bg-[#3b82f6] opacity-60 rounded-tr-[8px] rounded-tl-[8px] rounded-br-[8px]"></div>
				</div>
				<div class="flex gap-[2px] h-1/2">
					<div class="w-1/2 h-full bg-[#3b82f6] opacity-40 rounded-bl-[8px] rounded-br-[8px] rounded-tl-[8px]"></div>
					<div class="w-1/2 h-full bg-[#3b82f6] rounded-bl-[8px] rounded-br-[8px] rounded-tr-[8px]"></div>
				</div>
			</div>
			<span class="text-[1.2rem] font-bold text-white tracking-tight">svelte</span>
		</a>
	</div>

	<!-- Menu -->
	<nav class="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
		{#each navItems as item (item.name)}
			<a
				href={resolve(item.href as unknown as "/")}
				class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all no-underline {$page.url.pathname === item.href ? 'bg-[rgba(255,255,255,0.08)] text-white' : 'text-white/70 hover:bg-[rgba(255,255,255,0.04)] hover:text-white'}"
				onclick={() => (sidebarOpen = false)}
			>
				<LessonIcon name={item.icon} size={18} class="font-bold opacity-100" />
				<span class="text-[14px] font-bold">{item.name}</span>
			</a>
		{/each}

		<div class="py-6">
			<div class="flex items-center gap-3 px-3 mb-4">
				<span class="text-[10px] font-bold uppercase tracking-widest text-white/50">Courses</span>
				<div class="flex-1 h-px bg-white/10"></div>
			</div>
			{#each courses as course (course.name)}
				<a	
					href={resolve(course.href as unknown as "/")}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all no-underline text-white/70 hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
					onclick={() => (sidebarOpen = false)}
				>
					<LessonIcon name={course.icon} size={18} class="opacity-80" />
					<span class="text-[14px] font-medium">{course.name}</span>
				</a>
			{/each}
		</div>
	</nav>

	<!-- Bottom -->
	<div class="p-6 border-t border-white/10 flex gap-4">
	
		<a href="https://www.instagram.com/twarimitswe/" target="_blank" class="text-white/50 hover:text-white transition-colors">
			<LessonIcon name="Camera" size={18} />
		</a>
	</div>
</aside>


