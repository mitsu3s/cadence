"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function DashboardHeader() {
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
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 py-6 border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
      <div>
        <h1 className="text-3xl font-bold text-gradient tracking-tight">Cadence</h1>
        <p className="text-muted text-sm">Development Rhythm Visualization</p>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md border border-border/50 rounded-lg px-3 py-2 shadow-sm transition-all hover:border-primary/50">
          <span className="text-muted text-sm">Repo:</span>
          <input
            type="text"
            value={repo}
            onChange={(e) => handleRepoChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-48 text-foreground placeholder:text-muted/50"
            placeholder="owner/repo"
          />
        </div>
        <select
          value={days}
          onChange={(e) => handleDaysChange(e.target.value)}
          className="bg-card/50 backdrop-blur-md border border-border/50 rounded-lg px-3 py-2 text-sm outline-none shadow-sm transition-all hover:border-primary/50 cursor-pointer"
        >
          <option value={7}>7 Days</option>
          <option value={14}>14 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
        </select>
      </div>
    </header>
  );
}
