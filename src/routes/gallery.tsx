import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/SiteLayout";
import { fetchGallery, type GalleryItem } from "@/lib/api";

export const Route = createFileRoute("/gallery")({ head: () => ({ meta: [
  { title: "Gallery | HELPS Counsellors Events" }, { name: "description", content: "Explore moments from HELPS Counsellors relationship seminars, partners’ luncheons, workshops and family community events." },
  { property: "og:title", content: "Gallery | HELPS Counsellors" }, { property: "og:description", content: "Moments from our relationship and family events." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
]}), component: GalleryPage });

function getYouTubeEmbed(url?: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery().then((all) => {
      const hidden = (localStorage.getItem("hidden_gallery_ids") || "").split(",").filter(Boolean);
      setItems(all.filter((item) => !hidden.includes(String(item.id))));
    });
  }, []);

  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const events = ["All", ...new Set(items.map(item => item.event))];

  const visible = items.filter(item => {
    const matchesEvent = filter === "All" || item.event === filter;
    const matchesType = typeFilter === "all" || (item.media_type || "image") === typeFilter;
    return matchesEvent && matchesType;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-20">
      <PageIntro eyebrow="Gallery" title="Moments of connection">
        A look back at gatherings, seminars, and videos created for encouragement and stronger relationships.
      </PageIntro>

      {/* Media Type Tabs */}
      <div className="mt-8 flex gap-2 border-b border-border pb-3">
        <Button variant={typeFilter === "all" ? "ink" : "outline"} size="sm" onClick={() => setTypeFilter("all")}>All Media</Button>
        <Button variant={typeFilter === "image" ? "ink" : "outline"} size="sm" onClick={() => setTypeFilter("image")}>Photos</Button>
        <Button variant={typeFilter === "video" ? "ink" : "outline"} size="sm" onClick={() => setTypeFilter("video")}>Video Clips</Button>
      </div>

      {/* Event Filters */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Filter gallery by event">
        {events.map(event => (
          <Button key={event} variant={filter === event ? "secondary" : "outline"} size="sm" onClick={() => setFilter(event)} className="shrink-0 rounded-full text-xs">
            {event}
          </Button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {visible.map((item, index) => (
          <button key={`${item.event}-${item.id ?? index}`} type="button" onClick={() => setSelected(item)} className="group relative aspect-[4/3] overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl bg-secondary">
            <img src={item.image} alt={item.alt || item.event} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            {item.media_type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                  <Play className="size-6 fill-current" />
                </div>
              </div>
            )}
            <span className="absolute bottom-0 left-0 bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold rounded-tr-lg">
              {item.event}
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox / Video Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/90 p-4" role="dialog" aria-modal="true" aria-label={selected.event} onClick={() => setSelected(null)}>
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <Button variant="secondary" size="icon" onClick={() => setSelected(null)} className="absolute -top-12 right-0 md:right-0 md:-top-12" aria-label="Close">
              <X />
            </Button>
            
            {selected.media_type === "video" ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                {getYouTubeEmbed(selected.video_url) ? (
                  <iframe src={getYouTubeEmbed(selected.video_url)!} className="h-full w-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                ) : (
                  <video src={selected.video_url} controls autoPlay className="h-full w-full" />
                )}
              </div>
            ) : (
              <img src={selected.image} alt={selected.alt || selected.event} width={1024} height={768} className="max-h-[82vh] mx-auto rounded-2xl object-contain shadow-2xl" />
            )}

            <p className="mt-3 text-center text-sm text-background">{selected.alt || selected.event}</p>
          </div>
        </div>
      )}
    </main>
  );
}
