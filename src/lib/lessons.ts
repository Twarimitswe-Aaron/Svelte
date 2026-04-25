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
  icon: string;         // Lucide-svelte icon name
  description: string;
  docUrl: string;
  tags: string[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    slug: '01-intro',
    icon: 'Construction',
    title: 'Introduction & Project Structure',
    description: 'Understand what SvelteKit is, how it differs from plain Svelte, and explore every file in a project.',
    docUrl: 'https://svelte.dev/docs/kit/introduction',
    tags: ['getting-started']
  },
  {
    id: 2,
    slug: '02-routing',
    icon: 'Map',
    title: 'Routing',
    description: 'File-based routing using +page.svelte, +layout.svelte, dynamic [param] segments, and the +error.svelte boundary.',
    docUrl: 'https://svelte.dev/docs/kit/routing',
    tags: ['core']
  },
  {
    id: 3,
    slug: '03-loading-data',
    icon: 'Satellite',
    title: 'Loading Data',
    description: 'Server-only load(), universal load(), params, streaming with #await blocks, and parent data.',
    docUrl: 'https://svelte.dev/docs/kit/load',
    tags: ['core']
  },
  {
    id: 4,
    slug: '04-form-actions',
    icon: 'FileText',
    title: 'Form Actions',
    description: 'Default & named actions, anatomy of an action, validation errors, use:enhance for progressive enhancement.',
    docUrl: 'https://svelte.dev/docs/kit/form-actions',
    tags: ['core']
  },
  {
    id: 5,
    slug: '05-page-options',
    icon: 'Settings',
    title: 'Page Options',
    description: 'Control rendering modes: prerender, ssr, csr, and trailingSlash — and know when to use each.',
    docUrl: 'https://svelte.dev/docs/kit/page-options',
    tags: ['core']
  },
  {
    id: 6,
    slug: '06-state-management',
    icon: 'RefreshCcw',
    title: 'State Management',
    description: 'Context API, URL state, component state preservation, and ephemeral snapshot storage.',
    docUrl: 'https://svelte.dev/docs/kit/state-management',
    tags: ['core']
  },
  {
    id: 7,
    slug: '07-advanced-routing',
    icon: 'Shuffle',
    title: 'Advanced Routing',
    description: 'Rest params, optional params, route matchers, layout groups with (group) notation, and breaking out of layouts.',
    docUrl: 'https://svelte.dev/docs/kit/advanced-routing',
    tags: ['advanced']
  },
  {
    id: 8,
    slug: '08-hooks',
    icon: 'Anchor',
    title: 'Hooks',
    description: 'Server hooks: handle, handleError, handleFetch, locals. Universal hooks: reroute, transport.',
    docUrl: 'https://svelte.dev/docs/kit/hooks',
    tags: ['advanced']
  },
  {
    id: 9,
    slug: '09-errors',
    icon: 'AlertCircle',
    title: 'Error Handling',
    description: 'Expected errors with error(), unexpected errors, +error.svelte pages, and the handleError hook.',
    docUrl: 'https://svelte.dev/docs/kit/errors',
    tags: ['advanced']
  },
  {
    id: 10,
    slug: '10-api-routes',
    icon: 'Globe',
    title: 'API / Server Routes',
    description: 'Create REST endpoints with +server.ts. Handle GET, POST, DELETE and understand content negotiation.',
    docUrl: 'https://svelte.dev/docs/kit/routing#server',
    tags: ['advanced']
  },
  {
    id: 11,
    slug: '11-remote-functions',
    icon: 'Zap',
    title: 'Remote Functions',
    description: 'query, form, command, and prerender from $app/server — server logic callable directly from components via auto-generated HTTP endpoints.',
    docUrl: 'https://svelte.dev/docs/kit/remote-functions',
    tags: ['advanced']
  },
  {
    id: 12,
    slug: '12-link-options',
    icon: 'Link',
    title: 'Link Options',
    description: 'Preloading data, code, or disabling scroll on links using data-sveltekit-* attributes.',
    docUrl: 'https://svelte.dev/docs/kit/link-options',
    tags: ['advanced']
  },
  {
    id: 13,
    slug: '13-service-workers',
    icon: 'Wrench',
    title: 'Service Workers',
    description: 'Offline support and caching using SvelteKit service workers.',
    docUrl: 'https://svelte.dev/docs/kit/service-workers',
    tags: ['advanced']
  },
  {
    id: 14,
    slug: '14-server-only-modules',
    icon: 'Lock',
    title: 'Server-Only Modules',
    description: 'Protecting server-side secrets using $env/static/private and server-only modules.',
    docUrl: 'https://svelte.dev/docs/kit/server-only-modules',
    tags: ['advanced']
  },
  {
    id: 15,
    slug: '15-snapshots',
    icon: 'Camera',
    title: 'Snapshots',
    description: 'Capturing and restoring ephemeral UI state using export const snapshot.',
    docUrl: 'https://svelte.dev/docs/kit/snapshots',
    tags: ['advanced']
  },
  {
    id: 16,
    slug: '16-shallow-routing',
    icon: 'Footprints',
    title: 'Shallow Routing',
    description: 'Updating the URL without full navigation using pushState and replaceState.',
    docUrl: 'https://svelte.dev/docs/kit/shallow-routing',
    tags: ['advanced']
  },
  {
    id: 17,
    slug: '17-observability',
    icon: 'Telescope',
    title: 'Observability',
    description: 'Logging, tracking errors, and monitoring app performance.',
    docUrl: 'https://svelte.dev/docs/kit/observability',
    tags: ['advanced']
  },
  {
    id: 18,
    slug: '18-packaging',
    icon: 'Package',
    title: 'Packaging',
    description: 'Creating reusable Svelte and SvelteKit component libraries using @sveltejs/package.',
    docUrl: 'https://svelte.dev/docs/kit/packaging',
    tags: ['advanced']
  },
  {
    id: 19,
    slug: '19-best-practices',
    icon: 'ShieldCheck',
    title: 'Best Practices',
    description: 'Icons, Images, SEO meta tags, non-blocking fonts, sitemap.xml, robots.txt, accessibility, and auth integration — all in one lesson.',
    docUrl: 'https://svelte.dev/docs/kit/performance',
    tags: ['advanced']
  },
  {
    id: 20,
    slug: '20-testing',
    icon: 'TestTube',
    title: 'Testing with Vitest',
    description: 'Unit testing Svelte components and SvelteKit modules using Vitest and @testing-library/svelte.',
    docUrl: 'https://svelte.dev/docs/kit/testing',
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
