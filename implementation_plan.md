# Implementation Plan - Lazy Loading for Performance

Introduce React's code splitting and lazy loading capabilities to bundle pages separately, reducing the initial JavaScript bundle size and improving the application's startup and rendering speed.

## User Review Required

> [!IMPORTANT]
> - **Code Splitting via React.lazy**: We will dynamically import the primary page components (`Home`, `LoginPage`, `Dashboard`, and `FormToFileUpload`) using `React.lazy(() => import(...))`. This instructs Vite to split these pages into separate chunks that are loaded only when requested.
> - **Suspense boundary at Layout level**: We will wrap the router `<Outlet />` in `Layout.tsx` inside a `<Suspense>` boundary. This ensures that when a user transitions between routes, the main layout shell (header/footer) remains mounted and fully static, while a premium loaders fallback displays locally inside the page content area.

---

## Proposed Changes

### Router & Code Splitting

#### [MODIFY] [App.tsx](file:///c:/Users/kav23_7zs3uiw/OneDrive/Documents/Learnings/react/tutorial/src/App.tsx)
- Replace static page imports with dynamic lazy imports:
  - `const Home = lazy(() => import('./pages/Home'));`
  - `const LoginPage = lazy(() => import('./pages/LoginPage'));`
  - `const Dashboard = lazy(() => import('./pages/Dashboard'));`
  - `const FormToFileUpload = lazy(() => import('./pages/FormToFileUpload'));`
- Import `lazy` from `'react'`.

### Layout & Suspense

#### [MODIFY] [Layout.tsx](file:///c:/Users/kav23_7zs3uiw/OneDrive/Documents/Learnings/react/tutorial/src/components/Layout.tsx)
- Import `Suspense` from `'react'` and `Loader2` from `'lucide-react'`.
- Wrap the `<Outlet />` component inside a `<Suspense>` block:
  ```tsx
  <Suspense fallback={
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Loader2 className="w-10 h-10 animate-spin text-violet-600 dark:text-violet-400" />
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        Loading page content...
      </p>
    </div>
  }>
    <Outlet />
  </Suspense>
  ```

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify the build output structure.
- Verify in the build output that Vite outputs multiple split JavaScript chunks (e.g., `dist/assets/Home-[hash].js`, `dist/assets/Dashboard-[hash].js`, etc.) instead of bundling everything into a single large bundle.

### Manual Verification
1. **Initial Page Load**:
   - Clear browser cache and navigate to the application.
   - Verify that only the layout and home page bundle are downloaded initially.
2. **Page Navigation**:
   - Click the "Login", "Dashboard", or "Upload" links.
   - Verify in the Network tab that the corresponding chunk (e.g. `LoginPage-[hash].js`, `Dashboard-[hash].js`) is dynamically requested and downloaded on-demand.
3. **Suspense State visual check**:
   - Throttle the network in browser developer tools (e.g. to Slow 3G) and navigate to a new page.
   - Verify that a styled loader spinner spinner appears in the layout body, preserving the header and footer header/footer during transit.
