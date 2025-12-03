"use client";

import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { useFetcher } from "@/hooks/useFetcher";
import { StatsDailyResponse, TimelineResponse, RhythmResponse } from "../types";
import { Activity, Calendar, Zap, Clock, Flame, TrendingUp } from "lucide-react";
import ActivityChart from "./ActivityChart";
import Timeline from "./Timeline";
import RhythmWave from "./RhythmWave";
import PunchCard from "./PunchCard";

import { Dictionary } from "@/get-dictionary";

interface Props {
  repo: string;
  days: number;
  dictionary: Dictionary;
}

export default function DashboardContent({ repo, days, dictionary }: Props) {
  const { user, loading: authLoading } = useAuth();
  const fetcher = useFetcher();

  const shouldFetch = !!user;

  const { data: stats, error: statsError } = useSWR<StatsDailyResponse>(
    shouldFetch ? `/stats/daily?repo=${repo}&days=${days}` : null,
    fetcher
  );

  const { data: rhythm, error: rhythmError } = useSWR<RhythmResponse>(
    shouldFetch ? `/stats/rhythm?repo=${repo}&days=${days}` : null,
    fetcher
  );

  const today = new Date().toISOString().split("T")[0];
  const { data: timeline, error: timelineError } = useSWR<TimelineResponse>(
    shouldFetch ? `/timeline?repo=${repo}&date=${today}` : null,
    fetcher
  );

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="text-zinc-500 animate-pulse">{dictionary.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[400px] gap-4">
        <div className="text-zinc-400">Please sign in to view the dashboard.</div>
      </div>
    );
  }

  if (statsError || rhythmError || timelineError) {
    const errors = [];
    if (statsError) errors.push(`Stats: ${statsError.message}`);
    if (rhythmError) errors.push(`Rhythm: ${rhythmError.message}`);
    if (timelineError) errors.push(`Timeline: ${timelineError.message}`);

    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
        <p className="font-bold mb-2">Error loading data:</p>
        <ul className="list-disc list-inside text-sm">
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      </div>
    );
  }

  if (!stats || !rhythm || !timeline) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="text-zinc-500 animate-pulse">{dictionary.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10 animate-fade-in">
      {/* Hero Card: Momentum */}
      <div className="md:col-span-2 lg:col-span-3 bento-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <TrendingUp size={20} />
            </div>
            <h2 className="text-lg font-medium text-zinc-200">{dictionary.dashboard.rhythm.title}</h2>
          </div>
          <RhythmWave data={rhythm.momentum} />
        </div>
      </div>

      {/* Streak Card */}
      <div className="bento-card p-8 flex flex-col justify-between bg-gradient-to-br from-zinc-900 to-zinc-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
            <Flame size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">{dictionary.dashboard.stats.currentStreak}</h2>
        </div>
        <div className="text-center py-4">
          <span className="text-6xl font-bold text-white tracking-tighter">{rhythm.streak.current}</span>
          <p className="text-sm text-zinc-500 mt-2 font-medium uppercase tracking-wide">{dictionary.sidebar.days}</p>
        </div>
        <div className="text-center pt-4 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500">{dictionary.dashboard.stats.longestStreak}: <span className="text-zinc-300">{rhythm.streak.longest} {dictionary.sidebar.days}</span></p>
        </div>
      </div>

      {/* Punch Card */}
      <div className="md:col-span-2 bento-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
            <Clock size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">{dictionary.dashboard.rhythm.description}</h2>
        </div>
        <PunchCard data={rhythm.punch_card} />
      </div>

      {/* Activity Chart */}
      <div className="md:col-span-2 bento-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <Activity size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">{dictionary.dashboard.stats.totalActivity}</h2>
        </div>
        <ActivityChart data={stats.stats} />
      </div>

      {/* Timeline (Full Height) */}
      <div className="md:col-span-1 lg:col-span-4 bento-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
            <Calendar size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">{dictionary.dashboard.timeline.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Timeline items={timeline} />
        </div>
      </div>
    </div>
  );
}
