"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-black/60 p-10 backdrop-blur-xl">
        <h1 className="text-4xl font-semibold">Something went wrong</h1>
        <p className="mt-4 text-base text-zinc-300">
          The app ran into an issue while loading. Refresh the page or try again later.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
        >
          Reload app
        </button>
      </div>
    </div>
  );
}
