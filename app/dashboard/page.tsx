import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Library", href: "/dashboard#library" },
  { label: "Audience", href: "/dashboard#audience" },
  { label: "Insights", href: "/dashboard#insights" },
  { label: "Payouts", href: "/dashboard#payouts" },
  { label: "Promotions", href: "/dashboard#promotions" },
  { label: "Chats", href: "/dashboard#chats" },
  { label: "Notifications", href: "/dashboard#notifications" },
  { label: "Creator settings", href: "/dashboard#settings" },
];

const steps = [
  {
    title: "Start with the basics",
    description: "Add your name, photo and a description of what you create.",
  },
  {
    title: "Add your podcast",
    description: "Set up your podcast on Inzozi to offer listeners a seamless experience.",
  },
  {
    title: "Make your first post",
    description: "Create a public welcome post or share your first exclusive member update.",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-black)] text-[var(--brand-white)]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-10">
        <aside className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-sm text-[var(--brand-white)] shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Your page</p>
              <h2 className="mt-3 text-xl font-semibold">Blessman Gasana</h2>
            </div>
          </div>

          <div className="space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-3xl px-4 py-3 transition hover:bg-white/10 ${item.active ? "bg-white/10 font-semibold" : "text-[var(--brand-white)]/80"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-[var(--brand-white)]/75">
            <p className="font-semibold text-[var(--brand-yellow)]">Page status</p>
            <p className="mt-3">Your page is not yet published. Complete the setup steps and publish when ready.</p>
          </div>
        </aside>

        <section className="space-y-8">
          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Welcome to Patreon</p>
                <h1 className="mt-4 text-4xl font-semibold">Let's set up your page and start growing your community.</h1>
                <p className="mt-4 max-w-2xl text-sm text-[var(--brand-white)]/70">Finish the onboarding checklist and publish your page when you’re ready to start accepting supporters.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/start-page" className="rounded-full bg-[var(--brand-yellow)] px-5 py-3 text-sm font-semibold text-[var(--brand-black)] shadow-sm hover:brightness-95">
                  Publish page
                </Link>
                <Link href="/start-page" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[rgba(255,255,255,0.08)] px-5 py-3 text-sm font-medium text-[var(--brand-white)] hover:bg-white/10">
                  Edit page
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.25)] lg:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.02)] p-6">
              <p className="text-sm text-[var(--brand-white)]/75">Supporters</p>
              <p className="mt-4 text-3xl font-semibold">0</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.02)] p-6">
              <p className="text-sm text-[var(--brand-white)]/75">Earnings</p>
              <p className="mt-4 text-3xl font-semibold">$0</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.02)] p-6">
              <p className="text-sm text-[var(--brand-white)]/75">Tasks</p>
              <p className="mt-4 text-3xl font-semibold">6</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-yellow)]">Setup checklist</p>
                <h2 className="mt-3 text-2xl font-semibold">0 of 6 complete</h2>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-[var(--brand-white)]/80">In progress</div>
            </div>

            <div className="mt-8 space-y-4">
              {steps.map((step) => (
                <div key={step.title} className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.02)] p-6">
                  <div>
                    <p className="text-base font-semibold">{step.title}</p>
                    <p className="mt-2 text-sm text-[var(--brand-white)]/70">{step.description}</p>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-2 text-sm text-[var(--brand-white)]/80">Open</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
