<script lang="ts">
	interface Props {
		height?: string;
	}

	let { height = 'full' }: Props = $props();
</script>

<div class="hero-bg h-full" style="--bg-height: {height}">
	<div class="gradient-layer"></div>
	<div class="radial-pink"></div>
	<div class="radial-blue"></div>
	<div class="radial-purple"></div>
	<div class="framer-16jol18" data-framer-name="Noise">
		<div
			data-framer-background-image-wrapper="true"
			style="position: absolute; border-radius: inherit; corner-shape: inherit; inset: 0px; background-image: url(&quot;https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png&quot;); background-repeat: repeat; background-position: left top; border: 0px; background-size: 128px;"
		></div>
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
		height: 340px;
		background: linear-gradient(180deg, rgba(3, 7, 18, 0) 0%, rgb(3, 7, 18) 100%);
		opacity: 1;
		z-index: 2;
	}

	.radial-pink {
		position: absolute;
		width: 994px;
		height: 600px;
		bottom: 0;
		right: -480px;
		top: 80px;
		background: radial-gradient(50% 50%, rgb(236, 72, 153) 0%, rgba(236, 72, 153, 0) 100%);
		opacity: 0.4;
		transform: rotate(-30deg);
		z-index: 1;
	}

	.radial-blue {
		position: absolute;
		width: 994px;
		height: 800px;
		bottom: 0;
		left: -480px;
		top: 80px;
		background: radial-gradient(50% 50%, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 100%);
		opacity: 0.4;
		transform: rotate(30deg);
		z-index: 1;
	}

	.radial-purple {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 522px;
		background: radial-gradient(50% 50%, rgb(140, 22, 250) 0%, rgba(140, 22, 250, 0) 100%);
		opacity: 0.36;
		z-index: 1;
	}

	.framer-16jol18 {
		--one-if-corner-shape-supported: 1;
		font-family: sans-serif;
		font-size: 12px;
		--token-4c1f20db-f817-4a84-9db3-943de94d7866: #3b82f6;
		--token-3033e2f4-7551-4940-acc4-4a0bdcaf502a: #60a5fa;
		--token-b1778f41-d8f3-4d01-9f9a-946159d76323: #93c5fd;
		--token-d12ced2c-f6c8-494a-aaa5-d6432e7ba34a: #fff;
		--token-aefc2bb2-5c17-41e5-b4dc-6d52ec819234: #ffffff80;
		--token-55071dc9-92d0-4cdb-8ef9-67f5658ea748: #000;
		--token-f94cd32f-d03f-4267-9244-fd06d9047f64: #121212;
		--token-8b3a0e76-cef1-46b9-b4c5-48187d1e53b9: #ffffff14;
		--token-e1b141c8-ca89-4918-9567-7366384d1780: #ffffff0a;
		--framer-will-change-override: none;
		--framer-will-change-filter-override: none;
		--framer-aspect-ratio-supported: auto;
		box-sizing: border-box;
		-webkit-font-smoothing: inherit;
		z-index: 3;
		flex: none;
		position: absolute;
		inset: 0;
		opacity: 0.1;
		pointer-events: none;
	}
</style>
