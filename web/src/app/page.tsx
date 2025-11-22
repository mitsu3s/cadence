import { fetchStats, fetchTimeline, fetchRhythm } from "../lib/api";
import DashboardContent from "../components/DashboardContent";
import Sidebar from "../components/Sidebar";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const repo = (params.repo as string) || "username/repository";
  const days = Number(params.days) || 7;

  // Fetch data on the server
  const stats = await fetchStats(repo, days);
  const rhythm = await fetchRhythm(repo, days);

  // For timeline, use today's date or the one from params if we supported it
  const today = new Date().toISOString().split("T")[0];
  const timeline = await fetchTimeline(repo, today);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
      <Sidebar />
      <main className="pl-80">
        <div className="container p-8 pt-12">
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
            <p className="text-zinc-400">Overview of development activity for <span className="text-zinc-200 font-medium">{repo}</span></p>
          </header>
          <DashboardContent stats={stats} timeline={timeline} rhythm={rhythm} />
        </div>
      </main>
    </div>
  );
}
