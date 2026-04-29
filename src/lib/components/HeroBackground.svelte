<script lang="ts">
	interface Props {
		height?: string;
	}

	let { height = 'full' }: Props = $props();
</script>

<div class="hero-bg" style="--bg-height: {height}">
	<div class="framer-YiH8K framer-177smdg framer-v-18l0i2b" data-framer-name="Tablet">
		<div class="framer-1gtdcex" data-framer-name="Gradient"></div>

		<div
			class="framer-orq2k1"
			data-framer-name="Radial - Pink"
			style="background: radial-gradient(50% 50%, rgb(236, 72, 153) 0%, rgba(236, 72, 153, 0) 100%); opacity: 0.4; transform: rotate(-30deg);"
		></div>

		<div
			class="framer-1j41a62"
			data-framer-name="Radial - Blue"
			style="background: radial-gradient(50% 50%, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 100%); opacity: 0.4; transform: rotate(30deg);"
		></div>

		<div
			class="framer-vjcvf8"
			data-framer-name="Radial"
			style="background: radial-gradient(50% 50%, rgb(140, 22, 250) 0%, rgba(140, 22, 250, 0) 100%); opacity: 0.36;"
		></div>

		<div class="framer-16jol18" data-framer-name="Noise">
			<div
				data-framer-background-image-wrapper="true"
				style="position: absolute; border-radius: inherit; corner-shape: inherit; inset: 0px; background-image: url(&quot;https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png&quot;); background-repeat: repeat; background-position: left top; border: 0px; background-size: 128px;"
			></div>
		</div>
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
		background-color: #09090b;
	}

	.framer-YiH8K {
		height: 100%;
		width: 100%;
		opacity: 1;
		position: relative;
	}

	/* Gradient Bottom Layer */
	.framer-1gtdcex {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 240px;
		overflow: hidden;
		background: linear-gradient(
			180deg,
			rgba(3, 7, 18, 0) 0%,
			rgb(3, 7, 18) 100%
		);
		opacity: 1;
		z-index: 2;
	}

	/* Radial Pink */
	.framer-orq2k1 {
		flex: none;
		width: 994px;
		height: 800px;
		position: absolute;
		top: 80px;
		overflow: hidden;
		right: -480px;
		z-index: 1;
	}

	/* Radial Blue */
	.framer-1j41a62 {
		flex: none;
		width: 994px;
		height: 800px;
		position: absolute;
		top: 80px;
		overflow: hidden;
		left: -480px;
		z-index: 1;
	}

	/* Radial Purple (Bottom) */
	.framer-vjcvf8 {
		z-index: 1;
		flex: none;
		height: 522px;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
	}

	/* Noise Texture */
	.framer-16jol18 {
		z-index: 1;
		flex: none;
		position: absolute;
		inset: 0;
		opacity: 0.1;
		pointer-events: none;
	}
</style>
