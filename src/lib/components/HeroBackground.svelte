<script lang="ts">
	interface Props {
		height?: string;
	}

	let { height = '800px' }: Props = $props();
</script>

<div class="hero-bg" style="--bg-height: {height}">
	<div class="gradient-layer"></div>
	<div class="radial-pink"></div>
	<div class="radial-blue"></div>
	<div class="radial-purple"></div>
	<div class="noise-layer">
		<div class="noise-inner"></div>
	</div>
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
		background-color: transparent;
	}

	.gradient-layer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 240px;
		background: linear-gradient(180deg, rgba(3, 7, 18, 0) 0%, rgb(3, 7, 18) 100%);
		opacity: 1;
		z-index: 2;
	}

	.radial-pink {
		position: absolute;
		width: 994px;
		height: 800px;
		top: 0;
		right: -480px;
		background: radial-gradient(50% 50%, rgb(236, 72, 153) 0%, rgba(236, 72, 153, 0) 100%);
		opacity: 0.4;
		transform: rotate(-30deg);
		z-index: 1;
	}

	.radial-blue {
		position: absolute;
		width: 994px;
		height: 800px;
		top: 0;
		left: -480px;
		background: radial-gradient(50% 50%, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 100%);
		opacity: 0.4;
		transform: rotate(30deg);
		z-index: 1;
	}

	.radial-purple {
		position: absolute;
		bottom: -100px;
		left: 0;
		right: 0;
		height: 522px;
		background: radial-gradient(50% 50%, rgb(140, 22, 250) 0%, rgba(140, 22, 250, 0) 100%);
		opacity: 0.36;
		z-index: 1;
	}

	.noise-layer {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		z-index: 3;
	}

	.noise-inner {
		position: absolute;
		inset: 0;
		background-image: url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png");
		background-repeat: repeat;
		background-position: left top;
		background-size: 128px;
	}
</style>
