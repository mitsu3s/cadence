import { LayoutGrid, TrendingUp, Zap, Github, ArrowRight, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Locale } from "@/i18n-config";
import Link from "next/link";

import { Dictionary } from "@/get-dictionary";

interface Props {
  dictionary: Dictionary;
  lang: Locale;
}

export default function LandingPage({ dictionary, lang }: Props) {
  const { signInWithGithub } = useAuth();
  const t = dictionary.landingPage;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <LayoutGrid className="text-white" size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight">Cadence</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">{dictionary.common.features}</a>
            <Link href={`/${lang}/docs`} className="hover:text-white transition-colors">{dictionary.common.documentation}</Link>
          </nav>
          <div className="flex items-center gap-4">
             <button
               onClick={signInWithGithub}
               className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
             >
               {dictionary.common.signIn}
             </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 opacity-50" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10 opacity-30" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t.hero.badge}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 max-w-4xl mx-auto leading-tight whitespace-pre-line">
            {t.hero.title}
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={signInWithGithub}
              className="h-12 px-8 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              <Github size={18} />
              {t.hero.cta}
            </button>
            <Link href={`/${lang}/docs`} className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
              {t.hero.readDocs}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-950/50 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100">{t.features.momentum.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t.features.momentum.description}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100">{t.features.streak.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t.features.streak.description}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100">{t.features.insights.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {t.features.insights.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-stone-600 rounded-md flex items-center justify-center">
              <LayoutGrid className="text-white" size={12} />
            </div>
            <span className="font-bold text-zinc-400">Cadence</span>
          </div>
          <p className="text-sm text-zinc-600">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
