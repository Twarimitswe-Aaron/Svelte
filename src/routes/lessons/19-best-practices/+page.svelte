<!--
  routes/lessons/19-best-practices/+page.svelte
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
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
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
  import FileText from 'lucide-svelte/icons/file-text';
  import Lock from 'lucide-svelte/icons/lock';
  import Globe from 'lucide-svelte/icons/globe';

  const { prev, next, current: lesson } = getAdjacentLessons('19-best-practices');

  // ── SEO tab ──────────────────────────────────────────────────────────────
  let seoTab = $state<'without' | 'with'>('without');

  // ── Font loading tab ─────────────────────────────────────────────────────
  let fontTab = $state<'blocking' | 'preload' | 'noscript'>('blocking');

  // ── Icons tab ────────────────────────────────────────────────────────────
  let iconTab = $state<'bad' | 'good'>('bad');

  // ── Auth tab & simulation ─────────────────────────────────────────────────
  let authMode = $state<'session' | 'jwt'>('session');
  let authResult = $state<string | null>(null);
  let authLoading = $state(false);

  async function simulateAuthCheck() {
    authLoading = true;
    authResult = null;
    await new Promise<void>(r => setTimeout(r, 600));
    authResult = authMode === 'session'
      ? 'Verified: locals.user = { id: "usr_demo", name: "SvelteKit Learner", role: "student" }'
      : 'Security Warning: JWT decoded — but if stolen, attacker keeps access until token expires!';
    authLoading = false;
  }

  // ── Image / CLS simulation ────────────────────────────────────────────────
  let imageTab = $state<'bad' | 'good'>('bad');
  let imageLoaded = $state(false);
  function replayImage() {
    imageLoaded = false;
    setTimeout(() => { imageLoaded = true; }, 800);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CODE SAMPLE STRINGS
  // All code snippets are defined here to avoid Svelte compiler confusion
  // with embedded tags like <script> or <svelte:head> in the template.
  // ─────────────────────────────────────────────────────────────────────────

  const a11yBad = [
    '\x3csvelte:head>',
    '  \x3ctitle>SvelteKit Course\x3c/title>',
    '  \x3c!-- ❌ All 18 lessons share this exact same title.',
    '    When a user with a screen reader navigates from',
    '    Lesson 1 to Lesson 2, the live region reads:',
    '    "SvelteKit Course" — unchanged. Complete confusion.',
    '    WCAG 2.4.2 (Page Titled) FAIL.',
    '  -->',
    '\x3c/svelte:head>'
  ].join('\n');

  const a11yGood = [
    '\x3c!-- In src/lib/components/LessonLayout.svelte -->',
    '\x3csvelte:head>',
    '  \x3c!--',
    '    lesson.title comes from the lessons.ts registry.',
    '    Every lesson page that uses \x3cLessonLayout> automatically gets',
    '    a unique, descriptive title — no per-page boilerplate needed.',
    '',
    '    SvelteKit injects a live region into the page that reads',
    '    this \x3ctitle> aloud after every client-side navigation.',
    '    That\'s why a unique title per page is mandatory.',
    '  \x3c/!-->',
    '  \x3ctitle>{lesson.title} — SvelteKit Course\x3c/title>',
    '  \x3cmeta name="description" content={lesson.description} />',
    '  \x3cmeta property="og:title" content="{lesson.title} — SvelteKit Course" />',
    '  \x3cmeta property="og:description" content={lesson.description} />',
    '\x3c/svelte:head>'
  ].join('\n');

  const seoBad = [
    '\x3c!-- ❌ BAD: only og:title, nothing else -->',
    '\x3c!-- In +layout.svelte svelte:head -->',
    '\x3cmeta property="og:title" content="SvelteKit Interactive Course" />',
    '\x3c!-- MISSING: og:description → Discord/Slack/WhatsApp show nothing -->',
    '\x3c!-- MISSING: og:type        → crawlers don\'t know content type  -->',
    '\x3c!-- MISSING: og:url         → canonical URL for deduplication    -->',
    '\x3c!-- MISSING: twitter:card   → no rich Twitter/X preview          -->',
    '\x3c!-- MISSING: /sitemap.xml   → Google doesn\'t know all lesson URLs -->',
    '\x3c!-- MISSING: /robots.txt    → no crawler instructions             -->'
  ].join('\n');

  const seoGood = [
    '\x3c!-- ✅ GOOD: Full setup in +layout.svelte -->',
    '\x3csvelte:head>',
    '  \x3ctitle>SvelteKit Course\x3c/title>',
    '  \x3cmeta name="description"',
    '    content="Learn SvelteKit from scratch with real demos." />',
    '',
    '  \x3c!-- Open Graph (Facebook, LinkedIn, WhatsApp, Discord, Slack) -->',
    '  \x3cmeta property="og:title" content="SvelteKit Interactive Course" />',
    '  \x3cmeta property="og:description"',
    '    content="Master SvelteKit with 19 interactive lessons." />',
    '  \x3cmeta property="og:type" content="website" />',
    '  \x3c!--    ↑ tells crawlers this is a website, not an article/product -->',
    '  \x3cmeta property="og:url" content="https://sveltekit-course.dev" />',
    '  \x3c!--    ↑ canonical URL — prevents duplicate content penalties -->',
    '',
    '  \x3c!-- Twitter/X rich card -->',
    '  \x3cmeta name="twitter:card" content="summary" />',
    '  \x3cmeta name="twitter:title" content="SvelteKit Interactive Course" />',
    '  \x3cmeta name="twitter:description"',
    '    content="Master SvelteKit with 19 interactive lessons." />',
    '\x3c/svelte:head>',
    '',
    '\x3c!-- DYNAMIC /sitemap.xml — src/routes/sitemap.xml/+server.ts -->',
    'export const GET = () => {',
    '  const urls = lessons.map(l =>',
    '    \'\x3curl>\' +',
    '    \'  \x3cloc>https://sveltekit-course.dev/lessons/\' + l.slug + \'\x3c/loc>\' +',
    '    \'  \x3cchangefreq>monthly\x3c/changefreq>\x3cpriority>0.8\x3c/priority>\' +',
    '    \'\x3c/url>\'',
    '  ).join(\'\');',
    '  return new Response(',
    '    \'\x3c?xml version="1.0"?\x3e\x3curlset ...>\' + urls + \'\x3c/urlset>\',',
    '    { headers: { \'Content-Type\': \'application/xml\',',
    '                 \'Cache-Control\': \'public, max-age=86400\' } }',
    '  );',
    '};',
    '',
    '\x3c!-- /robots.txt — src/routes/robots.txt/+server.ts -->',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/   ← don\'t index API routes (no SEO value)',
    'Sitemap: https://sveltekit-course.dev/sitemap.xml'
  ].join('\n');

  const perfBad = [
    '\x3c!-- ❌ BAD — in +layout.svelte or app.html -->',
    '\x3clink',
    '  href="https://fonts.googleapis.com/css2?family=Inter..."',
    '  rel="stylesheet"',
    '/>',
    '\x3c!-- rel="stylesheet" is RENDER-BLOCKING.',
    '  The browser halts ALL page painting until:',
    '    1. The stylesheet downloads from Google\'s servers',
    '    2. The @font-face URLs inside it are fetched',
    '    3. The .woff2 font files download (~80KB each)',
    '',
    '  On fast WiFi: imperceptible (~50ms).',
    '  On 3G: 1-3 second WHITE SCREEN before users see anything.',
    '',
    '  This directly tanks Largest Contentful Paint (LCP). -->'
  ].join('\n');

  const perfGood = [
    '\x3c!-- ✅ GOOD — in app.html (NOT svelte:head — see why below) -->',
    '',
    '\x3c!-- Step 1: Open TCP early to Google\'s CDN (~200ms saved) -->',
    '\x3clink rel="preconnect" href="https://fonts.googleapis.com"',
    '  crossorigin="anonymous" />',
    '',
    '\x3c!-- Step 2: Also preconnect the font FILE server -->',
    '\x3clink rel="preconnect" href="https://fonts.gstatic.com"',
    '  crossorigin="anonymous" />',
    '',
    '\x3c!-- Step 3: Download the CSS non-blocking -->',
    '\x3clink',
    '  rel="preload"   ← high priority, starts immediately',
    '  as="style"      ← but does NOT block rendering like "stylesheet"',
    '  href="https://fonts.googleapis.com/css2?..."',
    '  onload="this.onload=null;this.rel=\'stylesheet\'"',
    '/>',
    '',
    '\x3c!-- WHY app.html AND NOT \x3csvelte:head> ?',
    '  Svelte 5 treats event attributes as reactive bindings.',
    '  onload="..." (a string) throws an error in \x3csvelte:head>.',
    '  app.html is raw HTML, so plain HTML event strings work there. -->'
  ].join('\n');

  const perfNoscript = [
    '\x3c!-- Graceful fallback for non-JS environments -->',
    '\x3cnoscript>',
    '  \x3clink',
    '    href="https://fonts.googleapis.com/css2?family=Inter..."',
    '    rel="stylesheet"',
    '  />',
    '\x3c/noscript>',
    '',
    '\x3c!-- ✅ COMPLETE PATTERN in app.html: -->',
    '\x3clink rel="preconnect" href="https://fonts.googleapis.com" crossorigin="anonymous" />',
    '\x3clink rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />',
    '\x3clink rel="preload" as="style" href="..." onload="this.onload=null;this.rel=\'stylesheet\'" />',
    '\x3cnoscript>\x3clink href="..." rel="stylesheet" />\x3c/noscript>'
  ].join('\n');

  const iconBad = [
    '\x3c!-- ❌ BAD: importing from a non-shakable library -->',
    '\x3cscript>',
    '  // Some older libraries force Vite to crawl thousands of files.',
    '  // In large projects, this tanks dev cold start time.',
    '  import { HomeIcon, SearchIcon } from \'some-heavy-icon-lib\';',
    '\x3c/script>',
    '',
    '\x3cHomeIcon />',
    '\x3cSearchIcon />'
  ].join('\n');

  const iconGood = [
    '\x3c!-- ✅ RECOMMENDED: lucide-svelte -->',
    '\x3cscript>',
    '  // Lucide icons are individual Svelte components.',
    '  // Because they are ESM, Vite/Rollup tree-shake them:',
    '  // ONLY the icons you import are included in your bundle.',
    '  import { Home, Search, Bell } from \'lucide-svelte\';',
    '\x3c/script>',
    '',
    '\x3cHome size={20} />',
    '\x3cSearch size={20} />',
    '\x3cBell size={20} />'
  ].join('\n');

  const clsBad = [
    '\x3c!-- ❌ BAD: no width/height attributes -->',
    '\x3cimg src="/hero.png" alt="Hero image" />',
    '\x3c!-- Browser allocates height: 0 initially.',
    '  When image loads, page layout JUMPS down.',
    '  CLS > 0.1 = Google penalises your ranking. -->'
  ].join('\n');

  const clsGood = [
    '\x3c!-- ✅ RECOMMENDED: @sveltejs/enhanced-img -->',
    '\x3cenhanced:img',
    '  src="./hero.png"',
    '  alt="Descriptive alt text"',
    '  \x3c!-- ✅ Sets width/height from file → CLS = 0 -->',
    '  \x3c!-- ✅ Converts to avif/webp → 50% smaller -->',
    '/>',
    '',
    '\x3c!-- For CDN images, set explicit dimensions: -->',
    '\x3cimg',
    '  src="https://cdn.example.com/hero.png"',
    '  width="1200"',
    '  height="600"',
    '  loading="lazy"',
    '  decoding="async"',
    '/>'
  ].join('\n');

  const codeSessionAuth = [
    '// ✅ src/hooks.server.ts — Session-based auth (recommended)',
    'export const handle: Handle = async ({ event, resolve }) => {',
    '  const sessionId = event.cookies.get("session");',
    '  if (sessionId) {',
    '    // Instant revocation possible via DB lookup',
    '    event.locals.user = await db.getSession(sessionId);',
    '  } else {',
    '    event.locals.user = null;',
    '  }',
    '  return resolve(event);',
    '};'
  ].join('\n');

  const codeJwtAuth = [
    '// ⚠️ src/hooks.server.ts — JWT auth (trade-offs)',
    'export const handle: Handle = async ({ event, resolve }) => {',
    '  const token = event.cookies.get("token");',
    '  if (token) {',
    '    // Stateless, but cannot be revoked until expiry',
    '    const payload = await verifyJwt(token);',
    '    event.locals.user = { id: payload.sub, name: payload.name };',
    '  }',
    '  return resolve(event);',
    '};'
  ].join('\n');

  const authCode = $derived(authMode === 'session' ? codeSessionAuth : codeJwtAuth);
</script>

<LessonLayout
  {lesson}
  {prev}
  {next}
  whatItDoes="Demonstrates all 6 SvelteKit best practices with live before/after simulations — so you can SEE what breaks when a practice is skipped and what works when followed."
  whatFails="Without these: fonts block rendering, screen readers announce the wrong page, social shares show no description, icon libraries freeze Vite, images cause layout shift, and tokens can't be revoked."
>

  <!-- ══════════════════════════════════════════════════════════
       1. ACCESSIBILITY — Unique Page Titles per Route
       ══════════════════════════════════════════════════════════ -->
  <section class="bp-section">
    <h3 class="bp-heading"><AlertCircle size={18} /> 1. Accessibility — Navigation Context</h3>

    <div class="side-by-side">
      <div class="sp-panel sp-bad">
        <span class="sp-label bad"><XCircle size={14} /> Generic title on every page</span>
        <div class="sr-box">
          <span class="sr-label">Screen Reader:</span>
          <p class="sr-text">
            <Clock size={14} class="inline" />
            "SvelteKit Course... SvelteKit Course... SvelteKit Course..."
          </p>
          <p class="sr-note">User is lost. No confirmation that navigation worked.</p>
        </div>
        <CodeBlock code={a11yBad} lang="html" filename="+layout.svelte" />
      </div>

      <div class="sp-panel sp-good">
        <span class="sp-label good"><CheckCircle size={14} /> Unique title from lesson metadata</span>
        <div class="sr-box">
          <span class="sr-label">Screen Reader:</span>
          <p class="sr-text">
            <CheckCircle size={14} class="inline text-green" />
            "Introduction... Routing... Loading Data..."
          </p>
          <p class="sr-note">Perfect. Screen reader announces the new reality immediately.</p>
        </div>
        <CodeBlock code={a11yGood} lang="html" filename="LessonLayout.svelte" />
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════════════════
       2. SEO — Open Graph, Sitemap, robots.txt
       ══════════════════════════════════════════════════════════ -->
  <section class="bp-section">
    <h3 class="bp-heading"><Globe size={18} /> 2. SEO — Social Meta Tags & Sitemap</h3>

    <div class="tab-row">
      <button class="tbtn" class:tbtn-on={seoTab==='without'} onclick={() => seoTab = 'without'}>❌ Without OG tags</button>
      <button class="tbtn" class:tbtn-on={seoTab==='with'} onclick={() => seoTab = 'with'}>✅ With full SEO setup</button>
    </div>

    {#if seoTab === 'without'}
      <div class="sp-panel sp-bad full">
        <span class="sp-label bad"><XCircle size={14} /> Broken Social Card</span>
        <div class="social-card bad-card">
          <div class="sc-site">sveltekit-course.dev</div>
          <div class="sc-title">sveltekit-course.dev/lessons/01-intro</div>
          <div class="sc-desc dim">No description available.</div>
        </div>
        <CodeBlock code={seoBad} lang="html" filename="+layout.svelte" />
      </div>
    {:else}
      <div class="sp-panel sp-good full">
        <span class="sp-label good"><CheckCircle size={14} /> Rich Social Preview</span>
        <div class="social-card good-card">
          <div class="sc-site">sveltekit-course.dev</div>
          <div class="sc-title">SvelteKit Interactive Course</div>
          <div class="sc-desc">Master SvelteKit with 19 interactive lessons — routing, hooks, auth, SSR and more.</div>
        </div>
        <CodeBlock code={seoGood} lang="html" filename="SEO Setup" />
      </div>
    {/if}
  </section>

  <!-- ══════════════════════════════════════════════════════════
       3. PERFORMANCE — Non-blocking font loading
       ══════════════════════════════════════════════════════════ -->
  <section class="bp-section">
    <h3 class="bp-heading"><Zap size={18} /> 3. Performance — Non-blocking Assets</h3>

    <div class="tab-row">
      <button class="tbtn" class:tbtn-on={fontTab==='blocking'} onclick={() => fontTab = 'blocking'}>❌ Blocking</button>
      <button class="tbtn" class:tbtn-on={fontTab==='preload'} onclick={() => fontTab = 'preload'}>✅ Preload</button>
      <button class="tbtn" class:tbtn-on={fontTab==='noscript'} onclick={() => fontTab = 'noscript'}>✅ + noscript</button>
    </div>

    {#if fontTab === 'blocking'}
      <div class="sp-panel sp-bad full">
        <span class="sp-label bad"><XCircle size={14} /> Heavy icon set — importing entire library</span>
        <div class="perf-bar-wrap">
          <div class="perf-label">Page render progress</div>
          <div class="perf-track">
            <div class="perf-fill stuck-fill" style="width:40%"></div>
            <div class="perf-blocker">⛔ Blocked waiting for font (≈80KB)</div>
          </div>
        </div>
        <CodeBlock code={perfBad} lang="html" filename="Blocking load" />
      </div>
    {:else if fontTab === 'preload'}
      <div class="sp-panel sp-good full">
        <span class="sp-label good">✅ rel="preload" — downloads in background, zero blocking</span>
        <div class="perf-bar-wrap">
          <div class="perf-label">Page render progress</div>
          <div class="perf-track">
            <div class="perf-fill fast-fill" style="width:100%"></div>
          </div>
        </div>
        <CodeBlock code={perfGood} lang="html" filename="app.html" />
      </div>
    {:else}
      <div class="sp-panel sp-good full">
        <span class="sp-label good"><CheckCircle size={14} /> + &lt;noscript&gt; — complete, handles all environments</span>
        <CodeBlock code={perfNoscript} lang="html" filename="app.html (Full)" />
      </div>
    {/if}
  </section>

  <!-- ══════════════════════════════════════════════════════════
       4. ICONS — CSS-based vs per-file .svelte
       ══════════════════════════════════════════════════════════ -->
  <section class="bp-section">
    <h3 class="bp-heading"><Palette size={18} /> 4. Icons — CSS-based vs Per-file .svelte Components</h3>

    <div class="tab-row">
      <button class="tbtn" class:tbtn-on={iconTab==='bad'} onclick={() => iconTab = 'bad'}><XCircle size={14} /> Per-file library</button>
      <button class="tbtn" class:tbtn-on={iconTab==='good'} onclick={() => iconTab = 'good'}><CheckCircle size={14} /> CSS-based (Iconify)</button>
    </div>

    {#if iconTab === 'bad'}
      <div class="sp-panel sp-bad full">
        <span class="sp-label bad"><XCircle size={14} /> Per-icon .svelte files — grinds Vite to a halt</span>
        <div class="vite-sim">
          <div class="vite-track">
            <div class="vite-fill bad-vite"></div>
          </div>
          <p class="vite-note">Vite pre-bundling: scanning <strong>4,800 .svelte files</strong>… <Clock size={14} class="inline" /> cold start: ~12s</p>
        </div>
        <CodeBlock code={iconBad} lang="svelte" filename="Individual Icons" />
      </div>
    {:else}
      <div class="sp-panel sp-good full">
        <span class="sp-label good"><CheckCircle size={14} /> lucide-svelte — Premium DX + Tree-shaking</span>
        <div class="vite-sim">
          <div class="vite-track">
            <div class="vite-fill good-vite"></div>
          </div>
          <p class="vite-note">Vite: <strong>3 components imported.</strong> <Zap size={14} class="inline" /> Minimal overhead via ESM tree-shaking.</p>
        </div>
        <div class="icon-row">
          <div class="icon-item"><Home size={24} /><span>home</span></div>
          <div class="icon-item"><Search size={24} /><span>search</span></div>
          <div class="icon-item"><Bell size={24} /><span>bell</span></div>
          <div class="icon-item">
            <ChevronRight size={24} color="var(--color-accent)" />
            <span>chevron</span>
          </div>
        </div>
        <CodeBlock code={iconGood} lang="svelte" filename="Lucide Icons" />
      </div>
    {/if}
  </section>

  <!-- ══════════════════════════════════════════════════════════
       5. IMAGES — CLS prevention
       ══════════════════════════════════════════════════════════ -->
  <section class="bp-section">
    <h3 class="bp-heading"><Image size={18} /> 5. Images — Preventing Cumulative Layout Shift (CLS)</h3>

    <div class="tab-row">
      <button class="tbtn" class:tbtn-on={imageTab==='bad'} onclick={() => { imageTab = 'bad'; replayImage(); }}><XCircle size={14} /> No dimensions</button>
      <button class="tbtn" class:tbtn-on={imageTab==='good'} onclick={() => { imageTab = 'good'; replayImage(); }}><CheckCircle size={14} /> With dimensions</button>
    </div>

    {#if imageTab === 'bad'}
      <div class="sp-panel sp-bad full">
        <span class="sp-label bad"><XCircle size={14} /> No width/height — text shifts when image loads</span>
        <div class="cls-demo">
          <p class="cls-text">Here is your article intro paragraph <FileText size={14} class="inline" /></p>
          {#if !imageLoaded}
            <p class="cls-loading"><Clock size={14} class="inline" /> Image loading (0px height reserved)…</p>
          {:else}
            <div class="cls-img bad-img"><Image size={16} /> Image loaded — content below just shifted! <AlertTriangle size={16} /></div>
          {/if}
          <p class="cls-text" class:shifted={imageLoaded && imageTab === 'bad'}>
            This text jumps down when the image loads — that's CLS!
          </p>
        </div>
        <button class="btn btn-secondary" onclick={replayImage}><RotateCcw size={14} /> Replay layout shift ↺</button>
        <CodeBlock code={clsBad} lang="html" filename="Missing dimensions" />
      </div>
    {:else}
      <div class="sp-panel sp-good full">
        <span class="sp-label bad"><XCircle size={14} /> Missing dimensions — causes CLS</span>
        <div class="cls-demo">
          <p class="cls-text">Here is your article intro paragraph <FileText size={14} class="inline" /></p>
          <div class="cls-img good-img">
            {#if !imageLoaded}
              <Clock size={14} class="inline" /> Loading… (120px space pre-reserved)
            {:else}
              <CheckCircle size={16} /> Image loaded — nothing shifted!
            {/if}
          </div>
          <p class="cls-text">This text stays exactly in place. CLS = 0 <CheckCircle size={14} class="inline" /></p>
        </div>
        <button class="btn btn-secondary" onclick={replayImage}><RotateCcw size={14} /> Replay (no shift) ↺</button>
        <CodeBlock code={clsGood} lang="html" filename="Best Practice" />
      </div>
    {/if}
  </section>

  <!-- ══════════════════════════════════════════════════════════
       6. AUTH — Sessions vs JWT + locals integration
       ══════════════════════════════════════════════════════════ -->
  <section class="bp-section">
    <h3 class="bp-heading"><Lock size={18} /> 6. Auth — Sessions vs JWT &amp; the locals Pattern</h3>

    <div class="tab-row">
      <button class="tbtn" class:tbtn-on={authMode==='session'} onclick={() => { authMode = 'session'; authResult = null; }}><CheckCircle size={14} /> Sessions (recommended)</button>
      <button class="tbtn" class:tbtn-on={authMode==='jwt'} onclick={() => { authMode = 'jwt'; authResult = null; }}><AlertTriangle size={14} /> JWT (trade-offs)</button>
    </div>

    <div class="sp-panel {authMode === 'session' ? 'sp-good' : 'sp-warn'} full">
      {#if authMode === 'session'}
        <span class="sp-label good"><CheckCircle size={14} /> Session-based auth wired into locals via handle()</span>
      {:else}
        <span class="sp-label warn"><AlertCircle size={14} /> JWT — stateless, faster, but cannot be revoked</span>
      {/if}

      <div class="auth-row">
        <button class="sp-btn" onclick={simulateAuthCheck} disabled={authLoading}>
          {#if authLoading}
            <Clock size={14} class="animate-spin" />
            Checking auth…
          {:else}
            <Play size={14} />
            Simulate server auth check
          {/if}
        </button>
        {#if authResult}
          <div class="auth-result {authMode === 'session' ? 'auth-ok' : 'auth-warn'}">
            {authResult}
          </div>
        {/if}
      </div>

      <CodeBlock code={authCode} lang="typescript" filename="hooks.server.ts" />
    </div>
  </section>

</LessonLayout>

<style>
  /* ── Layout ──────────────────────────────────────────── */
  .bp-section { margin-bottom: 2.5rem; }

  .bp-heading {
    font-size: 1rem;
    font-weight: 800;
    color: var(--color-text);
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
    display: flex; align-items: center; gap: 0.5rem;
  }

  .side-by-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  @media (max-width: 700px) { .side-by-side { grid-template-columns: 1fr; } }

  /* ── Panels ──────────────────────────────────────────── */
  .sp-panel {
    border-radius: 10px;
    padding: 1.25rem;
    font-size: 0.85rem;
    line-height: 1.65;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
  }
  .sp-panel.full { width: 100%; }
  .sp-panel.sp-bad  { border-color: rgba(248,81,73,.35); background: rgba(248,81,73,.04); }
  .sp-panel.sp-good { border-color: rgba(63,185,80,.35); background: rgba(63,185,80,.04); }
  .sp-panel.sp-warn { border-color: rgba(210,153,34,.35); background: rgba(210,153,34,.04); }

  /* ── Labels ──────────────────────────────────────────── */
  .sp-label {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    padding: .15rem .5rem;
    border-radius: 999px;
    margin-bottom: .75rem;
  }
  .sp-label.good { background: rgba(63,185,80,.15); color: var(--color-success); }
  .sp-label.bad  { background: rgba(248,81,73,.15); color: var(--color-danger); }
  .sp-label.warn { background: rgba(210,153,34,.15); color: var(--color-warning); }

  /* ── Tabs ────────────────────────────────────────────── */
  .tab-row { display: flex; gap: .5rem; margin-bottom: .75rem; flex-wrap: wrap; }
  .tbtn {
    padding: .4rem .9rem;
    font-size: .8rem;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid var(--color-border);
    background: var(--color-surface-2);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all .15s;
  }
  .tbtn:hover { color: var(--color-text); border-color: var(--color-accent); }
  .tbtn.tbtn-on { background: var(--color-accent); color: #0d1117; border-color: var(--color-accent); }

  /* ── Screen reader box ───────────────────────────────── */
  .sr-box {
    display: flex;
    align-items: flex-start;
    gap: .75rem;
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: .75rem 1rem;
    margin-bottom: .75rem;
    font-size: .82rem;
  }
  .sr-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); }
  .sr-text { font-size: 0.9rem; font-family: monospace; display: flex; align-items: center; gap: 0.5rem; }
  .sr-note { font-size: 0.8rem; color: var(--color-text-muted); font-style: italic; }

  /* ── Social preview card ─────────────────────────────── */
  .social-card {
    border-radius: 8px;
    border: 1px solid var(--color-border);
    padding: .75rem 1rem;
    margin-bottom: .75rem;
    max-width: 380px;
    background: var(--color-surface-2);
  }
  .bad-card  { border-color: rgba(248,81,73,.3); }
  .good-card { border-color: rgba(63,185,80,.3); }
  .sc-site  { font-size: .7rem; color: var(--color-success); margin-bottom: .2rem; }
  .sc-title { font-size: .9rem; font-weight: 700; color: var(--color-text); margin-bottom: .2rem; }
  .sc-desc  { font-size: .8rem; color: var(--color-text-muted); line-height: 1.4; }
  .sc-desc.dim { color: var(--color-border); font-style: italic; }

  /* ── Performance bar ─────────────────────────────────── */
  .perf-bar-wrap { margin-bottom: .75rem; }
  .perf-label  { font-size: .75rem; color: var(--color-text-muted); margin-bottom: .35rem; }
  .perf-track  { height: 12px; background: var(--color-surface-2); border-radius: 6px; overflow: hidden; position: relative; }
  .perf-fill   { height: 100%; border-radius: 6px; }
  .stuck-fill  { background: var(--color-danger); animation: stuck 2s ease-in-out infinite alternate; }
  .fast-fill   { background: var(--color-success); }
  .perf-blocker {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: .65rem; color: var(--color-danger); font-weight: 700;
  }
  @keyframes stuck     { from { width: 35%; } to { width: 48%; } }

  /* ── Vite simulation ─────────────────────────────────── */
  .vite-sim { margin-bottom: .75rem; }
  .vite-track { height: 10px; background: var(--color-surface-2); border-radius: 6px; overflow: hidden; margin-bottom: .35rem; }
  .vite-fill  { height: 100%; border-radius: 6px; }
  .bad-vite  { background: var(--color-danger); animation: slow-fill 5s ease-in-out infinite; }
  .good-vite { background: var(--color-success); width: 100%; }
  .vite-note { font-size: .8rem; color: var(--color-text-muted); margin: 0; }
  @keyframes slow-fill { 0% { width: 0; } 80% { width: 75%; } 100% { width: 75%; } }

  /* ── Icon row ────────────────────────────────────────── */
  .icon-row { display: flex; gap: 1.5rem; margin-bottom: .75rem; flex-wrap: wrap; }
  .icon-item {
    display: flex; flex-direction: column; align-items: center; gap: .25rem;
    font-size: .75rem; color: var(--color-text-muted);
  }
  .icon-item span:first-child { font-size: 1.5rem; }

  /* ── CLS demo ────────────────────────────────────────── */
  .cls-demo {
    background: var(--color-surface-2);
    border-radius: 8px; padding: 1rem; margin-bottom: .5rem; min-height: 130px;
  }
  .cls-text    { font-size: .85rem; color: var(--color-text-muted); margin: 0 0 .5rem; transition: transform .3s; }
  .cls-loading { font-size: .8rem; color: var(--color-text-muted); font-style: italic; margin: 0 0 .5rem; }
  .cls-img {
    width: 100%; height: 60px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: .8rem; font-weight: 600; margin-bottom: .5rem;
  }
  .bad-img  { background: rgba(248,81,73,.15); border: 1px solid rgba(248,81,73,.3); color: var(--color-danger); animation: pop 0.3s ease; }
  .good-img { background: rgba(63,185,80,.1);  border: 1px solid rgba(63,185,80,.3);  color: var(--color-success); }
  .shifted  { transform: translateY(6px); color: var(--color-danger) !important; }
  @keyframes pop { from { height: 0; opacity: 0; } to { height: 60px; opacity: 1; } }

  /* ── Auth simulation ─────────────────────────────────── */
  .auth-row { display: flex; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: .75rem; }
  .auth-result {
    font-size: .8rem; font-family: 'Cascadia Code',monospace;
    padding: .45rem .75rem; border-radius: 6px; flex: 1; min-width: 200px;
  }
  .auth-ok   { background: rgba(63,185,80,.12); color: var(--color-success); border: 1px solid rgba(63,185,80,.3); }
  .auth-warn { background: rgba(210,153,34,.12); color: var(--color-warning); border: 1px solid rgba(210,153,34,.3); }
</style>
