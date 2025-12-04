import { TimelineItem } from "../types";
import { GitCommit, GitPullRequest, GitMerge, Circle } from "lucide-react";
import { Dictionary } from "@/get-dictionary";

interface Props {
  items: TimelineItem[];
  dictionary: Dictionary;
}

export default function Timeline({ items, dictionary }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-zinc-500 text-sm text-center py-8">
        {dictionary.dashboard.timeline.emptyState}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 p-4 hover:bg-zinc-800/50 rounded-xl transition-colors group">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
              {getIcon(item)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm font-medium text-zinc-200 truncate">{item.actor}</p>
              <span className="text-xs text-zinc-500 whitespace-nowrap">
                {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-0.5 truncate">
              {getDescription(item)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getIcon(item: TimelineItem) {
  if (item.type === "push") return <GitCommit size={14} className="text-blue-500" />;
  if (item.type === "pull_request") {
    if (item.action === "merged" || item.pr_is_merged) return <GitMerge size={14} className="text-green-500" />;
    return <GitPullRequest size={14} className="text-purple-500" />;
  }
  return <Circle size={14} className="text-zinc-500" />;
}

function getDescription(item: TimelineItem) {
  if (item.type === "push") {
    return `Pushed ${item.push_commit_count} commits to ${item.push_branch}`;
  }
  if (item.type === "pull_request") {
    return `${item.action} PR #${item.pr_number}: ${item.pr_title}`;
  }
  return `${item.action} on ${item.repo}`;
}
