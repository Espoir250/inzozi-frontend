import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-16 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Support</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Back the creators who inspire you</h1>
          <p className="mx-auto max-w-2xl text-base text-[var(--brand-black)]/75">Support means more than money — it's validation, community, and a way to keep creativity alive.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Direct impact", description: "Every contribution goes straight to the creator's work." },
            { title: "Exclusive rewards", description: "Gain access to special updates, downloads, and events." },
            { title: "Community growth", description: "Help creators invest in better content and experiences." },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-6">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-sm text-[var(--brand-black)]/80">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-[var(--brand-black)] bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to support a creator?</h2>
          <p className="mt-3 text-base text-[var(--brand-black)]/75">Explore our creator pages and choose a tier that fits your budget.</p>
          <Link href="/explore-creators" className="mt-8 inline-flex rounded-full bg-[var(--brand-yellow)] px-8 py-4 text-sm font-semibold text-[var(--brand-black)] hover:brightness-95">
            Explore creators
          </Link>
        </div>
      </section>
    </main>
  );
}
