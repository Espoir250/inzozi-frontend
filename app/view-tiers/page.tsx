import Link from "next/link";

const tiers = [
  { name: "Supporter", price: "$3", perks: ["Early access posts", "Thank you message"], best: false },
  { name: "Creator", price: "$7", perks: ["Monthly bonus post", "Community chat", "Behind the scenes"], best: true },
  { name: "Patron", price: "$12", perks: ["Exclusive downloads", "Live sessions", "Private updates"], best: false },
];

export default function ViewTiersPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-white)] px-6 py-16 text-[var(--brand-black)] sm:px-10 lg:px-14">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Membership tiers</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Choose a creator tier that fits your support style</h1>
          <p className="mx-auto max-w-2xl text-base text-[var(--brand-black)]/75">From casual fans to loyal patrons, browse levels that unlock rewards and keep creators doing what they love.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-[2rem] border border-[var(--brand-black)] bg-white p-8 ${tier.best ? "shadow-[0_30px_60px_rgba(0,0,0,0.12)]" : ""}`}>
              {tier.best && <p className="mb-4 inline-flex rounded-full bg-[var(--brand-yellow)]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand-black)]">Most popular</p>}
              <h2 className="text-2xl font-semibold">{tier.name}</h2>
              <p className="mt-4 text-5xl font-extrabold">{tier.price}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.3em] text-[var(--brand-black)]/60">per month</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--brand-black)]/85">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--brand-black)]" />
                    {perk}
                  </li>
                ))}
              </ul>
              <Link href="/sign-in" className="mt-8 inline-flex w-full justify-center rounded-full bg-[var(--brand-yellow)] px-4 py-3 text-sm font-semibold text-[var(--brand-black)] hover:brightness-95">
                Choose {tier.name}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
