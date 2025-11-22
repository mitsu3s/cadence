"use client";

import { PunchCardItem } from "../types";

interface Props {
  data: PunchCardItem[];
}

export default function PunchCard({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end justify-between h-[243px] gap-1">
      {data.map((item) => {
        const intensity = item.count / maxCount;
        let bgClass = "bg-zinc-800";
        if (intensity > 0) bgClass = "bg-purple-900/40";
        if (intensity > 0.25) bgClass = "bg-purple-800/60";
        if (intensity > 0.5) bgClass = "bg-purple-600";
        if (intensity > 0.75) bgClass = "bg-purple-500";

        return (
          <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 group h-full">
            <div className="w-full relative h-full flex items-end">
              <div
                className={`w-full rounded-sm transition-all duration-300 ${bgClass} group-hover:opacity-80`}
                style={{ height: `${Math.max((item.count / maxCount) * 100, 10)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-600 font-medium group-hover:text-zinc-400 transition-colors">
              {item.hour}
            </span>
          </div>
        );
      })}
    </div>
  );
}
