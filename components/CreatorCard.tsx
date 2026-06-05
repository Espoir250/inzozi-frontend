import Link from "next/link";

type Creator = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  image?: string;
  monthly?: string;
};

export default function CreatorCard({ creator }: { creator: Creator }) {
  return (
    <article className="flex flex-col rounded-2xl border border-[var(--brand-black)] bg-[var(--brand-white)] p-6 shadow-sm transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--brand-yellow)] text-[var(--brand-black)] flex items-center justify-center text-xl font-semibold">{creator.name[0]}</div>
        <div>
          <h3 className="text-lg font-semibold">{creator.name}</h3>
          <p className="text-sm text-[var(--brand-black)]">@{creator.handle}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm text-[var(--brand-black)]">Starting</p>
          <p className="mt-1 text-lg font-semibold">{creator.monthly ?? "$3"}/mo</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--brand-black)]">{creator.bio}</p>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/support?creator=${encodeURIComponent(creator.id)}`}
          aria-label={`Support ${creator.name}`}
          className="grow inline-flex items-center justify-center rounded-full bg-[var(--brand-yellow)] px-4 py-2 text-sm font-semibold text-[var(--brand-black)]"
        >
          Support
        </Link>

        <Link
          href={`/learn?creator=${encodeURIComponent(creator.id)}`}
          aria-label={`Learn about ${creator.name}`}
          className="inline-flex items-center justify-center rounded-full border border-[var(--brand-black)] bg-[var(--brand-white)] px-4 py-2 text-sm font-medium text-[var(--brand-black)]"
        >
          Learn
        </Link>
      </div>
    </article>
  );
}
