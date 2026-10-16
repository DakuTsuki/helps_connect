import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { contact } from "@/lib/site-data";
import logoAsset from "@/assets/original/helps-logo.png";

const links = [
  ["/", "Home"], ["/about", "About"], ["/gallery", "Gallery"],
  ["/resources", "Resources"],
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <div className="min-h-screen bg-scene font-sans text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-4 sm:flex">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="HELPS Counsellors home">
            <img src={logoAsset} alt="HELPS Counsellors" width={290} height={73} className="h-10 w-auto" />
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main navigation">
             {links.map(([to, label]) => <Link key={to} to={to} className={`border-b px-3 py-2 text-sm font-medium transition-colors ${pathname === to || (to !== "/" && pathname.startsWith(to)) ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{label}</Link>)}
          <Link to="/about" hash="partner" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Partner</Link><Link to="/about" hash="donate" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Donate</Link></nav>
          <Button asChild variant="ink" size="sm" className="hidden md:inline-flex"><Link to="/contact">Book a Session <ArrowRight /></Link></Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</Button>
           {open && <nav className="col-span-2 grid gap-1 border-t border-border pt-3 md:hidden" aria-label="Mobile navigation">{links.map(([to, label]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="border-b border-border px-1 py-3 text-sm font-medium text-foreground">{label}</Link>)}<Link to="/about" hash="partner" onClick={() => setOpen(false)} className="py-3 text-sm font-medium">Partner</Link><Link to="/about" hash="donate" onClick={() => setOpen(false)} className="py-3 text-sm font-medium">Donate</Link><Button asChild variant="primary" className="mt-3"><Link to="/contact" onClick={() => setOpen(false)}>Book a Session</Link></Button></nav>}
        </div><nav aria-label="Quick support links" className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-border py-3 text-xs font-semibold md:hidden"><Link to="/contact" className="text-primary">Book a Session</Link><Link to="/about" hash="partner">Partner</Link><Link to="/about" hash="donate">Donate</Link><Link to="/resources">Resources</Link><Link to="/about">About</Link></nav>
      </header>
      {children}
      <footer className="mt-16 border-t border-border bg-secondary px-4 py-12 print:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
            <div><img src={logoAsset} alt="HELPS Counsellors" width={290} height={73} className="h-12 w-auto"/><p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">For everyone aspiring to have an enjoyable love life—single, married, widowed, separated or divorced. We operate on Biblical principles without prejudice to religion, race, creed or gender.</p></div>
            <div className="text-sm"><p className="font-semibold">Contact</p><a className="mt-3 block text-muted-foreground hover:text-primary" href={`tel:${contact.phones[0]}`}>{contact.displayPhones[0]}</a><a className="mt-1 block text-muted-foreground hover:text-primary" href={`mailto:${contact.email}`}>{contact.email}</a><p className="mt-1 text-muted-foreground">{contact.address}</p></div>
            <div className="text-sm"><p className="font-semibold">Follow</p><div className="mt-3 flex flex-col gap-3 text-muted-foreground"><a href="https://www.facebook.com/helpscounsellors" target="_blank" rel="noreferrer">Helpscounsellors Eesuolas</a><a href="https://twitter.com/helpscounsellors" target="_blank" rel="noreferrer">X: @helpscounsellor</a><span>YouTube: Helps Counsellors</span></div><p className="mt-5 text-muted-foreground">Company Limited by Guarantee No. 7373001</p></div>
          </div>
          <nav aria-label="Policies" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link to="/privacy">Privacy Policy</Link><Link to="/cookies">Cookie Policy</Link><Link to="/complaints">Complaints</Link><Link to="/safeguarding">Safeguarding</Link></nav>
          <p className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">Registered Charity No. 1140793 · England and Wales · © 2026 HELPS Counsellors</p>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <div className="max-w-3xl"><p className="eyebrow">{eyebrow}</p><h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{children}</p></div>;
}