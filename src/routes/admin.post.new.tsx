import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { PostEditor } from "@/components/PostEditor";

export const Route = createFileRoute("/admin/post/new")({
  ssr: false,
  head: () => ({ meta: [{ title: "New post | HELPS Admin" }, { name: "description", content: "Write a new HELPS Counsellors post." }, { property: "og:title", content: "New post | HELPS Admin" }, { property: "og:description", content: "Write a new HELPS Counsellors post." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell><p className="eyebrow">Posts</p><h1 className="mb-8 mt-2 font-display text-4xl font-semibold">New post</h1><PostEditor /></AdminShell>,
});
