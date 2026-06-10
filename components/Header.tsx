import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--brand-white)] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-[var(--brand-black)]">
          <span className="inline-block h-8 w-8 rounded-md bg-[var(--brand-yellow)]" />
          Inzozi
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/explore-creators" className="text-sm text-[var(--brand-black)] hover:underline">
            Explore
          </Link>
          <Link href="/view-tiers" className="text-sm text-[var(--brand-black)] hover:underline">
            Tiers
          </Link>
          <Link href="/support" className="text-sm text-[var(--brand-black)] hover:underline">
            Support
          </Link>
          <Link href="/learn" className="text-sm text-[var(--brand-black)] hover:underline">
            Learn
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/start-page"
            className="hidden rounded-full border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-2 text-sm font-medium text-[var(--brand-black)] sm:inline-flex"
          >
            Start a page
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-yellow)] px-4 py-2 text-sm font-semibold text-[var(--brand-black)]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
