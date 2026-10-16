import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { PostEditor } from "@/components/PostEditor";
import { adminFetchPost, type Post } from "@/lib/api";

export const Route = createFileRoute("/admin/post/$id/edit")({
  ssr: false,
  head: () => ({ meta: [{ title: "Edit post | HELPS Admin" }, { name: "description", content: "Edit a HELPS Counsellors post." }, { property: "og:title", content: "Edit post | HELPS Admin" }, { property: "og:description", content: "Edit a HELPS Counsellors post." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell><EditPage /></AdminShell>,
});

function EditPage() {
  const { id } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { adminFetchPost(id).then(setPost).catch((e) => setError(e.message)); }, [id]);
  return <><p className="eyebrow">Posts</p><h1 className="mb-8 mt-2 font-display text-4xl font-semibold">Edit post</h1>
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : post ? <PostEditor post={post} /> : <p className="text-muted-foreground">Loading…</p>}</>;
}
