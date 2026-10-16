import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { login } from "@/lib/api";
import { inputClass } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin sign in | HELPS Counsellors" }, { name: "description", content: "HELPS Counsellors admin sign in." }, { property: "og:title", content: "Admin sign in | HELPS Counsellors" }, { property: "og:description", content: "HELPS Counsellors admin sign in." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try {
      await login(String(fd.get("username")), String(fd.get("password")));
      navigate({ to: "/admin/dashboard" });
    } catch (err) { setError(err instanceof Error ? err.message : "Sign in failed."); }
    finally { setBusy(false); }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-secondary px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 border border-border bg-background p-8">
        <div><p className="eyebrow">HELPS Counsellors</p><h1 className="mt-2 font-display text-3xl font-semibold">Admin sign in</h1></div>
        <label className="block text-sm font-medium">Username<input name="username" required autoComplete="username" className={`${inputClass} mt-1`} /></label>
        <label className="block text-sm font-medium">Password<input name="password" type="password" required autoComplete="current-password" className={`${inputClass} mt-1`} /></label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Signing in…" : "Sign in"}</Button>
      </form>
    </main>
  );
}
