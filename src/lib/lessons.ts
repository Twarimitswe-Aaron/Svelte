/**
 * lessons.ts — Central registry of all learning modules.
 *
 * WHY: A single source of truth means both the sidebar and individual pages
 *      can reference the same metadata without duplication. Add a new lesson
 *      here and it automatically appears in the nav.
 *
 * WHAT FAILS WITHOUT IT: Each page would hardcode its neighbour links and
 *      the sidebar would need to be manually maintained in the layout file.
 */

export interface Lesson {
  id: number;
  slug: string;         // matches src/routes/lessons/[slug]
  title: string;
  emoji: string;
  description: string;
  docUrl: string;
  tags: string[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    slug: '01-intro',
    emoji: '🏗️',
    title: 'Introduction & Project Structure',
    description: 'Understand what SvelteKit is, how it differs from plain Svelte, and explore every file in a project.',
    docUrl: 'https://svelte.dev/docs/kit/introduction',
    tags: ['getting-started']
  },
  {
    id: 2,
    slug: '02-routing',
    emoji: '🗺️',
    title: 'Routing',
    description: 'File-based routing using +page.svelte, +layout.svelte, dynamic [param] segments, and the +error.svelte boundary.',
    docUrl: 'https://svelte.dev/docs/kit/routing',
    tags: ['core']
  },
  {
    id: 3,
    slug: '03-loading-data',
    emoji: '📡',
    title: 'Loading Data',
    description: 'Server-only load(), universal load(), params, streaming with #await blocks, and parent data.',
    docUrl: 'https://svelte.dev/docs/kit/load',
    tags: ['core']
  },
  {
    id: 4,
    slug: '04-form-actions',
    emoji: '📝',
    title: 'Form Actions',
    description: 'Default & named actions, anatomy of an action, validation errors, use:enhance for progressive enhancement.',
    docUrl: 'https://svelte.dev/docs/kit/form-actions',
    tags: ['core']
  },
  {
    id: 5,
    slug: '05-page-options',
    emoji: '⚙️',
    title: 'Page Options',
    description: 'Control rendering modes: prerender, ssr, csr, and trailingSlash — and know when to use each.',
    docUrl: 'https://svelte.dev/docs/kit/page-options',
    tags: ['core']
  },
  {
    id: 6,
    slug: '06-state-management',
    emoji: '🔄',
    title: 'State Management',
    description: 'Context API, URL state, component state preservation, and ephemeral snapshot storage.',
    docUrl: 'https://svelte.dev/docs/kit/state-management',
    tags: ['core']
  },
  {
    id: 7,
    slug: '07-advanced-routing',
    emoji: '🔀',
    title: 'Advanced Routing',
    description: 'Rest params, optional params, route matchers, layout groups with (group) notation, and breaking out of layouts.',
    docUrl: 'https://svelte.dev/docs/kit/advanced-routing',
    tags: ['advanced']
  },
  {
    id: 8,
    slug: '08-hooks',
    emoji: '🪝',
    title: 'Hooks',
    description: 'Server hooks: handle, handleError, handleFetch, locals. Universal hooks: reroute, transport.',
    docUrl: 'https://svelte.dev/docs/kit/hooks',
    tags: ['advanced']
  },
  {
    id: 9,
    slug: '09-errors',
    emoji: '🚨',
    title: 'Error Handling',
    description: 'Expected errors with error(), unexpected errors, +error.svelte pages, and the handleError hook.',
    docUrl: 'https://svelte.dev/docs/kit/errors',
    tags: ['advanced']
  },
  {
    id: 10,
    slug: '10-api-routes',
    emoji: '🌐',
    title: 'API / Server Routes',
    description: 'Create REST endpoints with +server.ts. Handle GET, POST, DELETE and understand content negotiation.',
    docUrl: 'https://svelte.dev/docs/kit/routing#server',
    tags: ['advanced']
  },
  {
    id: 11,
    slug: '11-remote-functions',
    emoji: '⚡',
    title: 'Remote Functions',
    description: 'query, form, command, and prerender from $app/server — server logic callable directly from components via auto-generated HTTP endpoints.',
    docUrl: 'https://svelte.dev/docs/kit/remote-functions',
    tags: ['advanced']
  }
];

/** Returns the previous and next lessons for navigation arrows */
export function getAdjacentLessons(currentSlug: string) {
  const idx = lessons.findIndex(l => l.slug === currentSlug);
  return {
    prev: idx > 0 ? lessons[idx - 1] : null,
    next: idx < lessons.length - 1 ? lessons[idx + 1] : null,
    current: lessons[idx] ?? null
  };
}
