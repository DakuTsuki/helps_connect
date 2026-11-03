import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { 
  adminFetchPosts, deletePost, 
  fetchGallery, saveGalleryItem, deleteGalleryItem, 
  fetchSettings, saveSettings,
  type Post, type GalleryItem, type SiteSettings 
} from "@/lib/api";
import { AdminShell, inputClass } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Dashboard | HELPS Admin" }, { name: "description", content: "Manage HELPS Counsellors website." }, { property: "og:title", content: "Dashboard | HELPS Admin" }, { property: "og:description", content: "Manage HELPS Counsellors website." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell><Dashboard /></AdminShell>,
});

function Dashboard() {
  const [tab, setTab] = useState<"posts" | "gallery" | "settings">("posts");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPosts = () => adminFetchPosts().then(setPosts).catch((e) => { setError(e.message); setPosts([]); });
  const loadGallery = () => fetchGallery().then(setGallery).catch(() => {});
  const loadSettings = () => fetchSettings().then(setSettings).catch(() => {});

  useEffect(() => { 
    loadPosts(); 
    loadGallery();
    loadSettings();
  }, []);

  async function removePost(p: Post) {
    if (!p.id || !confirm(`Delete "${p.title}"?`)) return;
    try { await deletePost(p.id); loadPosts(); } catch (e) { setError((e as Error).message); }
  }

  async function handleGalleryUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await saveGalleryItem(form);
      (e.target as HTMLFormElement).reset();
      setSuccess("Gallery photo uploaded successfully!");
      loadGallery();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function removeGalleryPhoto(item: GalleryItem) {
    if (!item.id) {
      alert("This is a built-in static image and cannot be deleted via the admin.");
      return;
    }
    if (!confirm(`Delete image for "${item.event}"?`)) return;
    try {
      await deleteGalleryItem(item.id);
      loadGallery();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleSaveSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await saveSettings(settings);
      setSuccess("Site content updated successfully!");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content Management</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/admin/users">Manage Users</Link></Button>
          {tab === "posts" && <Button asChild><Link to="/admin/post/new">New Post</Link></Button>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-b border-border pb-3">
        <Button variant={tab === "posts" ? "ink" : "outline"} onClick={() => { setTab("posts"); setError(""); setSuccess(""); }}>Posts & Articles</Button>
        <Button variant={tab === "gallery" ? "ink" : "outline"} onClick={() => { setTab("gallery"); setError(""); setSuccess(""); }}>Gallery Images</Button>
        <Button variant={tab === "settings" ? "ink" : "outline"} onClick={() => { setTab("settings"); setError(""); setSuccess(""); }}>Site Content (Wordings)</Button>
      </div>

      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      {success && <p role="status" className="mt-4 text-sm text-primary font-medium">{success}</p>}

      {tab === "posts" && (
        <div className="mt-8 overflow-x-auto border-y border-border">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="py-3 pr-4">Title</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Date</th><th className="py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y border-border">
              {posts === null && <tr><td colSpan={4} className="py-6 text-muted-foreground">Loading…</td></tr>}
              {posts?.length === 0 && !error && <tr><td colSpan={4} className="py-6 text-muted-foreground">No posts yet.</td></tr>}
              {posts?.map((p) => (
                <tr key={p.id ?? p.slug}>
                  <td className="py-4 pr-4 font-medium">{p.title}</td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${p.status === "published" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      {p.status ?? "draft"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-muted-foreground">{p.date ?? "—"}</td>
                  <td className="py-4 text-right">
                    <div className="inline-flex gap-2">
                      {p.id && <Button asChild variant="outline" size="sm"><Link to="/admin/post/$id/edit" params={{ id: p.id }}>Edit</Link></Button>}
                      <Button variant="outline" size="sm" onClick={() => removePost(p)} disabled={!p.id}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "gallery" && (
        <div className="mt-8 space-y-10">
          <section className="rounded-xl border border-border bg-secondary p-6">
            <h2 className="font-display text-xl font-semibold">Upload New Gallery Photo</h2>
            <form onSubmit={handleGalleryUpload} className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Event / Tag</label>
                <input required name="event" placeholder="e.g. Cleave 2026, Seminar" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Description (Alt)</label>
                <input name="alt" placeholder="e.g. Guests at the event" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Image file</label>
                <input required type="file" name="image" accept="image/*" className="mt-1 block w-full text-xs" />
              </div>
              <div className="sm:col-span-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "Uploading…" : "Upload to Gallery"}
                </Button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Current Gallery Photos ({gallery.length})</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
              {gallery.map((item, idx) => (
                <div key={item.id ?? idx} className="group relative overflow-hidden rounded-lg border border-border bg-secondary">
                  <img src={item.image} alt={item.alt} className="aspect-square w-full object-cover" />
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{item.event}</p>
                    {item.id && (
                      <button type="button" onClick={() => removeGalleryPhoto(item)} className="mt-1 text-xs text-destructive hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === "settings" && (
        <form onSubmit={handleSaveSettings} className="mt-8 max-w-3xl space-y-8 rounded-xl border border-border bg-secondary p-6">
          <div>
            <h2 className="font-display text-2xl font-semibold">Homepage Hero Content</h2>
            <p className="text-sm text-muted-foreground">Update the main tagline and introductory message on the homepage.</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Eyebrow Tagline</label>
                <input 
                  value={settings.hero_eyebrow ?? ""} 
                  onChange={(e) => setSettings({ ...settings, hero_eyebrow: e.target.value })}
                  placeholder="Long-Term Love. Marriage Rejuvenation. Generational Impact."
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Heading Title</label>
                <input 
                  value={settings.hero_title ?? ""} 
                  onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                  placeholder="HELPS Counsellors"
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Main Description</label>
                <textarea 
                  rows={4}
                  value={settings.hero_description ?? ""} 
                  onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                  className={inputClass} 
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="font-display text-2xl font-semibold">Contact Information</h2>
            <p className="text-sm text-muted-foreground">Update contact email and phone numbers across the site.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Contact Email</label>
                <input 
                  value={settings.contact_email ?? ""} 
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Address</label>
                <input 
                  value={settings.contact_address ?? ""} 
                  onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Phone 1</label>
                <input 
                  value={settings.contact_phone1 ?? ""} 
                  onChange={(e) => setSettings({ ...settings, contact_phone1: e.target.value })}
                  className={inputClass} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground">Phone 2</label>
                <input 
                  value={settings.contact_phone2 ?? ""} 
                  onChange={(e) => setSettings({ ...settings, contact_phone2: e.target.value })}
                  className={inputClass} 
                />
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Saving…" : "Save Site Changes"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
