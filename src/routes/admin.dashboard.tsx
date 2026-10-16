import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { adminFetchPosts, deletePost, type Post } from "@/lib/api";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard | HELPS Admin" }, { name: "description", content: "Manage HELPS Counsellors posts." }, { property: "og:title", content: "Dashboard | HELPS Admin" }, { property: "og:description", content: "Manage HELPS Counsellors posts." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell><Dashboard /></AdminShell>,
});

function Dashboard() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState("");
  const load = () => adminFetchPosts().then(setPosts).catch((e) => { setError(e.message); setPosts([]); });
  useEffect(() => { load(); }, []);
  async function remove(p: Post) {
    if (!p.id || !confirm(`Delete "${p.title}"?`)) return;
    try { await deletePost(p.id); load(); } catch (e) { setError((e as Error).message); }
  }
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Content</p><h1 className="mt-2 font-display text-4xl font-semibold">Posts</h1></div>
        <div className="flex gap-2"><Button asChild variant="outline"><Link to="/admin/users">Manage Users</Link></Button><Button asChild><Link to="/admin/post/new">New Post</Link></Button></div>
      </div>
      {error && <p role="alert" className="mt-6 text-sm text-destructive">{error}</p>}
      <div className="mt-8 overflow-x-auto border-y border-border">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="py-3 pr-4">Title</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Date</th><th className="py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-border">
            {posts === null && <tr><td colSpan={4} className="py-6 text-muted-foreground">Loading…</td></tr>}
            {posts?.length === 0 && !error && <tr><td colSpan={4} className="py-6 text-muted-foreground">No posts yet.</td></tr>}
            {posts?.map((p) => (
              <tr key={p.id ?? p.slug}>
                <td className="py-4 pr-4 font-medium">{p.title}</td>
                <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === "published" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{p.status ?? "draft"}</span></td>
                <td className="py-4 pr-4 text-muted-foreground">{p.date ?? "—"}</td>
                <td className="py-4 text-right"><div className="inline-flex gap-2">
                  {p.id && <Button asChild variant="outline" size="sm"><Link to="/admin/post/$id/edit" params={{ id: p.id }}>Edit</Link></Button>}
                  <Button variant="outline" size="sm" onClick={() => remove(p)} disabled={!p.id}>Delete</Button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
