"use client";

import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { useFetcher } from "@/hooks/useFetcher";
import { StatsDailyResponse, TimelineItem, RhythmResponse } from "../types";
import { Activity, Calendar, Zap, Clock, Flame, TrendingUp } from "lucide-react";
import ActivityChart from "./ActivityChart";
import Timeline from "./Timeline";
import RhythmWave from "./RhythmWave";
import PunchCard from "./PunchCard";

interface Props {
  repo: string;
  days: number;
}

export default function DashboardContent({ repo, days }: Props) {
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
  const { data: timeline, error: timelineError } = useSWR<TimelineItem[]>(
    shouldFetch ? `/timeline?repo=${repo}&date=${today}` : null,
    fetcher
  );

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="text-zinc-500 animate-pulse">Initializing auth...</div>
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
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="text-red-400">Error loading data. Please try again.</div>
      </div>
    );
  }

  if (!stats || !rhythm || !timeline) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="text-zinc-500 animate-pulse">Loading dashboard data...</div>
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
            <h2 className="text-lg font-medium text-zinc-200">Momentum Flow</h2>
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
          <h2 className="text-lg font-medium text-zinc-200">Streak</h2>
        </div>
        <div className="text-center py-4">
          <span className="text-6xl font-bold text-white tracking-tighter">{rhythm.streak.current}</span>
          <p className="text-sm text-zinc-500 mt-2 font-medium uppercase tracking-wide">Days Active</p>
        </div>
        <div className="text-center pt-4 border-t border-zinc-800/50">
          <p className="text-xs text-zinc-500">Longest: <span className="text-zinc-300">{rhythm.streak.longest} Days</span></p>
        </div>
      </div>

      {/* Punch Card */}
      <div className="md:col-span-2 bento-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
            <Clock size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">Daily Rhythm</h2>
        </div>
        <PunchCard data={rhythm.punch_card} />
      </div>

      {/* Activity Chart */}
      <div className="md:col-span-2 bento-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
            <Activity size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">Activity Volume</h2>
        </div>
        <ActivityChart data={stats.stats} />
      </div>

      {/* Timeline (Full Height) */}
      <div className="md:col-span-1 lg:col-span-4 bento-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
            <Calendar size={20} />
          </div>
          <h2 className="text-lg font-medium text-zinc-200">Recent Events</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Timeline items={timeline} />
        </div>
      </div>
    </div>
  );
}
