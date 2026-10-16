import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/SiteLayout";
import { galleryItems } from "@/lib/site-data";

export const Route = createFileRoute("/gallery")({ head: () => ({ meta: [
  { title: "Gallery | HELPS Counsellors Events" }, { name: "description", content: "Explore moments from HELPS Counsellors relationship seminars, partners’ luncheons, workshops and family community events." },
  { property: "og:title", content: "Gallery | HELPS Counsellors" }, { property: "og:description", content: "Moments from our relationship and family events." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
]}), component: GalleryPage });

function GalleryPage() {
  const events = ["All", ...new Set(galleryItems.map(item => item.event))]; const [filter,setFilter]=useState("All"); const [selected,setSelected]=useState<(typeof galleryItems)[number] | null>(null);
  useEffect(()=>{ const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setSelected(null)}; window.addEventListener("keydown",close); return()=>window.removeEventListener("keydown",close)},[]);
  const visible=filter==="All"?galleryItems:galleryItems.filter(item=>item.event===filter);
  return <main className="mx-auto max-w-7xl px-6 py-12 sm:py-20"><PageIntro eyebrow="Gallery" title="Moments of connection">A look back at gatherings created for learning, encouragement and stronger relationships.</PageIntro>
    <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filter gallery by event">{events.map(event=><Button key={event} variant={filter===event?"ink":"outline"} size="sm" onClick={()=>setFilter(event)} className="shrink-0 rounded-full">{event}</Button>)}</div>
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">{visible.map((item,index)=><button key={`${item.event}-${index}`} type="button" onClick={()=>setSelected(item)} className="group relative aspect-[4/3] overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><img src={item.image} alt={item.alt} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"/><span className="absolute bottom-0 left-0 bg-background px-3 py-2 text-xs font-semibold">{item.event}</span></button>)}</div>
    {selected&&<div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 p-4" role="dialog" aria-modal="true" aria-label={selected.event} onClick={()=>setSelected(null)}><div className="relative max-w-5xl" onClick={e=>e.stopPropagation()}><img src={selected.image} alt={selected.alt} width={1024} height={768} className="max-h-[82vh] rounded-2xl object-contain"/><Button variant="secondary" size="icon" onClick={()=>setSelected(null)} className="absolute right-3 top-3" aria-label="Close image"><X/></Button><p className="mt-3 text-center text-sm text-background">{selected.event}</p></div></div>}
  </main>;
}