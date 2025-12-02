import { getDictionary } from "@/get-dictionary";
import HomeClient from "../../components/HomeClient";
import { Locale } from "@/i18n-config";

interface Props {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ params, searchParams }: Props) {
  const { lang } = await params;
  const search = await searchParams;
  const repo = (search.repo as string) || "username/repository";
  const days = Number(search.days) || 7;

  const dictionary = await getDictionary(lang as Locale);

  return <HomeClient repo={repo} days={days} dictionary={dictionary} lang={lang as Locale} />;
}
