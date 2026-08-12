/** React Router basename — no trailing slash (required for GitHub Pages project sites). */
export const routerBasename =
  (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || undefined;
