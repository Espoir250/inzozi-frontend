export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-base text-slate-300">The destination you are looking for does not exist yet.</p>
      </div>
    </div>
  );
}
