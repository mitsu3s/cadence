import DashboardContent from "../components/DashboardContent";
import Sidebar from "../components/Sidebar";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const repo = (params.repo as string) || "username/repository";
  const days = Number(params.days) || 7;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
      <Sidebar />
      <main className="md:pl-80 pt-16 md:pt-0">
        <div className="container p-4 md:p-8 md:pt-12">
          <header className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
              <p className="text-zinc-400">Overview of development activity for <span className="text-zinc-200 font-medium">{repo}</span></p>
            </div>
          </header>
          <DashboardContent repo={repo} days={days} />
        </div>
      </main>
    </div>
  );
}
