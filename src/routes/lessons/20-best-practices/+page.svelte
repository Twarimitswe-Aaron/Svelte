<!--
  routes/lessons/20-best-practices/+page.svelte
  ════════════════════════════════════════════════
  WHAT THIS LESSON COVERS:
    Each of the 6 SvelteKit best-practice areas (Accessibility, SEO, Performance,
    Icons, Images, Auth) is demonstrated with:
      1. A "❌ Without" panel — simulating what breaks / looks wrong
      2. A "✅ With" panel  — the correct approach running live
      3. Deep code comments explaining EVERY decision

  NOTE: <svelte:head> title/description for this lesson is injected
        automatically by LessonLayout.svelte from the lesson metadata object.
        We do NOT add another title here.
-->
<script lang="ts">
	import LessonLayout from '$lib/components/LessonLayout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { getAdjacentLessons } from '$lib/lessons.js';
	import Home from 'lucide-svelte/icons/home';
	import Search from 'lucide-svelte/icons/search';
	import Bell from 'lucide-svelte/icons/bell';
	import CheckCircle from 'lucide-svelte/icons/check-circle';
	import AlertCircle from 'lucide-svelte/icons/alert-circle';
	import XCircle from 'lucide-svelte/icons/x-circle';
	import Clock from 'lucide-svelte/icons/clock';
	import Play from 'lucide-svelte/icons/play';
	import Zap from 'lucide-svelte/icons/zap';
	import Palette from 'lucide-svelte/icons/palette';
	import Image from 'lucide-svelte/icons/image';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import Lock from 'lucide-svelte/icons/lock';
	import Globe from 'lucide-svelte/icons/globe';

	const { prev, next, current: lesson } = getAdjacentLessons('20-best-practices');

	// ── SEO tab ──────────────────────────────────────────────────────────────
	let seoTab = $state<'without' | 'with'>('without');

	// ── Font loading tab ─────────────────────────────────────────────────────
	type FontTab = 'blocking' | 'preload' | 'noscript';
	let fontTab = $state<FontTab>('blocking');

	// ── Icons tab ────────────────────────────────────────────────────────────
	let iconTab = $state<'bad' | 'good'>('bad');

	// ── Auth tab & simulation ─────────────────────────────────────────────────
	let authMode = $state<'session' | 'jwt'>('session');
	let authResult = $state<string | null>(null);
	let authLoading = $state(false);

	async function simulateAuthCheck() {
		authLoading = true;
		authResult = null;
		await new Promise<void>((r) => setTimeout(r, 600));
		authResult =
			authMode === 'session'
				? 'Verified: locals.user = { id: "usr_demo", name: "SvelteKit Learner", role: "student" }'
				: 'Security Warning: JWT decoded — but if stolen, attacker keeps access until token expires!';
		authLoading = false;
	}

	// ── Image / CLS simulation ────────────────────────────────────────────────
	let imageTab = $state<'bad' | 'good'>('bad');
	let imageLoaded = $state(false);
	function replayImage() {
		imageLoaded = false;
		setTimeout(() => {
			imageLoaded = true;
		}, 800);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// CODE SAMPLE STRINGS
	// ─────────────────────────────────────────────────────────────────────────

	const a11yBad = `\x3csvelte:head>
  \x3ctitle>SvelteKit Course\x3c/title>
  \x3c!-- ❌ All 18 lessons share this exact same title. -->
\x3c/svelte:head>`;

	const a11yGood = `\x3c!-- In src/lib/components/LessonLayout.svelte -->
\x3csvelte:head>
  \x3ctitle>{lesson.title} — SvelteKit Course\x3c/title>
  \x3cmeta name="description" content={lesson.description} />
\x3c/svelte:head>`;

	const seoBad = `\x3c!-- ❌ BAD: only og:title, nothing else -->
\x3cmeta property="og:title" content="SvelteKit Interactive Course" />`;

	const seoGood = `\x3c!-- ✅ GOOD: Full setup in +layout.svelte -->
\x3csvelte:head>
  \x3ctitle>SvelteKit Course\x3c/title>
  \x3cmeta name="description" content="..." />
  \x3cmeta property="og:title" content="SvelteKit Interactive Course" />
  \x3cmeta property="og:description" content="..." />
  \x3cmeta property="og:type" content="website" />
\x3c/svelte:head>`;

	const perfBad = `\x3clink href="..." rel="stylesheet" />
\x3c!-- ❌ rel="stylesheet" is RENDER-BLOCKING. -->`;

	const perfGood = `\x3c!-- ✅ GOOD — non-blocking load -->
\x3clink rel="preload" as="style" href="..." onload="this.onload=null;this.rel='stylesheet'" />`;

	const perfNoscript = `\x3cnoscript>
  \x3clink href="..." rel="stylesheet" />
\x3c/noscript>`;

	const iconBad = `\x3cscript>
  import { HomeIcon, SearchIcon } from 'some-heavy-icon-lib';
\x3c/script>`;

	const iconGood = `\x3cscript>
  import { Home, Search, Bell } from 'lucide-svelte';
\x3c/script>`;

	const clsBad = `\x3cimg src="/hero.png" alt="Hero" />
\x3c!-- ❌ BAD: no dimensions → layout JUMPS down. -->`;

	const clsGood = `\x3cenhanced:img src="./hero.png" alt="Hero" />
\x3c!-- ✅ Sets dimensions automatically → CLS = 0 -->`;

	const codeSessionAuth = `export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get("session");
  if (sessionId) {
    event.locals.user = await db.getSession(sessionId);
  }
  return resolve(event);
};`;

	const codeJwtAuth = `export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get("token");
  if (token) {
    const payload = await verifyJwt(token);
    event.locals.user = { id: payload.sub };
  }
  return resolve(event);
};`;

	const authCode = $derived(authMode === 'session' ? codeSessionAuth : codeJwtAuth);
</script>

<LessonLayout
	{lesson}
	{prev}
	{next}
	whatItDoes="Demonstrates all 6 SvelteKit best practices with live before/after simulations — so you can SEE what breaks when a practice is skipped and what works when followed."
	whatFails="Without these: fonts block rendering, screen readers announce the wrong page, social shares show no description, icon libraries freeze Vite, images cause layout shift, and tokens can't be revoked."
>
	<!-- 1. ACCESSIBILITY -->
	<section class="mb-16">
		<h3 class="text-xl font-bold text-white mb-8 gap-3 flex items-center">
			<AlertCircle size={22} class="text-orange-400" />
			1. Accessibility — Navigation Context
		</h3>

		<div class="lg:grid-cols-2 gap-6 grid grid-cols-1">
			<div class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur space-y-6 border">
				<div
					class="gap-2 px-3 py-1 bg-red-500/10 border-red-500/20 flex w-fit items-center rounded-full border"
				>
					<XCircle size={14} class="text-red-400" />
					<span class="font-bold text-red-400 tracking-widest text-[10px] uppercase"
						>Generic title on every page</span
					>
				</div>
				<div class="p-6 rounded-xl bg-black/40 border-white/5 space-y-3 glass-blur border">
					<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
						>Screen Reader Output:</span
					>
					<p class="text-sm font-mono text-white/70 gap-2 flex items-center italic">
						<Clock size={14} class="text-white/20" />
						"SvelteKit Course... SvelteKit Course..."
					</p>
					<p class="text-red-400/60 leading-relaxed text-[11px]">
						User is lost. No confirmation that navigation worked.
					</p>
				</div>
				<CodeBlock code={a11yBad} lang="html" filename="+layout.svelte" />
			</div>

			<div class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur space-y-6 border">
				<div
					class="gap-2 px-3 py-1 bg-green-500/10 border-green-500/20 flex w-fit items-center rounded-full border"
				>
					<CheckCircle size={14} class="text-green-400" />
					<span class="font-bold text-green-400 tracking-widest text-[10px] uppercase"
						>Unique title from lesson metadata</span
					>
				</div>
				<div class="p-6 rounded-xl bg-black/40 border-white/5 space-y-3 glass-blur border">
					<span class="font-bold tracking-widest text-white/30 text-[10px] uppercase"
						>Screen Reader Output:</span
					>
					<p class="text-sm font-mono text-green-400 gap-2 flex items-center italic">
						<CheckCircle size={14} />
						"Introduction... Routing... Loading Data..."
					</p>
					<p class="text-green-400/60 leading-relaxed text-[11px]">
						Perfect. Screen reader announces the new reality immediately.
					</p>
				</div>
				<CodeBlock code={a11yGood} lang="html" filename="LessonLayout.svelte" />
			</div>
		</div>
	</section>

	<div class="bg-white/10 my-16 h-px"></div>

	<!-- 2. SEO -->
	<section class="mb-16">
		<h3 class="text-xl font-bold text-white mb-8 gap-3 flex items-center">
			<Globe size={22} class="text-blue-400" />
			2. SEO — Social Meta Tags & Sitemap
		</h3>

		<div class="p-1 bg-black/40 rounded-xl border-white/5 mb-8 glass-blur flex w-fit border">
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {seoTab ===
				'without'
					? 'bg-red-500/20 text-red-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => (seoTab = 'without')}
			>
				❌ Without OG tags
			</button>
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {seoTab ===
				'with'
					? 'bg-green-500/20 text-green-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => (seoTab = 'with')}
			>
				✅ With full SEO setup
			</button>
		</div>

		{#if seoTab === 'without'}
			<div
				class="p-8 rounded-xl border-red-500/20 bg-red-500/5 space-y-6 animate-fade-in glass-blur border"
			>
				<div class="p-6 rounded-xl bg-black/40 border-white/5 space-y-2 max-w-md glass-blur border">
					<div class="font-bold text-white/20 tracking-wider text-[10px] uppercase">
						sveltekit-course.dev
					</div>
					<div class="text-sm font-bold text-white/40">sveltekit-course.dev/lessons/01-intro</div>
					<div class="text-xs text-white/20 italic">No description available.</div>
				</div>
				<CodeBlock code={seoBad} lang="html" filename="+layout.svelte" />
			</div>
		{:else}
			<div
				class="p-8 rounded-xl border-green-500/20 bg-green-500/5 space-y-6 animate-fade-in glass-blur border"
			>
				<div
					class="p-6 rounded-xl bg-white/10 border-white/10 space-y-2 max-w-md shadow-2xl glass-blur border"
				>
					<div class="font-bold tracking-wider text-[10px] text-(--color-accent) uppercase">
						sveltekit-course.dev
					</div>
					<div class="text-sm font-bold text-white">SvelteKit Interactive Course</div>
					<div class="text-xs text-white/60 leading-relaxed">
						Master SvelteKit with 19 interactive lessons — routing, hooks, auth, SSR and more.
					</div>
				</div>
				<CodeBlock code={seoGood} lang="html" filename="SEO Setup" />
			</div>
		{/if}
	</section>

	<div class="bg-white/10 my-16 h-px"></div>

	<!-- 3. PERFORMANCE -->
	<section class="mb-16">
		<h3 class="text-xl font-bold text-white mb-8 gap-3 flex items-center">
			<Zap size={22} class="text-yellow-400" />
			3. Performance — Non-blocking Assets
		</h3>

		<div class="p-1 bg-black/40 rounded-xl border-white/5 mb-8 glass-blur flex w-fit border">
			{#each ['blocking', 'preload', 'noscript'] as t (t)}
				<button
					class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {fontTab ===
					t
						? 'bg-white/10 text-white shadow-lg'
						: 'text-white/40 hover:text-white/70'}"
					onclick={() => (fontTab = t as FontTab)}
				>
					{t}
				</button>
			{/each}
		</div>

		<div
			class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur space-y-8 animate-fade-in border"
		>
			{#if fontTab === 'blocking'}
				<div class="space-y-4">
					<div class="space-y-3">
						<div
							class="font-bold tracking-widest text-white/30 flex items-center justify-between text-[10px] uppercase"
						>
							<span>Page render progress</span>
							<span class="text-red-400">Blocked</span>
						</div>
						<div
							class="h-2 bg-black/40 border-white/5 relative w-full overflow-hidden rounded-full border"
						>
							<div class="bg-red-500/40 h-full w-[40%]"></div>
							<div
								class="inset-0 font-bold text-white tracking-tighter absolute flex items-center justify-center text-[8px] uppercase"
							>
								⛔ Waiting for font (~80KB)
							</div>
						</div>
					</div>
					<CodeBlock code={perfBad} lang="html" filename="Blocking load" />
				</div>
			{:else if fontTab === 'preload'}
				<div class="space-y-4">
					<div class="space-y-3">
						<div
							class="font-bold tracking-widest text-white/30 flex items-center justify-between text-[10px] uppercase"
						>
							<span>Page render progress</span>
							<span class="text-green-400">100%</span>
						</div>
						<div class="h-2 bg-black/40 border-white/5 w-full overflow-hidden rounded-full border">
							<div class="bg-green-500 h-full w-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
						</div>
					</div>
					<CodeBlock code={perfGood} lang="html" filename="app.html" />
				</div>
			{:else}
				<div class="space-y-4">
					<CodeBlock code={perfNoscript} lang="html" filename="app.html (Full)" />
				</div>
			{/if}
		</div>
	</section>

	<div class="bg-white/10 my-16 h-px"></div>

	<!-- 4. ICONS -->
	<section class="mb-16">
		<h3 class="text-xl font-bold text-white mb-8 gap-3 flex items-center">
			<Palette size={22} class="text-purple-400" />
			4. Icons — Optimized ESM Components
		</h3>

		<div class="p-1 bg-black/40 rounded-xl border-white/5 mb-8 glass-blur flex w-fit border">
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {iconTab ===
				'bad'
					? 'bg-red-500/20 text-red-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => (iconTab = 'bad')}
			>
				❌ Heavy Lib
			</button>
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {iconTab ===
				'good'
					? 'bg-green-500/20 text-green-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => (iconTab = 'good')}
			>
				✅ Lucide ESM
			</button>
		</div>

		<div
			class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur space-y-8 animate-fade-in border"
		>
			{#if iconTab === 'bad'}
				<div class="space-y-6">
					<div class="p-6 rounded-xl bg-black/40 border-white/5 space-y-4 glass-blur border">
						<div class="h-1.5 bg-white/5 w-full overflow-hidden rounded-full">
							<div class="bg-red-500 h-full w-full origin-left animate-[shimmer_2s_infinite]"></div>
						</div>
						<p class="text-xs text-white/50 leading-relaxed font-mono">
							Vite pre-bundling: scanning <strong class="text-red-400">4,800 .svelte files</strong
							>...<br />
							<span class="text-white/30 text-[10px] italic">Cold start delay: ~12s</span>
						</p>
					</div>
					<CodeBlock code={iconBad} lang="svelte" filename="Individual Icons" />
				</div>
			{:else}
				<div class="space-y-6">
					<div class="p-6 rounded-xl bg-black/40 border-white/5 space-y-4 glass-blur border">
						<div class="h-1.5 bg-white/5 w-full overflow-hidden rounded-full">
							<div class="bg-green-500 h-full w-[2%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
						</div>
						<p class="text-xs text-white/50 leading-relaxed font-mono">
							Vite: <strong class="text-green-400">3 components imported.</strong><br />
							<span class="text-white/30 text-[10px] italic">Zero overhead via tree-shaking.</span>
						</p>
					</div>
					<div
						class="gap-8 p-4 rounded-xl bg-white/5 border-white/5 glass-blur flex w-fit items-center border"
					>
						// eslint-disable-next-line svelte/require-each-key
						{#each [Home, Search, Bell] as I (I)}
							<div class="gap-2 flex flex-col items-center">
								<div class="p-3 rounded-lg bg-white/5 text-(--color-accent)">
									<I size={24} />
								</div>
								<span class="text-white/30 font-bold tracking-widest text-[10px] uppercase"
									>{I.name}</span
								>
							</div>
						{/each}
					</div>
					<CodeBlock code={iconGood} lang="svelte" filename="Lucide Icons" />
				</div>
			{/if}
		</div>
	</section>

	<div class="bg-white/10 my-16 h-px"></div>

	<!-- 5. IMAGES -->
	<section class="mb-16">
		<h3 class="text-xl font-bold text-white mb-8 gap-3 flex items-center">
			<Image size={22} class="text-pink-400" />
			5. Images — Preventing Layout Shift
		</h3>

		<div class="p-1 bg-black/40 rounded-xl border-white/5 mb-8 glass-blur flex w-fit border">
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {imageTab ===
				'bad'
					? 'bg-red-500/20 text-red-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => {
					imageTab = 'bad';
					replayImage();
				}}
			>
				❌ No dimensions
			</button>
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {imageTab ===
				'good'
					? 'bg-green-500/20 text-green-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => {
					imageTab = 'good';
					replayImage();
				}}
			>
				✅ Fixed height
			</button>
		</div>

		<div
			class="p-8 rounded-xl border-white/10 bg-white/5 glass-blur space-y-8 animate-fade-in min-h-[500px] border"
		>
			<div class="space-y-4">
				<p class="text-sm text-white/70 leading-relaxed border-white/10 pl-4 border-l-2 italic">
					"Here is your article intro paragraph. In a few moments, an image will load below this
					text..."
				</p>

				{#if imageTab === 'bad'}
					<div class="space-y-4">
						{#if !imageLoaded}
							<div
								class="p-4 rounded-xl bg-red-500/5 border-red-500/10 text-red-400/50 text-xs gap-2 glass-blur flex items-center border"
							>
								<Clock size={14} class="animate-spin" />
								Image loading (0px height reserved)...
							</div>
						{:else}
							<div
								class="p-8 rounded-xl bg-white/5 border-white/10 gap-4 animate-scale-in glass-blur flex flex-col items-center justify-center border"
							>
								<Image size={32} class="text-red-400" />
								<p
									class="text-xs text-red-400 font-bold tracking-widest gap-2 flex items-center uppercase"
								>
									<AlertTriangle size={16} />
									Layout Shifted!
								</p>
							</div>
						{/if}
						<p class="text-sm text-white/40 {imageLoaded ? 'animate-fade-in' : ''}">
							This text jumps down when the image loads — that's CLS!
						</p>
					</div>
				{:else}
					<div class="space-y-4">
						<div
							class="h-48 rounded-xl bg-white/5 border-white/10 gap-4 glass-blur relative flex w-full flex-col items-center justify-center overflow-hidden border"
						>
							{#if !imageLoaded}
								<div
									class="text-white/20 font-bold tracking-widest gap-2 flex items-center text-[10px] uppercase"
								>
									<Clock size={14} class="animate-spin" />
									Reserved 192px
								</div>
							{:else}
								<Image size={32} class="text-green-400 animate-scale-in" />
								<p
									class="text-xs text-green-400 font-bold tracking-widest gap-2 flex items-center uppercase"
								>
									<CheckCircle size={16} />
									Zero Shift
								</p>
							{/if}
						</div>
						<p class="text-sm text-white/40">
							This text stays exactly in place. CLS = 0. Smooth and predictable.
						</p>
					</div>
				{/if}
			</div>

			<div
				class="pt-6 border-white/5 sm:flex-row gap-6 flex flex-col items-center justify-between border-t"
			>
				<button
					class="gap-2 px-4 py-2 rounded-lg bg-white/5 border-white/10 text-white/70 font-bold tracking-widest hover:bg-white/10 flex items-center border text-[10px] uppercase transition-all"
					onclick={replayImage}
				>
					<RotateCcw size={14} />
					Replay Simulation
				</button>
				<CodeBlock
					code={imageTab === 'bad' ? clsBad : clsGood}
					lang="html"
					filename={imageTab === 'bad' ? 'Unoptimized' : '@sveltejs/enhanced-img'}
				/>
			</div>
		</div>
	</section>

	<div class="bg-white/10 my-16 h-px"></div>

	<!-- 6. AUTH -->
	<section class="mb-16">
		<h3 class="text-xl font-bold text-white mb-8 gap-3 flex items-center">
			<Lock size={22} class="text-cyan-400" />
			6. Auth — Sessions vs JWT & locals
		</h3>

		<div class="p-1 bg-black/40 rounded-xl border-white/5 mb-8 glass-blur flex w-fit border">
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {authMode ===
				'session'
					? 'bg-green-500/20 text-green-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => {
					authMode = 'session';
					authResult = null;
				}}
			>
				✅ Sessions
			</button>
			<button
				class="px-4 py-2 rounded-lg font-bold tracking-widest text-[10px] uppercase transition-all {authMode ===
				'jwt'
					? 'bg-yellow-500/20 text-yellow-400'
					: 'text-white/40 hover:text-white/70'}"
				onclick={() => {
					authMode = 'jwt';
					authResult = null;
				}}
			>
				<TriangleAlert size={14} class="text-yellow-400" /> JWT
			</button>
		</div>

		<div
			class="p-8 rounded-xl border {authMode === 'session'
				? 'border-green-500/20 bg-green-500/5'
				: 'border-yellow-500/20 bg-yellow-500/5'} space-y-8 animate-fade-in"
		>
			<div class="md:flex-row md:items-center gap-6 flex flex-col justify-between">
				<div class="space-y-2">
					<p class="text-xs text-white/50 leading-relaxed max-w-md">
						{#if authMode === 'session'}
							Instant revocation possible via DB lookup. Most secure for most SvelteKit apps.
						{:else}
							Cannot be revoked until expiry. Faster but requires complex "allowlisting" for
							security.
						{/if}
					</p>
				</div>

				<button
					class="px-6 py-3 rounded-xl bg-white/10 border-white/10 text-white font-bold text-xs hover:bg-white/20 gap-2 glass-blur flex items-center border transition-all disabled:opacity-30"
					onclick={simulateAuthCheck}
					disabled={authLoading}
				>
					{#if authLoading}
						<Clock size={16} class="animate-spin" />
						<span>Verifying...</span>
					{:else}
						<Play size={16} />
						<span>Simulate Auth Check</span>
					{/if}
				</button>
			</div>

			{#if authResult}
				<div
					class="p-6 rounded-xl bg-black/40 border {authMode === 'session'
						? 'border-green-500/20 text-green-400'
						: 'border-yellow-500/20 text-yellow-400'} font-mono text-xs animate-fade-in"
				>
					{authResult}
				</div>
			{/if}

			<CodeBlock code={authCode} lang="typescript" filename="hooks.server.ts" />
		</div>
	</section>
</LessonLayout>
