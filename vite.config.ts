// @lovable.dev/vite-tanstack-config already includes the core plugins — do NOT add them manually.
// Static build: every public page is prerendered to HTML, and an SPA shell
// (_shell.html) handles admin pages and any new article slugs on the client.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const slugs = [
  "is-sexual-enjoyment-godly-part-2", "is-sexual-enjoyment-godly", "grow-your-love-part-1",
  "tap-the-potentials", "forgive-for-your-health", "watch-out-for-the-silent-killers",
  "not-everyone-will-be-married", "marriage-needs-maturity", "keep-the-promise",
  "sex-intriguing-mysterious", "marriage-glorious-institution", "the-silent-killer", "love-in-the-air",
];

const staticPaths = [
  "/", "/about", "/gallery", "/contact", "/resources",
  "/privacy", "/cookies", "/complaints", "/safeguarding",
  ...slugs.map((s) => `/resources/${s}`),
];

export default defineConfig({
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
    pages: staticPaths.map((path) => ({ path })),
    spa: { enabled: true, maskPath: "/app-shell" },
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
