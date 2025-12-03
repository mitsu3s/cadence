import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { TrendingUp, Zap, Activity, GitBranch } from "lucide-react";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function IntroductionPage({ params }: Props) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = dictionary.docs.introduction;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-white">{t.title}</h1>
        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-invert prose-zinc max-w-none">
        <p className="text-lg text-zinc-300 leading-relaxed">
          {t.description}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-4">
            <TrendingUp size={20} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">{t.features.momentum.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.momentum.description}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 mb-4">
            <Zap size={20} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">{t.features.streak.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.streak.description}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 mb-4">
            <GitBranch size={20} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">{t.features.multiRepo.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.multiRepo.description}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500 mb-4">
            <Activity size={20} />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">{t.features.realtime.title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {t.features.realtime.description}
          </p>
        </div>
      </div>
    </div>
  );
}
