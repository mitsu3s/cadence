"use client";

import { useAuth } from "@/context/AuthContext";
import { Github, LogOut } from "lucide-react";
import Image from "next/image";


export default function LoginButton() {
  const { user, signInWithGithub, logout } = useAuth();

  if (user) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={32}
              height={32}
              className="rounded-full border border-zinc-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700" />
          )}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-zinc-200 truncate">{user.displayName}</span>
            <span className="text-xs text-zinc-500 truncate">{user.email}</span>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl py-2.5 text-sm font-medium transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGithub}
      className="flex items-center justify-center gap-2 w-full bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl py-3 text-sm font-bold transition-all shadow-lg shadow-zinc-900/20"
    >
      <Github size={18} />
      Sign in with GitHub
    </button>
  );
}
