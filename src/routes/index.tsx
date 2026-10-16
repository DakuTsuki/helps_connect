import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { posts } from "@/lib/site-data";
import { brandImages } from "@/lib/site-data";
import relationshipSupport from "@/assets/support/relationship-support.jpg";
import familyWellbeing from "@/assets/family-wellbeing-editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "HELPS Counsellors | Relationship & Family Support" },
    { name: "description", content: "Faith-informed relationship and family counselling in the UK, helping people build healthier, more enjoyable relationships." },
    { property: "og:title", content: "HELPS Counsellors | Relationship & Family Support" },
    { property: "og:description", content: "Warm, confidential counselling for couples and families." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: HomePage,
});

function HomePage() {
  return <main>
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:py-20">
      <div><p className="eyebrow">Registered UK charity · Online &amp; face-to-face helping session · Open to everyone</p><h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-[1.08] sm:text-7xl">HELPS Counsellors</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">HELPS Counsellors, a UK registered Charity, provides relationship counselling and family support to help individuals, couples and families navigate challenges, strengthen connection and build healthier relationships.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild variant="primary" size="lg" className="h-14 px-9 text-base shadow-lg"><Link to="/contact">Book a Session <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg"><Link to="/about">Who we are</Link></Button></div></div>
      <div className="relative"><div className="absolute -left-5 -top-5 h-40 w-40 rounded-full bg-secondary"/><img src={brandImages.founders} alt="Bayo and Funmi Eesuola, founders of HELPS Counsellors" width={899} height={423} className="relative aspect-[4/3] max-h-[650px] w-full rounded-[3rem] object-cover object-left shadow-xl"/><div className="absolute -bottom-6 right-0 max-w-48 bg-background p-5 shadow-lg"><span className="font-display text-3xl font-semibold">50 minutes</span><span className="mt-1 block text-sm text-muted-foreground">online or face-to-face</span></div></div>
    </section>
    <section className="border-y border-border bg-secondary py-16"><div className="mx-auto max-w-7xl px-6"><div className="flex items-center gap-5"><h2 className="whitespace-nowrap font-display text-3xl font-semibold sm:text-4xl">Our focus</h2><div className="h-px w-full bg-border"/></div><div className="mt-10 grid gap-12 md:grid-cols-2">
      {[{icon:HeartHandshake,title:"Relationship Counselling",areas:["Communication difficulties","Conflict","Trust and intimacy","Marriage/relationship challenges"],image:relationshipSupport,alt:"Illustrative stock photograph of a counsellor taking notes during a conversation",width:1125,height:750},{icon:Users,title:"Family Wellbeing",areas:["Parenting","Family relationships","Young people","Relationship education"],image:familyWellbeing,alt:"AI-created illustration of a multigenerational family sharing a conversation at home",width:1200,height:1008}].map((item,index)=><article key={item.title} className="grid content-start gap-6"><img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="aspect-[3/2] w-full rounded-t-[3rem] object-cover"/><div><span className="eyebrow">0{index+1} / Support</span><h3 className="mt-2 font-display text-2xl font-semibold">{item.title}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">{item.areas.map(area => <li key={area}>{area}</li>)}</ul><Link to="/contact" className="mt-4 inline-flex items-center gap-2 border-b border-foreground pb-1 text-sm font-semibold">Book a session <ArrowRight className="size-4"/></Link></div></article>)}
    </div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Resources</p><h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Relationship insights</h2></div><Link to="/resources" className="shrink-0 border-b border-foreground pb-1 text-sm font-semibold">View all</Link></div><div className="mt-8 divide-y divide-border border-y border-border">{posts.slice(0,3).map(post=><Link key={post.slug} to="/resources/$slug" params={{slug:post.slug}} className="grid gap-3 py-6 transition-colors hover:text-primary md:grid-cols-[160px_1fr_auto] md:items-center"><span className="eyebrow">{post.category}</span><h3 className="font-display text-xl font-semibold leading-snug">{post.title}</h3><p className="text-xs text-muted-foreground">{post.readTime}</p></Link>)}</div></section>
  </main>;
}