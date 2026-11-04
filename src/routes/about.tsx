import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonationSection } from "@/components/DonationSection";
import { brandImages } from "@/lib/site-data";
import { fetchSettings, defaultSettings, type SiteSettings } from "@/lib/api";

export const Route = createFileRoute("/about")({ head: () => ({ meta: [
  { title: "About HELPS Counsellors | Our Mission & Founders" }, { name: "description", content: "Meet HELPS Counsellors founders Bayo and Funmi Eesuola and learn about our mission, partnerships and charitable work." },
  { property: "og:title", content: "About HELPS Counsellors" }, { property: "og:description", content: "Our mission, founders, partnership opportunities and ways to donate." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
]}), component: AboutPage });

function AboutPage() { 
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const sharedParagraphs = (settings.about_shared_bio ?? "").split("\n\n").filter(Boolean);

  return <main>
    <div className="border-b border-border px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap gap-6 text-sm" aria-label="About sections">
          {[["mission","Who we are"],["founders","Founders"],["partner","Partner"],["donate","Donate"]].map(([id,label]) => (
            <a key={id} href={`#${id}`} className="border-b border-border pb-1 font-medium hover:border-primary">{label}</a>
          ))}
        </nav>
        <section id="mission" className="max-w-4xl pt-12">
          <p className="eyebrow">Who we are</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-7xl">
            {settings.about_headline}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{settings.about_p1}</p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{settings.about_p2}</p>
        </section>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-6">
      <section id="founders" className="scroll-mt-28 py-16">
        <p className="eyebrow">Meet the founders</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Bayo & Funmi Eesuola</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="grid border-t border-border pt-6 sm:grid-cols-[.75fr_1fr]">
            <img src={brandImages.bayo} alt="Pastor Bayo Eesuola" width={320} height={420} loading="lazy" className="h-full max-h-96 w-full rounded-t-[5rem] object-cover object-top"/>
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold">Pastor Bayo Eesuola</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{settings.about_bayo_bio}</p>
            </div>
          </article>
          <article className="grid border-t border-border pt-6 sm:grid-cols-[.75fr_1fr]">
            <img src={brandImages.funmi} alt="Pastor Funmi Eesuola" width={275} height={420} loading="lazy" className="h-full max-h-96 w-full rounded-t-[5rem] object-cover object-top"/>
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold">Pastor Funmi Eesuola</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{settings.about_funmi_bio}</p>
            </div>
          </article>
        </div>
        <div className="mt-8 max-w-4xl space-y-4 leading-relaxed text-muted-foreground">
          {sharedParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="partner" className="scroll-mt-28 border-t border-border py-14">
        <HandHeart className="size-8 text-primary"/>
        <h2 className="mt-5 font-display text-3xl font-semibold">Become a partner</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{settings.about_partner_text}</p>
        <ul className="mt-5 list-disc space-y-2 pl-5">
          <li>Sponsor a programme</li>
          <li>Refer families</li>
          <li>Invite HELPS Counsellors to speak</li>
        </ul>
        <Button asChild variant="ink" size="lg" className="mt-6">
          <Link to="/contact">Partner with HELPS Counsellors <ArrowRight/></Link>
        </Button>
      </section>
    </div>
    <DonationSection/>
  </main>;
}
