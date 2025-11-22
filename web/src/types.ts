export interface DailyStat {
  date: string;
  push_count: number;
  push_commits: number;
  pr_opened: number;
  pr_closed: number;
  pr_merged: number;
  pr_synchronized: number;
  total_activity: number;
}

export interface StatsDailyResponse {
  repo: string;
  days: number;
  from: string;
  to: string;
  stats: DailyStat[];
}

export interface TimelineItem {
  time: string;
  type: string;
  repo: string;
  actor: string;
  action: string;
  pr_number?: number;
  pr_title?: string;
  pr_is_merged?: boolean;
  pr_base_branch?: string;
  push_branch?: string;
  push_commit_count?: number;
}

export interface MomentumPoint {
  date: string;
  value: number;
}

export interface PunchCardItem {
  hour: number;
  count: number;
}

export interface StreakInfo {
  current: number;
  longest: number;
}

export interface RhythmResponse {
  momentum: MomentumPoint[];
  punch_card: PunchCardItem[];
  streak: StreakInfo;
}
