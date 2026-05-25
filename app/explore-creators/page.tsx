import CreatorCard from "@/components/CreatorCard";
import Link from "next/link";

const creators = [
  { id: "c1", name: "Amina Arts", handle: "amina_arts", bio: "Illustrator & storyteller creating travel zines.", monthly: "$5" },
  { id: "c2", name: "Rwande Cook", handle: "rwande_cook", bio: "Sharing recipes and local food stories.", monthly: "$3" },
  { id: "c3", name: "Kigali Vibes", handle: "kigali_vibes", bio: "Music mixes and behind-the-scenes from Kigali.", monthly: "$4" },
  { id: "c4", name: "Nature Njeri", handle: "nature_njeri", bio: "Wildlife photographer on Rwandan safaris.", monthly: "$7" },
  { id: "c5", name: "Design by Theo", handle: "theo_design", bio: "Product design sketches and process notes.", monthly: "$6" },
  { id: "c6", name: "Mama's Kitchen", handle: "mamas_kitchen", bio: "Family recipes and weekly live cooking.", monthly: "$2" },
];

export default function ExploreCreatorsPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-16 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Explore creators</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Find creators you want to support</h1>
          <p className="mx-auto max-w-3xl text-base text-[var(--brand-black)]/75">Browse local talent, discover their membership tiers, and choose the creators who spark your curiosity.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        <div className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-8 text-center shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-semibold">Want a curated experience?</h2>
          <p className="mt-3 text-[var(--brand-black)]/75">Visit the tiers page to compare membership benefits and choose the right support level.</p>
          <Link href="/view-tiers" className="mt-8 inline-flex rounded-full bg-[var(--brand-yellow)] px-8 py-4 text-sm font-semibold text-[var(--brand-black)] hover:brightness-95">
            View tiers
          </Link>
        </div>
      </section>
    </main>
  );
}
