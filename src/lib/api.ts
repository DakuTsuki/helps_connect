/**
 * All PHP API endpoints live here. Edit API_BASE (or set VITE_API_BASE)
 * to point at your PHP server, e.g. "https://helpscounsellors.org".
 */
import { posts as fallbackPosts } from "@/lib/site-data";

export const API_BASE: string = import.meta.env['VITE_API_BASE'] ?? "";

export const ENDPOINTS = {
  login: `${API_BASE}/api/login.php`,
  posts: `${API_BASE}/api/posts.php`,
  postById: (id: string) => `${API_BASE}/api/post.php?id=${encodeURIComponent(id)}`,
  postBySlug: (slug: string) => `${API_BASE}/api/post.php?slug=${encodeURIComponent(slug)}`,
  savePost: `${API_BASE}/api/save-post.php`,
  addAdmin: `${API_BASE}/api/add-admin.php`,
  deletePost: (id: string) => `${API_BASE}/api/delete-post.php?id=${encodeURIComponent(id)}`,
};

export type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime?: string;
  status?: "draft" | "published";
  date?: string;
  /** HTML content from the editor/API */
  content?: string;
  /** Legacy plain paragraphs (local fallback data) */
  body?: string[];
};

const AUTH_KEY = "helps_admin_auth";
export const auth = {
  get(): { token?: string; username: string } | null {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; }
  },
  set(v: { token?: string; username: string }) { localStorage.setItem(AUTH_KEY, JSON.stringify(v)); },
  clear() { localStorage.removeItem(AUTH_KEY); },
};

function authHeaders(): Record<string, string> {
  const t = auth.get()?.token;
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function normalize(p: any): Post {
  return { ...p, id: p.id != null ? String(p.id) : undefined, category: p.category ?? "Relationships", image: p.image ?? p.cover_image ?? "", excerpt: p.excerpt ?? "" };
}

const localPosts = (): Post[] => fallbackPosts.map((p) => ({ ...p, status: "published" as const }));

/** Public: published posts. Falls back to built-in posts if the API is unreachable. */
export async function fetchPosts(): Promise<Post[]> {
  try {
    const r = await fetch(ENDPOINTS.posts);
    if (!r.ok) throw new Error();
    const data = await r.json();
    const list = Array.isArray(data) ? data : data.posts;
    return (list as any[]).map(normalize);
  } catch { return localPosts(); }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  try {
    const r = await fetch(ENDPOINTS.postBySlug(slug));
    if (!r.ok) throw new Error();
    const data = await r.json();
    return normalize(data.post ?? data);
  } catch { return localPosts().find((p) => p.slug === slug) ?? null; }
}

/** Admin calls — no fallback, errors surface to the UI. */
export async function login(username: string, password: string) {
  const r = await fetch(ENDPOINTS.login, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }), credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.success === false) throw new Error(data.message || "Invalid username or password.");
  auth.set({ token: data.token, username });
}

export async function adminFetchPosts(): Promise<Post[]> {
  const r = await fetch(ENDPOINTS.posts + "?all=1", { headers: authHeaders(), credentials: "include" });
  if (!r.ok) throw new Error("Could not load posts.");
  const data = await r.json();
  return ((Array.isArray(data) ? data : data.posts) as any[]).map(normalize);
}

export async function adminFetchPost(id: string): Promise<Post> {
  const r = await fetch(ENDPOINTS.postById(id), { headers: authHeaders(), credentials: "include" });
  if (!r.ok) throw new Error("Could not load post.");
  const data = await r.json();
  return normalize(data.post ?? data);
}

/** Sends multipart/form-data so the cover image file is included. */
export async function savePost(form: FormData) {
  const r = await fetch(ENDPOINTS.savePost, { method: "POST", body: form, headers: authHeaders(), credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.success === false) throw new Error(data.message || "Could not save post.");
  return data;
}

export async function deletePost(id: string) {
  const r = await fetch(ENDPOINTS.deletePost(id), { method: "POST", headers: authHeaders(), credentials: "include" });
  if (!r.ok) throw new Error("Could not delete post.");
}

export async function addAdmin(username: string, password: string) {
  const r = await fetch(ENDPOINTS.addAdmin, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ username, password }), credentials: "include" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || data.success === false) throw new Error(data.message || data.error || "Could not create login.");
  return data;
}
