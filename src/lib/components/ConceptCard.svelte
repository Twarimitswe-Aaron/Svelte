<!--
  ConceptCard.svelte — Displays "What it does" or "What fails without it".

  WHY: Every lesson needs this pattern — explain the concept, then warn what
       breaks if you omit it. Centralising the UI ensures consistent styling.
  WHAT FAILS WITHOUT IT: Conceptual context would be hardcoded per lesson with
       inconsistent formatting.
-->
<script lang="ts">
	interface Props {
		type: 'what' | 'fails';
		text: string;
	}
	let { type, text }: Props = $props();

	const config = {
		what: {
			icon: '💡',
			label: 'What this does',
			borderColor: 'rgba(88, 166, 255, 0.4)',
			bgColor: 'rgba(88, 166, 255, 0.06)',
			labelColor: 'var(--color-accent)'
		},
		fails: {
			icon: '⚠️',
			label: 'What fails without it',
			borderColor: 'rgba(248, 81, 73, 0.4)',
			bgColor: 'rgba(248, 81, 73, 0.06)',
			labelColor: 'var(--color-danger)'
		}
	};

	const c = $derived(config[type]);
</script>

<div class="concept-card" style="--border: {c.borderColor}; --bg: {c.bgColor};">
	<div class="card-header">
		<span class="card-icon">{c.icon}</span>
		<span class="card-label" style="color: {c.labelColor};">{c.label}</span>
	</div>
	<p class="card-text">{text}</p>
</div>

<style>
	.concept-card {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 1rem 1.25rem;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.card-icon {
		font-size: 1rem;
	}

	.card-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.card-text {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		line-height: 1.65;
		margin: 0;
	}
</style>
