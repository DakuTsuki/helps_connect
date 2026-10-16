import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { addAdmin } from "@/lib/api";
import { AdminShell, inputClass } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/users")({
  ssr: false,
  head: () => ({ meta: [{ title: "Manage Users | HELPS Admin" }, { name: "description", content: "Create admin logins for HELPS Counsellors." }, { property: "og:title", content: "Manage Users | HELPS Admin" }, { property: "og:description", content: "Create admin logins for HELPS Counsellors." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminShell><Users /></AdminShell>,
});

function Users() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError(""); setSuccess(""); setBusy(true);
    try {
      const username = String(fd.get("username") || "");
      const data = await addAdmin(username, String(fd.get("password") || ""));
      setSuccess(data?.message || `Login created for "${username}".`);
      form.reset();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  return (
    <>
      <Link to="/admin/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
      <p className="eyebrow mt-6">Access</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Manage Users</h1>
      <form onSubmit={submit} className="mt-8 max-w-md space-y-5">
        <div><label htmlFor="username" className="mb-1 block text-sm font-medium">Username</label><input id="username" name="username" type="text" required autoComplete="off" className={inputClass} /></div>
        <div><label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label><input id="password" name="password" type="password" required autoComplete="new-password" className={inputClass} /></div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {success && <p role="status" className="text-sm text-primary">{success}</p>}
        <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create Login"}</Button>
      </form>
    </>
  );
}
