<script lang="ts">
	interface Props {
		height?: string;
	}

	let { height = 'full' }: Props = $props();
</script>

<div class="fixed top-0 left-0 right-0 h-[var(--bg-height)] z-[-1] overflow-hidden pointer-events-none bg-[#09090b]" style="--bg-height: {height}">
	<div class="h-full w-full relative opacity-100">
		<!-- Gradient Bottom Layer -->
		<div class="absolute bottom-0 left-0 right-0 h-[240px] overflow-hidden bg-gradient-to-b from-transparent to-[#030712] z-[2]"></div>

		<!-- Radial - Pink -->
		<div
			class="absolute top-[80px] right-[-480px] w-[994px] h-[800px] overflow-hidden z-[1] flex-none"
			style="background: radial-gradient(50% 50%, rgb(236, 72, 153) 0%, rgba(236, 72, 153, 0) 100%); opacity: 0.4; transform: rotate(-30deg);"
		></div>

		<!-- Radial - Blue -->
		<div
			class="absolute top-[80px] left-[-480px] w-[994px] h-[800px] overflow-hidden z-[1] flex-none"
			style="background: radial-gradient(50% 50%, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 100%); opacity: 0.4; transform: rotate(30deg);"
		></div>

		<!-- Radial - Purple (Bottom) -->
		<div
			class="absolute bottom-0 left-0 right-0 h-[522px] overflow-hidden z-[1] flex-none"
			style="background: radial-gradient(50% 50%, rgb(140, 22, 250) 0%, rgba(140, 22, 250, 0) 100%); opacity: 0.36;"
		></div>

		<!-- Noise Texture -->
		<div class="absolute inset-0 opacity-10 z-[1] pointer-events-none flex-none">
			<div
				class="absolute inset-0 rounded-[inherit]"
				style="background-image: url(&quot;https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png&quot;); background-repeat: repeat; background-position: left top; border: 0px; background-size: 128px;"
			></div>
		</div>

		<!-- Darkening Overlay -->
		<div class="absolute inset-0 bg-black/20 z-[3] pointer-events-none"></div>
	</div>
</div>
