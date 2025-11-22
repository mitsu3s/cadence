import { StatsDailyResponse } from "../types";
import { GitCommit, GitPullRequest, Zap } from "lucide-react";

interface Props {
  stats: StatsDailyResponse;
}

export default function StatsCards({ stats }: Props) {
  const totalCommits = stats.stats.reduce((acc, curr) => acc + curr.push_commits, 0);
  const totalPRs = stats.stats.reduce((acc, curr) => acc + curr.pr_opened + curr.pr_merged, 0);
  const totalActivity = stats.stats.reduce((acc, curr) => acc + curr.total_activity, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
          <Zap size={24} />
        </div>
        <div>
          <p className="text-muted text-sm">Total Activity</p>
          <p className="text-2xl font-bold">{totalActivity}</p>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div className="p-3 rounded-full bg-green-500/10 text-green-500">
          <GitCommit size={24} />
        </div>
        <div>
          <p className="text-muted text-sm">Commits Pushed</p>
          <p className="text-2xl font-bold">{totalCommits}</p>
        </div>
      </div>

      <div className="card flex items-center gap-4">
        <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
          <GitPullRequest size={24} />
        </div>
        <div>
          <p className="text-muted text-sm">PR Activity</p>
          <p className="text-2xl font-bold">{totalPRs}</p>
        </div>
      </div>
    </div>
  );
}
