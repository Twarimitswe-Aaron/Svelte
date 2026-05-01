<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { lessons, getAdjacentLessons } from '$lib/lessons.js';
  import LessonIcon from '$lib/components/LessonIcon.svelte';
  import CheckCircle from 'lucide-svelte/icons/check-circle';
  import Play from 'lucide-svelte/icons/play';
  import AlertCircle from 'lucide-svelte/icons/alert-circle';
  import Clock from 'lucide-svelte/icons/clock';

  const lesson = lessons[20]; // Lesson 21
  const { prev, next } = getAdjacentLessons(lesson.slug);

  let testResult = $state<'idle' | 'running' | 'success' | 'fail'>('idle');

  async function runSimulatedTest() {
    testResult = 'running';
    await new Promise(r => setTimeout(r, 1200));
    testResult = 'success';
  }

  const greetCode = `export function greet(name: string): string {
  return 'Hello, ' + name + '!';
}`;

  const specCode = `import { describe, it, expect } from 'vitest';
import { greet } from './greet';

describe('greet', () => {
  it('returns a greeting', () => {
    expect(greet('Svelte')).toBe('Hello, Svelte!');
  });
});`;

  const svelteSpecCode = `import { render, screen } from '@testing-library/svelte';
import Welcome from './Welcome.svelte';

it('renders "Welcome to SvelteKit"', () => {
  render(Welcome);
  expect(screen.getByText(/Welcome to SvelteKit/i)).toBeInTheDocument();
});`;
</script>

<LessonLayout
  {lesson}
  {prev}
  {next}
   whatItDoes="Vitest is a blazing fast unit test framework powered by Vite. It allows you to test pure logic (functions) and Svelte components in isolation, ensuring your core app behavior stays correct as you refactor."
   whatFails="Without tests, you rely on manual browser clicking to catch bugs. As your SvelteKit app grows, manual testing becomes impossible, and regressions (bugs that reappear) will inevitably reach production."
>
  <section class="mb-16">
    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
      <LessonIcon name="TestTube" size={20} class="text-green-400" />
      Basic Unit Test
    </h3>
    <p class="text-sm text-white/70 leading-relaxed mb-8">
      Testing a plain TypeScript function is the simplest way to start. We import <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">describe</code>, <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">it</code>, and <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">expect</code> from Vitest.
    </p>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      <CodeBlock code={greetCode} lang="typescript" filename="greet.ts" />
      <CodeBlock code={specCode} lang="typescript" filename="greet.spec.ts" />
    </div>

    <!-- Test Simulation -->
    <div class="p-8 rounded-xl border border-white/10 bg-white/5 space-y-6 relative overflow-hidden">
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div class="flex items-center justify-between relative z-10">
        <button 
          class="px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all flex items-center gap-2 disabled:opacity-30" 
          onclick={runSimulatedTest} 
          disabled={testResult === 'running'}
        >
          {#if testResult === 'running'}
            <Clock size={16} class="animate-spin" />
            <span>Running Vitest...</span>
          {:else}
            <Play size={16} />
            <span>Run Test Simulation</span>
          {/if}
        </button>

        <div class="flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full {testResult === 'success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-white/20'}"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-white/30">Vitest Runner</span>
        </div>
      </div>

      {#if testResult === 'success'}
        <div class="p-6 rounded-xl bg-black/40 border border-green-500/20 space-y-3 animate-fade-in relative z-10">
          <div class="flex items-center gap-2 text-green-400">
            <CheckCircle size={16} />
            <span class="text-xs font-bold uppercase tracking-widest">PASS</span>
            <span class="text-xs font-mono opacity-60">src/lib/greet.spec.ts</span>
          </div>
          <div class="pl-6 border-l border-white/10 text-[11px] text-white/50 space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-green-500">✓</span>
              <span>greet &gt; returns a greeting (2ms)</span>
            </div>
            <div class="pt-2 text-[10px] uppercase tracking-tighter opacity-30">Test Files: 1 passed, 1 total</div>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <div class="h-px bg-white/10 my-16"></div>

  <section class="mb-16">
    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
      <LessonIcon name="Component" size={20} class="text-blue-400" />
      Component Testing
    </h3>
    <p class="text-sm text-white/70 leading-relaxed mb-8">
      To test Svelte components, we use <code class="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-xs">@testing-library/svelte</code>. It allows us to render components in a simulated DOM and query for elements just like a user would.
    </p>
    <CodeBlock code={svelteSpecCode} lang="typescript" filename="Welcome.spec.ts" />
    
    <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex gap-4">
      <div class="p-2 rounded-lg bg-(--color-accent)/10 text-(--color-accent) h-fit">
        <AlertCircle size={18} />
      </div>
      <div>
        <strong class="text-sm text-white block mb-1 uppercase tracking-widest text-[10px]">Pro Tip</strong>
        <p class="text-xs text-white/50 leading-relaxed">
          Use <code class="px-1 py-0.5 rounded bg-white/10 text-white font-mono">npm run test:unit</code> to run Vitest in watch mode while developing. This provides instant feedback as you save files.
        </p>
      </div>
    </div>
  </section>
</LessonLayout>

