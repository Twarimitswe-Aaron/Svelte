<!--
  Lesson 20 — Testing with Vitest
  ════════════════════════════════════════════════
  CONCEPT: Testing is vital for reliability. SvelteKit defaults to Vitest
  for unit tests and Playwright for E2E tests.
-->
<script lang="ts">
  import LessonLayout from '$lib/components/LessonLayout.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
  import { lessons, getAdjacentLessons } from '$lib/lessons.js';
  import TestTube from 'lucide-svelte/icons/test-tube';
  import CheckCircle from 'lucide-svelte/icons/check-circle';
  import Play from 'lucide-svelte/icons/play';
  import AlertCircle from 'lucide-svelte/icons/alert-circle';

  const lesson = lessons[19]; // Lesson 20
  const { prev, next } = getAdjacentLessons(lesson.slug);

  let testResult = $state<'idle' | 'running' | 'success' | 'fail'>('idle');

  async function runSimulatedTest() {
    testResult = 'running';
    await new Promise(r => setTimeout(r, 800));
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
  <section class="test-section">
    <h3 class="test-heading"><TestTube size={18} /> Basic Unit Test</h3>
    <p>Testing a plain TypeScript function is the simplest way to start. We import <code>describe</code>, <code>it</code>, and <code>expect</code> from Vitest.</p>
    
    <div class="side-by-side">
      <CodeBlock code={greetCode} lang="typescript" filename="greet.ts" />
      <CodeBlock code={specCode} lang="typescript" filename="greet.spec.ts" />
    </div>

    <div class="sim-box">
      <button class="btn btn-primary" onclick={runSimulatedTest} disabled={testResult === 'running'}>
        {#if testResult === 'running'}
          Running vitest...
        {:else}
          <Play size={14} /> Run Test Simulation
        {/if}
      </button>

      {#if testResult === 'success'}
        <div class="result-box success animate-fade-in">
          <CheckCircle size={16} /> <strong>PASS</strong> src/lib/greet.spec.ts
          <div class="stats">✓ greet > returns a greeting (2ms)</div>
        </div>
      {/if}
    </div>
  </section>

  <section class="test-section">
    <h3 class="test-heading"><TestTube size={18} /> Component Testing</h3>
    <p>To test Svelte components, we use <code>@testing-library/svelte</code>. It allows us to render components in a simulated DOM and query for elements just like a user would.</p>
    <CodeBlock code={svelteSpecCode} lang="typescript" filename="Welcome.spec.ts" />
    
    <div class="note-box">
      <AlertCircle size={18} />
      <div>
        <strong>Pro Tip:</strong> Use <code>npm run test:unit</code> to run Vitest in watch mode while developing.
      </div>
    </div>
  </section>
</LessonLayout>

<style>
  .test-section { margin-bottom: 2.5rem; }
  .test-heading {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.5rem;
  }

  .side-by-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .side-by-side { grid-template-columns: 1fr; }
  }

  .sim-box {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .result-box {
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.85rem;
  }

  .result-box.success {
    background: rgba(63, 185, 80, 0.1);
    border: 1px solid rgba(63, 185, 80, 0.3);
    color: var(--color-success);
  }

  .stats { margin-top: 0.5rem; color: var(--color-text-muted); padding-left: 1.5rem; }

  .note-box {
    display: flex;
    gap: 0.75rem;
    background: rgba(88, 166, 255, 0.1);
    border: 1px solid rgba(88, 166, 255, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .note-box strong { color: var(--color-accent); }
</style>
