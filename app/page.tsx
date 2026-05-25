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

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-10 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-yellow)]/20 px-3 py-1 text-sm font-semibold text-[var(--brand-black)]">Support creators</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Support the people who make what you love</h1>
            <p className="max-w-xl text-lg text-[var(--brand-black)]">Discover creators from your community, subscribe to their work, and unlock exclusive content.</p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/explore-creators" className="rounded-full bg-[var(--brand-yellow)] px-6 py-3 text-sm font-semibold text-[var(--brand-black)] hover:brightness-95">Explore creators</Link>
              <Link href="/start-page" className="rounded-full border border-[var(--brand-black)] bg-[var(--brand-white)] px-6 py-3 text-sm font-medium text-[var(--brand-black)] hover:brightness-95">Start a page</Link>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--brand-white)] p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Featured creator</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-lg bg-[var(--brand-yellow)] text-[var(--brand-black)] flex items-center justify-center text-2xl">A</div>
              <div>
                <p className="text-lg font-semibold">Amina Arts</p>
                <p className="text-sm text-[var(--brand-black)]">Illustrator & storyteller</p>
              </div>
            </div>

            <p className="mt-4 text-[var(--brand-black)]">Monthly patrons get process videos, high-res downloads, and a monthly zine.</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/support" className="rounded-full bg-[var(--brand-yellow)] px-4 py-2 text-sm font-semibold text-[var(--brand-black)] text-center">Become a patron</Link>
              <Link href="/view-tiers" className="rounded-full border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-2 text-sm font-medium text-[var(--brand-black)] text-center">View tiers</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="creators" className="mx-auto mt-12 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--brand-yellow)]">Creators</p>
            <h2 className="mt-2 text-2xl font-semibold">Support local voices</h2>
          </div>
          <p className="text-sm text-[var(--brand-black)]">Subscribe monthly and unlock exclusive content.</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => (
            <CreatorCard key={c.id} creator={c} />
          ))}
        </div>
      </section>
    </main>
  );
}
