"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { LayoutGrid, Github } from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const repo = searchParams.get("repo") || "username/repository";
  const days = searchParams.get("days") || "7";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleRepoChange = (value: string) => {
    router.push("?" + createQueryString("repo", value));
  };

  const handleDaysChange = (value: string) => {
    router.push("?" + createQueryString("days", value));
  };

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 border-r border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-8 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-stone-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <LayoutGrid className="text-white" size={20} />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">Cadence</h1>
          <p className="text-xs text-zinc-500">Rhythm Visualizer</p>
        </div>
      </div>

      {/* Navigation / Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">Repository</label>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1 flex items-center focus-within:border-zinc-600 transition-colors">
            <div className="p-2 text-zinc-500">
              <Github size={18} />
            </div>
            <input
              type="text"
              value={repo}
              onChange={(e) => handleRepoChange(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-zinc-200 placeholder:text-zinc-600"
              placeholder="owner/repo"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2">Time Range</label>
          <div className="grid grid-cols-2 gap-2">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => handleDaysChange(d.toString())}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  Number(days) === d
                    ? "bg-zinc-100 text-zinc-900"
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/50">
          <p className="text-xs text-zinc-500 leading-relaxed">
            Visualize your coding momentum and find your flow state.
          </p>
        </div>
      </div>
    </aside>
  );
}
