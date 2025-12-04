"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Terminal, LayoutGrid, ArrowLeft, Menu, X } from "lucide-react";
import { Locale } from "@/i18n-config";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState } from "react";

import { Dictionary } from "@/get-dictionary";

interface DocsSidebarProps {
  dictionary: Dictionary;
  lang: Locale;
}

export default function DocsSidebar({ dictionary, lang }: DocsSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      title: dictionary.docs.sidebar.gettingStarted,
      links: [
        { label: dictionary.docs.sidebar.introduction, href: `/${lang}/docs`, icon: Book },
        { label: dictionary.docs.sidebar.quickStart, href: `/${lang}/docs/quick-start`, icon: Terminal },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 z-40">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-zinc-200">
          <div className="w-8 h-8 bg-stone-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <LayoutGrid className="text-white" size={16} />
          </div>
          <span className="font-bold text-lg tracking-tight">Cadence</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-zinc-400 hover:text-white p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 h-screen fixed left-0 top-0 border-r border-zinc-800 bg-black flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <div className="p-6 border-b border-zinc-800 hidden md:block">
          <Link href={`/${lang}`} className="flex items-center gap-2 text-zinc-200 hover:text-white transition-colors">
            <div className="w-8 h-8 bg-stone-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <LayoutGrid className="text-white" size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight">Cadence</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 mt-16 md:mt-0">
          <div className="flex flex-col gap-8">
            {items.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">
                  {section.title}
                </h3>
                <div className="flex flex-col gap-1">
                  {section.links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                        }`}
                      >
                        <Icon size={16} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800 flex flex-col gap-4">
          <LanguageSwitcher />
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={16} />
            {dictionary.common.backToApp}
          </Link>
        </div>
      </aside>
    </>
  );
}
