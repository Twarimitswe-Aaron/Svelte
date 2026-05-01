<script lang="ts">
	import DOMPurify from 'isomorphic-dompurify';

	/**
	 * @component SafeHtml
	 * Safely renders HTML content by sanitizing it with DOMPurify.
	 * This prevents XSS attacks while allowing safe HTML tags and attributes.
	 */
	let { content } = $props<{ content: string }>();

	// Sanitize the content whenever it changes
	const sanitized = $derived(DOMPurify.sanitize(content));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html sanitized}
