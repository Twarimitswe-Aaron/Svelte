<!--
  ConceptCard.svelte — Displays "What it does" or "What fails without it".

  WHY: Every lesson needs this pattern — explain the concept, then warn what
       breaks if you omit it. Centralising the UI ensures consistent styling.
  WHAT FAILS WITHOUT IT: Conceptual context would be hardcoded per lesson with
       inconsistent formatting.
-->
<script lang="ts">
	import Lightbulb from 'lucide-svelte/icons/lightbulb';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	interface Props {
		type: 'what' | 'fails';
		text: string;
	}
	let { type, text }: Props = $props();

	const config = {
		what: {
			icon: Lightbulb,
			label: 'What this does',
			borderColor: 'rgba(59, 130, 246, 0.2)',
			bgColor: 'rgba(59, 130, 246, 0.05)',
			labelColor: '#3b82f6'
		},
		fails: {
			icon: CircleAlert,
			label: 'What fails without it',
			borderColor: 'rgba(239, 68, 68, 0.2)',
			bgColor: 'rgba(239, 68, 68, 0.05)',
			labelColor: '#ef4444'
		}
	};

	const c = $derived(config[type]);
</script>

<div 
	class="rounded-xl p-4 px-5 border transition-all duration-300 glass-blur"
	style="border-color: {c.borderColor}; background-color: {c.bgColor};"
>
	<div class="flex items-center gap-2 mb-2">
		<span class="flex items-center justify-center" style="color: {c.labelColor};">
			<c.icon size={16} strokeWidth={2.5} />
		</span>
		<span class="text-[0.75rem] font-bold tracking-widest uppercase" style="color: {c.labelColor};">
			{c.label}
		</span>
	</div>
	<p class="text-[0.875rem] text-(--color-text-muted) leading-relaxed m-0">
		{text}
	</p>
</div>
<style>
	.glass-blur {
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		transform: translateZ(0);
	}
</style>
