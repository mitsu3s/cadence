"use client";

import { DailyStat } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
  RectangleProps,
} from "recharts";

interface Props {
  data: DailyStat[];
}

type StackKey = "push_commits" | "pr_opened" | "pr_merged";
const STACK_ORDER: StackKey[] = ["push_commits", "pr_opened", "pr_merged"];

interface CustomBarProps extends RectangleProps {
  payload?: DailyStat;
  dataKey?: StackKey;
}

// Custom bar shape: Apply top rounded corners only to the topmost bar
const CustomBar = (props: CustomBarProps) => {
  const { payload, dataKey } = props;

  if (!payload || !dataKey) {
    return <Rectangle {...props} />;
  }

  const currentIndex = STACK_ORDER.indexOf(dataKey);

  // Check the values of all bars above this bar
  const hasUpperBar = STACK_ORDER
    .slice(currentIndex + 1)
    .some(upperKey => payload[upperKey] > 0);

  // If there are no bars above, this is the topmost bar, so apply rounded corners
  const shouldRound = !hasUpperBar && payload[dataKey] > 0;

  return (
    <Rectangle
      {...props}
      radius={shouldRound ? [4, 4, 0, 0] : [0, 0, 0, 0]}
    />
  );
};

export default function ActivityChart({ data }: Props) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#52525b"
            tick={{ fontSize: 10, fill: "#71717a" }}
            tickFormatter={(value) => value.slice(5)}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#52525b"
            tick={{ fontSize: 10, fill: "#71717a" }}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#fafafa" }}
            cursor={{ fill: "#27272a" }}
          />
          <Bar dataKey="push_commits" name="Commits" stackId="a" fill="#3b82f6" shape={<CustomBar />} />
          <Bar dataKey="pr_opened" name="PR Opened" stackId="a" fill="#22c55e" shape={<CustomBar />} />
          <Bar dataKey="pr_merged" name="PR Merged" stackId="a" fill="#a855f7" shape={<CustomBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
