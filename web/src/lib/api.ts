import { StatsDailyResponse, TimelineItem, RhythmResponse } from "../types";

const API_BASE_URL = process.env.API_BASE_URL;

export async function fetchStats(repo: string, days: number): Promise<StatsDailyResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stats/daily?repo=${repo}&days=${days}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export async function fetchTimeline(repo: string, date: string): Promise<TimelineItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/timeline?repo=${repo}&date=${date}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return [];
  }
}

export async function fetchRhythm(repo: string, days: number): Promise<RhythmResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/stats/rhythm?repo=${repo}&days=${days}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching rhythm:", error);
    return null;
  }
}
