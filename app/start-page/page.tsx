import Link from "next/link";

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-16 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Create your page</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Launch your creator profile on Inzozi</h1>
          <p className="max-w-2xl text-lg text-[var(--brand-black)]/75">Build your page, publish tiers, and welcome supporters with a clean, modern experience made for local creators.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Customize your page", description: "Add a profile, story, and visuals that reflect your creative work." },
            { title: "Publish tiers", description: "Offer support levels with exclusive rewards for every fan." },
            { title: "Grow your audience", description: "Connect with supporters and share updates that keep them engaged." },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-6">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-sm text-[var(--brand-black)]/80">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-8 shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Get started</p>
              <h2 className="mt-3 text-3xl font-semibold">Make your first page in minutes</h2>
            </div>
            <Link href="/sign-up" className="rounded-full bg-[var(--brand-yellow)] px-8 py-4 text-sm font-semibold text-[var(--brand-black)] hover:brightness-95">
              Start now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
