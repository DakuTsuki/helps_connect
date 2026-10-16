import { createFileRoute } from "@tanstack/react-router";

// Static-hosting fallback page: the build saves this as the app shell that the
// web host serves for admin pages and any article added after the build.
export const Route = createFileRoute("/app-shell")({
  head: () => ({ meta: [{ title: "HELPS Counsellors" }, { name: "robots", content: "noindex" }] }),
  component: () => null,
});
