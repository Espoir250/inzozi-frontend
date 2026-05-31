import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Search } from "lucide-react";

export const SearchCreators: React.FC = () => {
  const { creators } = useApp();
  const [query, setQuery] = useState("");
  const filtered = creators.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search creators..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 focus:outline-none focus:border-purple-500"
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-zinc-500">No creators found.</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map(c => (
            <li
              key={c.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <span className="text-2xl">{c.avatar}</span>
              <div>
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-xs text-zinc-400">{c.niche}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
