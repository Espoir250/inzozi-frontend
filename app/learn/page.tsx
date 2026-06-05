import Link from "next/link";

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-16 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Learn</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">How Inzozi works for creators and supporters</h1>
          <p className="mx-auto max-w-2xl text-base text-[var(--brand-black)]/75">Learn the best way to publish, promote, and grow your page, or find creators and membership tiers you love.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Creators", description: "Build a page, offer tiers, and share updates with your supporters." },
            { title: "Supporters", description: "Discover pages, back creators, and enjoy exclusive benefits." },
            { title: "Launch tips", description: "Use clear rewards, consistent updates, and community-first messages." },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-6">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-sm text-[var(--brand-black)]/80">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-semibold">Get started with Inzozi</h2>
            <p className="text-[var(--brand-black)]/75">Whether you are launching your first page or supporting a creator, the process is simple and transparent.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Share your story",
              "Publish engaging tiers",
              "Connect with fans",
            ].map((step) => (
              <div key={step} className="rounded-3xl border border-[var(--brand-black)] bg-[var(--brand-white)] p-5 text-center text-sm text-[var(--brand-black)]/90">{step}</div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/start-page" className="inline-flex rounded-full bg-[var(--brand-yellow)] px-8 py-4 text-sm font-semibold text-[var(--brand-black)] hover:brightness-95">
              Start your page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
