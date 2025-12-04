import DocsSidebar from "@/components/DocsSidebar";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-blue-500/30 flex">
      <DocsSidebar dictionary={dictionary} lang={lang as Locale} />
      <main className="flex-1 md:pl-64 pt-16 md:pt-0">
        <div className="container max-w-4xl mx-auto px-6 py-8 md:px-12 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
