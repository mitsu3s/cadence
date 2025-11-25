"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { LayoutGrid, Github, Menu, X } from "lucide-react";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { useFetcher } from "@/hooks/useFetcher";
import { UserReposResponse } from "@/types";
import LoginButton from "./LoginButton";

interface SidebarContentProps {
  repo: string;
  days: string;
  handleRepoChange: (value: string) => void;
  handleDaysChange: (value: string) => void;
}

const SidebarContent = ({ repo, days, handleRepoChange, handleDaysChange }: SidebarContentProps) => {
  const { user } = useAuth();
  const fetcher = useFetcher();

  // @ts-expect-error - reloadUserInfo is not typed in standard Firebase User but exists
  const username = user?.reloadUserInfo?.screenName;

  const { data: userRepos } = useSWR<UserReposResponse>(
    username ? `/api/user/repos?user=${username}` : null,
    fetcher
  );

  return (
    <>
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
            {user && userRepos?.repositories && userRepos.repositories.length > 0 ? (
              <select
                value={repo}
                onChange={(e) => handleRepoChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-zinc-200 placeholder:text-zinc-600 py-1 appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Repository</option>
                {userRepos.repositories.map((r) => (
                  <option key={r} value={r} className="bg-zinc-900 text-zinc-200">
                    {r}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={repo}
                onChange={(e) => handleRepoChange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full text-zinc-200 placeholder:text-zinc-600"
                placeholder="owner/repo"
              />
            )}
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
      <LoginButton />
    </div>
  </>
  );
};

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false); // Close drawer on selection
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-500 rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-white" size={16} />
          </div>
          <span className="font-bold text-lg">Cadence</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-80 h-screen fixed left-0 top-0 border-r border-zinc-800 bg-zinc-950 p-6 flex-col gap-8 z-50">
        <SidebarContent
          repo={repo}
          days={days}
          handleRepoChange={handleRepoChange}
          handleDaysChange={handleDaysChange}
        />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="absolute left-0 top-16 bottom-0 w-3/4 max-w-xs bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col gap-8 animate-in slide-in-from-left duration-200">
            <SidebarContent
              repo={repo}
              days={days}
              handleRepoChange={handleRepoChange}
              handleDaysChange={handleDaysChange}
            />
          </aside>
        </div>
      )}
    </>
  );
}
