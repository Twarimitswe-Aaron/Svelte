# 🚀 SvelteKit Mastery Course

A comprehensive, hands-on learning application designed to take you from a Svelte beginner to a SvelteKit expert. This project features 19 interactive lessons, each exploring a core framework concept with live demos and annotated code.

## ✨ Features

- **Svelte 5 Powered**: Built using the latest Svelte 5 Runes for state management.
- **Experimental SvelteKit**: Explores cutting-edge features like **Remote Functions** (`query`, `command`, `form`).
- **Interactive Demos**: Each lesson includes a live, functional demonstration of the concept.
- **Modern Tech Stack**: TypeScript, Tailwind CSS, Lucide Icons, and Vitest.
- **Type-Safe Registry**: Centralized lesson management for consistent navigation and metadata.

## 🛠 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (v2) + [Svelte 5](https://svelte.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: [Lucide-Svelte](https://lucide.dev/guide/svelte)
- **Tooling**: Vite, Prettier, ESLint, Vitest
- **Database**: SQLite (via `remote-demo.remote.ts`)

## 📚 Curriculum Roadmap

The course is divided into **Core** and **Advanced** tracks:

### 🟢 Core Concepts (Lessons 01-06)
1. **Introduction**: Project structure and setup.
2. **Routing**: File-based routes, layouts, and error boundaries.
3. **Loading Data**: Server-only vs. Universal load functions.
4. **Form Actions**: Handling submissions and progressive enhancement.
5. **Page Options**: PRERENDER, SSR, CSR, and TrailingSlash.
6. **State Management**: Context API and Snapshot storage.

### 🔴 Advanced SvelteKit (Lessons 07-19)
7. **Advanced Routing**: Layout groups, matchers, and breakouts.
8. **Hooks**: Intercepting requests and responses on the server.
9. **Error Handling**: Expected vs. unexpected errors.
10. **API Routes**: Building REST endpoints with `+server.ts`.
11. **Remote Functions**: Revolutionary server logic callable directly from components.
12. **Link Options**: Preloading and scroll management.
13. **Service Workers**: Building offline-ready applications.
14. **Server-Only Modules**: Protecting secrets and private logic.
15. **Snapshots**: Preserving ephemeral UI state.
16. **Shallow Routing**: URL updates without full navigation.
17. **Observability**: Monitoring and logging in production.
18. **Packaging**: Creating reusable SvelteKit libraries.
19. **Best Practices**: SEO, performance, accessibility, and auth patterns.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Run Development Server**:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:5173` to explore the lessons.

3. **Verify Implementation**:
   ```bash
   pnpm test:unit
   ```

## 📄 License

This project is intended for educational purposes. Feel free to explore and build upon it!
