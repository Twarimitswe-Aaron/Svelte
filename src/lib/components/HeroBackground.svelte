<script lang="ts">
	interface Props {
		height?: string;
	}

	let { height = 'full' }: Props = $props();
</script>

<div
	class="top-0 left-0 right-0 pointer-events-none fixed z-[-1] h-(--bg-height) overflow-hidden bg-[#09090b]"
	style="--bg-height: {height}"
>
	<div class="relative h-full w-full opacity-100">
		<!-- Gradient Bottom Layer -->
		<div
			class="bottom-0 left-0 right-0 absolute z-2 h-[240px] overflow-hidden bg-linear-to-b from-transparent to-[#030712]"
		></div>

		<!-- Radial - Orange -->
		<div
			class="absolute top-[80px] right-[-480px] z-1 h-[800px] w-[994px] flex-none overflow-hidden"
			style="background: radial-gradient(50% 50%, #ff3c00 0%, rgba(255, 60, 0, 0) 100%); opacity: 0.4; transform: rotate(-30deg);"
		></div>

		<!-- Radial - Blue -->
		<div
			class="absolute top-[80px] left-[-480px] z-1 h-[800px] w-[994px] flex-none overflow-hidden"
			style="background: radial-gradient(50% 50%, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0) 100%); opacity: 0.4; transform: rotate(30deg);"
		></div>

		<!-- Radial - Purple (Bottom) -->
		<div
			class="bottom-0 left-0 right-0 absolute z-1 h-[522px] flex-none overflow-hidden"
			style="background: radial-gradient(50% 50%, rgb(140, 22, 250) 0%, rgba(140, 22, 250, 0) 100%); opacity: 0.36;"
		></div>

		<!-- Noise Texture -->
		<div class="inset-0 pointer-events-none absolute z-1 flex-none opacity-10">
			<div
				class="inset-0 absolute rounded-[inherit]"
				style="background-image: url(&quot;/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png&quot;); background-repeat: repeat; background-position: left top; border: 0px; background-size: 128px;"
			></div>
		</div>

		<!-- Darkening Overlay -->
		<div class="inset-0 bg-black/20 pointer-events-none absolute z-3"></div>
	</div>
</div>
