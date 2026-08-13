'use client'

import React from 'react';
import Link from "next/link";
import { BiSearch } from 'react-icons/bi';
import { IoSettingsOutline, IoNotificationsOutline } from 'react-icons/io5';

type NavbarProps = {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
};

export default function Navbar({
  activeTab = 'Docs',
  onNavigateTab }: NavbarProps) {
  return (
    <header className="w-full border-b border-[#1b202e] bg-[#0d1017] px-6 py-3 flex items-center justify-between text-sm">

      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold text-white tracking-wide hover:opacity-90 transition" >
          RepoLens
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-slate-300 font-medium">
          <button
            onClick={() => onNavigateTab?.('History')}
            className={`hover:text-white transition ${activeTab === 'History' ? 'text-white border-b-2 border-slate-200 pb-0.5' : ''}`}
          >
            History
          </button>
          <button
            onClick={() => onNavigateTab?.('Favorites')}
            className={`hover:text-white transition ${activeTab === 'Favorites' ? 'text-white border-b-2 border-slate-200 pb-0.5' : ''}`}
          >
            Favorites
          </button>
          <button
            onClick={() => onNavigateTab?.('Docs')}
            className={`hover:text-white transition ${activeTab === 'Docs' ? 'text-white border-b-2 border-slate-200 pb-0.5' : ''}`}
          >
            Docs
          </button>
        </nav>
      </div>


      <div className="flex items-center gap-4">
        <div className="relative flex items-center bg-[#141824] border border-[#232a3d] rounded-lg px-3 py-1.5 text-xs text-slate-300 w-48 sm:w-64 focus-within:border-slate-500 transition">
          <BiSearch className="text-slate-400 text-sm mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search ... find..."
            className="bg-transparent outline-none w-full text-slate-100 placeholder-slate-500"
          />
        </div>

        <button className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-[#191f2f]">
          <IoSettingsOutline className="text-lg" />
        </button>
        <button className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-[#191f2f]">
          <IoNotificationsOutline className="text-lg" />
        </button>

        <span className="h-4 w-px bg-[#232a3d]" />

        <button className="border border-[#283147] bg-[#141824] text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-[#1b2234] hover:text-white transition">
          Profile
        </button>
      </div>
    </header>
  );
}
