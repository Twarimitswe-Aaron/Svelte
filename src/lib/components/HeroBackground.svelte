<script lang="ts">
	interface Props {
		height?: string;
	}

	let { height = '800px' }: Props = $props();
</script>

<div class="hero-bg" style="--bg-height: {height}">
	<div class="gradient-overlay"></div>
	<div class="radial-pink"></div>
	<div class="radial-blue"></div>
	<div class="radial-purple"></div>
	<div class="noise-overlay"></div>
</div>

<style>
	.hero-bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--bg-height);
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
		background-color: #030712; /* Fallback dark color */
	}

	.gradient-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(3, 7, 18, 0) 0%, rgb(3, 7, 18) 100%);
		opacity: 1;
		z-index: 1;
	}

	.radial-pink {
		position: absolute;
		width: 994px;
		height: 800px;
		top: 80px;
		right: -480px;
		background: radial-gradient(50% 50%, rgb(236, 72, 153) 0%, rgba(236, 72, 153, 0) 100%);
		opacity: 0.4;
		transform: rotate(-30deg);
		overflow: hidden;
	}

	.radial-blue {
		position: absolute;
		width: 994px;
		height: 800px;
		top: 80px;
		left: -480px;
		background: radial-gradient(50% 50%, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 100%);
		opacity: 0.4;
		transform: rotate(30deg);
		overflow: hidden;
	}

	.radial-purple {
		position: absolute;
		height: 522px;
		bottom: 0;
		left: 0;
		right: 0;
		background: radial-gradient(50% 50%, rgb(140, 22, 250) 0%, rgba(140, 22, 250, 0) 100%);
		opacity: 0.36;
		overflow: hidden;
		z-index: 1;
	}

	.noise-overlay {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		background-image: url("/bg.avif");
		background-repeat: repeat;
		background-position: left top;
		background-size: 128px;
	}
</style>
