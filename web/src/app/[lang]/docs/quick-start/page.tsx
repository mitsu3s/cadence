import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Github, LayoutGrid, MousePointerClick } from "lucide-react";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function QuickStartPage({ params }: Props) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const t = dictionary.docs.quickStart;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{t.title}</h1>
        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-0 relative">
        {/* Connecting Line - Full height on mobile and desktop */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-zinc-800 -z-10" />

        {/* Step 1 */}
        <div className="flex gap-6 md:gap-8 relative pb-8 md:pb-12">
          <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center z-10">
            <Github size={20} className="text-white" />
          </div>
          <div className="space-y-4 pt-2 flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-zinc-100">{t.steps.step1.title}</h3>
            <p className="text-zinc-400 leading-relaxed">
              {t.steps.step1.description}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-400">
                {t.steps.step1.note}
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-6 md:gap-8 relative pb-8 md:pb-12">
          <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center z-10">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <div className="space-y-4 pt-2 flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-zinc-100">{t.steps.step2.title}</h3>
            <p className="text-zinc-400 leading-relaxed">
              {t.steps.step2.description}
            </p>
            <p className="text-zinc-500 text-sm">
              {t.steps.step2.subDescription}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-6 md:gap-8 relative">
          <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center z-10">
            <MousePointerClick size={20} className="text-white" />
          </div>
          <div className="space-y-4 pt-2 flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-zinc-100">{t.steps.step3.title}</h3>
            <p className="text-zinc-400 leading-relaxed">
              {t.steps.step3.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
