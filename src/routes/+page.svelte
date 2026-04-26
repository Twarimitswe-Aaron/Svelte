<!--
  routes/+page.svelte — Home / Landing page

  WHY: This is the first thing learners see. It needs to be visually compelling
       and clearly communicate what the course offers.
  WHAT FAILS WITHOUT +page.svelte: The "/" route returns 404 — SvelteKit only
       renders routes that have a +page.svelte (or +server.ts) file.
-->
<script lang="ts">
	import { lessons } from '$lib/lessons.js';
	import LessonIcon from '$lib/components/LessonIcon.svelte';
	import Rocket from 'lucide-svelte/icons/rocket';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import Zap from 'lucide-svelte/icons/zap';
	import Gamepad2 from 'lucide-svelte/icons/gamepad-2';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import Monitor from 'lucide-svelte/icons/monitor';
	import CheckCircle from 'lucide-svelte/icons/check-circle';

	const tagColors: Record<string, string> = {
		'getting-started': 'badge-green',
		core: 'badge-blue',
		advanced: 'badge-purple'
	};
</script>

<svelte:head>
	<title>SvelteKit Interactive Course — Learn by Building</title>
	<meta
		name="description"
		content="Master SvelteKit from routing to hooks with interactive live demos in every lesson."
	/>
</svelte:head>

