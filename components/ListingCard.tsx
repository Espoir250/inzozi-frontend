import type { Listing } from "@/lib/listings";

type ListingCardProps = {
  listing: Listing;
};

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className={`h-52 bg-gradient-to-br ${listing.accent} p-5 text-white`}> 
        <div className="flex h-full flex-col justify-between rounded-[2rem] p-5 backdrop-blur-xl">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/90">
              {listing.category}
            </span>
            <h3 className="text-2xl font-semibold">{listing.title}</h3>
          </div>
          <div className="flex items-center justify-between text-sm text-white/90">
            <span>{listing.location}</span>
            <span className="font-semibold">{listing.rating} ★</span>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-6 text-zinc-950 dark:text-zinc-100">
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{listing.description}</p>
        <div className="flex flex-wrap gap-2">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4">
          <span className="text-lg font-semibold">{listing.pricePerNight}</span>
          <button className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100">
            View Stay
          </button>
        </div>
      </div>
    </article>
  );
}
