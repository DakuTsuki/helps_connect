import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";

/** Client-side guard: redirects to /admin/login when no stored login. */
export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const a = auth.get();
    if (!a) navigate({ to: "/admin/login", replace: true });
    else setUser(a.username);
  }, [navigate]);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/admin/dashboard" className="font-display text-xl font-semibold">HELPS <em className="font-normal">Admin</em></Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{user}</span>
            <Button variant="outline" size="sm" onClick={() => { auth.clear(); navigate({ to: "/admin/login", replace: true }); }}>Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}

export const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