<div class="pb-16">
	<!-- Hero section -->
	<section
		class="relative px-8 py-16 text-center before:pointer-events-none before:absolute before:left-1/2 before:top-0 before:h-[300px] before:w-[600px] before:-translate-x-1/2 before:bg-[radial-gradient(ellipse_at_center_top,rgba(88,166,255,0.12)_0%,transparent_70%)] before:content-[''] md:py-12"
	>
		<div class="mb-6">
			<span class="badge badge-purple">v2 · Svelte 5 Runes</span>
		</div>
		<h1 class="mb-5 text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.15]">
			Learn <span class="gradient-text">SvelteKit</span><br />
			by Building Real Things
		</h1>
		<p class="mx-auto mb-8 max-w-[580px] text-[1.05rem] leading-[1.75] text-[var(--color-text-muted)]">
			20 interactive lessons covering everything from core routing to advanced features like
			Remote Functions, Shallow Routing, and Unit Testing. Every lesson includes a live demo and
			explains exactly what breaks without it.
		</p>
		<div class="mb-10 flex flex-wrap justify-center gap-3">
			<a href="/lessons/01-intro" class="btn btn-primary animate-pulse-glow px-6 py-3 text-base">
				<Rocket size={18} /> Start with Lesson 1
			</a>
			<a
				href="https://svelte.dev/docs/kit"
				target="_blank"
				rel="noreferrer"
				class="btn btn-secondary px-6 py-3 text-base"
			>
				<BookOpen size={18} /> Official Docs <ExternalLink size={14} class="opacity-50" />
			</a>
		</div>

		<!-- Stats row -->
		<div class="flex flex-wrap items-center justify-center gap-6">
			<div class="text-center">
				<span class="block text-2xl font-extrabold text-[var(--color-text)]">20</span>
				<span class="text-[0.75rem] text-[var(--color-text-muted)]">Lessons</span>
			</div>
			<div class="h-8 w-px bg-[var(--color-border)]"></div>
			<div class="text-center">
				<span class="block text-2xl font-extrabold text-[var(--color-text)]">Live</span>
				<span class="text-[0.75rem] text-[var(--color-text-muted)]">Demos in every lesson</span>
			</div>
			<div class="h-8 w-px bg-[var(--color-border)]"></div>
			<div class="text-center">
				<span class="block text-2xl font-extrabold text-[var(--color-text)]">100%</span>
				<span class="text-[0.75rem] text-[var(--color-text-muted)]">SvelteKit docs coverage</span>
			</div>
		</div>
	</section>

	<!-- Lesson grid -->
	<section class="p-8">
		<h2 class="mb-6 text-[1.3rem] font-extrabold text-[var(--color-text)]">Course Curriculum</h2>
		<div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
			{#each lessons as lesson}
				<a
					href="/lessons/{lesson.slug}"
					class="group flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text)] no-underline transition-all hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
				>
					<div class="mb-3 flex items-start justify-between">
						<LessonIcon name={lesson.icon} size={28} class="text-[var(--color-accent)]" />
						<div
							class="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[0.7rem] font-bold text-[var(--color-text-muted)]"
						>
							#{lesson.id}
						</div>
					</div>
					<h3 class="mb-2 text-[0.95rem] font-bold">{lesson.title}</h3>
					<p
						class="mb-4 flex-1 line-clamp-3 text-[0.8rem] leading-relaxed text-[var(--color-text-muted)]"
					>
						{lesson.description}
					</p>
					<div class="flex items-center justify-between">
						<span class="badge {tagColors[lesson.tags[0]]}">{lesson.tags[0]}</span>
						<span class="text-base text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]">→</span>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- How it works -->
	<section class="mt-4 border-t border-[var(--color-border)] p-8">
		<h2 class="mb-6 text-[1.3rem] font-extrabold text-[var(--color-text)]">How This Works</h2>
		<div class="grid gap-4 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
			<div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
				<div class="mb-3 text-[1.75rem]"><BookOpen size={28} color="var(--color-accent)" /></div>
				<h3 class="mb-1.5 text-[0.9rem] font-bold">Read the Concept</h3>
				<p class="m-0 text-[0.8rem] leading-relaxed text-[var(--color-text-muted)]">
					Each lesson explains the SvelteKit feature, what it does, and links to the official docs.
				</p>
			</div>
			<div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
				<div class="mb-3 text-[1.75rem]"><Gamepad2 size={28} color="var(--color-accent)" /></div>
				<h3 class="mb-1.5 text-[0.9rem] font-bold">Use the Live Demo</h3>
				<p class="m-0 text-[0.8rem] leading-relaxed text-[var(--color-text-muted)]">
					Interact with running SvelteKit code right in the browser — no sandboxes, this is the real
					app.
				</p>
			</div>
			<div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
				<div class="mb-3 text-[1.75rem]"><AlertTriangle size={28} color="#d29922" /></div>
				<h3 class="mb-1.5 text-[0.9rem] font-bold">Understand the Failure Mode</h3>
				<p class="m-0 text-[0.8rem] leading-relaxed text-[var(--color-text-muted)]">
					Every lesson tells you exactly what breaks if you skip or misuse the feature — the most
					important part of learning.
				</p>
			</div>
			<div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
				<div class="mb-3 text-[1.75rem]"><Monitor size={28} color="var(--color-accent)" /></div>
				<h3 class="mb-1.5 text-[0.9rem] font-bold">Read the Code</h3>
				<p class="m-0 text-[0.8rem] leading-relaxed text-[var(--color-text-muted)]">
					All source files are annotated with comments. Open DevTools or the source to see exactly
					how each demo works.
				</p>
			</div>
		</div>
	</section>

	<!-- Comparison with React/Next.js -->
	<section class="mt-4 border-t border-[var(--color-border)] p-8">
		<h2 class="mb-8 text-center text-[1.4rem] font-extrabold text-[var(--color-text)]">SvelteKit vs React & Next.js</h2>
		
		<div class="grid gap-6 md:grid-cols-2">
			<!-- Advantages -->
			<div class="rounded-xl border border-[rgba(63,185,80,0.4)] bg-[rgba(63,185,80,0.05)] p-6 transition-transform hover:-translate-y-1">
				<h3 class="mb-5 flex items-center gap-2 text-[1.1rem] font-bold text-[var(--color-success)]">
					<CheckCircle size={20} /> Advantages
				</h3>
				<ul class="m-0 flex flex-col gap-4 pl-0 text-[0.85rem] leading-relaxed text-[var(--color-text-muted)]">
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]"></div>
						<span><strong>No Virtual DOM:</strong> Svelte compiles to highly efficient vanilla JavaScript, resulting in less overhead and faster runtime performance than React.</span>
					</li>
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]"></div>
						<span><strong>Smaller Bundle Sizes:</strong> You ship only the code you need, making initial load times incredibly fast.</span>
					</li>
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]"></div>
						<span><strong>Simpler State Management:</strong> With Svelte 5 Runes (<code>$state</code>, <code>$derived</code>), reactivity is native, intuitive, and doesn't require hooks or complex dependency arrays.</span>
					</li>
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]"></div>
						<span><strong>Built-in Features:</strong> Form actions, routing, and data loading come seamlessly integrated out of the box, unlike React where you piece together routers and form libraries.</span>
					</li>
				</ul>
			</div>

			<!-- Drawbacks -->
			<div class="rounded-xl border border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.05)] p-6 transition-transform hover:-translate-y-1">
				<h3 class="mb-5 flex items-center gap-2 text-[1.1rem] font-bold text-[var(--color-danger)]">
					<AlertTriangle size={20} /> Drawbacks
				</h3>
				<ul class="m-0 flex flex-col gap-4 pl-0 text-[0.85rem] leading-relaxed text-[var(--color-text-muted)]">
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-danger)]"></div>
						<span><strong>Smaller Ecosystem:</strong> React has a massive library of third-party components. With Svelte, you might occasionally need to build custom wrappers for JS libraries, though it's usually very easy.</span>
					</li>
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-danger)]"></div>
						<span><strong>Job Market:</strong> While growing rapidly, Svelte enterprise adoption is smaller compared to React and Next.js, meaning fewer immediate job openings.</span>
					</li>
					<li class="flex items-start gap-3">
						<div class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-danger)]"></div>
						<span><strong>SvelteKit Conventions:</strong> While Svelte itself is incredibly easy, understanding SvelteKit's specific file-system routing conventions (<code>+page</code> vs <code>+page.server</code> vs <code>+layout</code>) takes a small paradigm shift compared to Next.js.</span>
					</li>
				</ul>
			</div>
		</div>
	</section>
</div>

