'use client'

import React from 'react';
import Image from 'next/image';
import { BiFolder, BiBarChartAlt2, BiShieldQuarter, BiCategory, BiTerminal, BiListUl } from 'react-icons/bi';

type SidebarProps = {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onNewAnalysis?: () => void;
};

export default function Sidebar({
  activeTab = 'Summary',
  onSelectTab,
  onNewAnalysis,
}: SidebarProps) {
  const menuItems = [
    { id: 'Summary', label: 'Summary', icon: BiFolder },
    { id: 'Code Health', label: 'Code Health', icon: BiBarChartAlt2 },
    { id: 'Security', label: 'Security', icon: BiShieldQuarter },
    { id: 'Dependencies', label: 'Dependencies', icon: BiCategory },
  ];

  return (
    <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-[#1b202e] bg-[#0d1017] p-5 flex flex-col justify-between shrink-0 min-h-[calc(100vh-60px)]">
      <div className="space-y-6">
        {/* RepoLens Analysis Card */}
        <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-3.5 flex items-center gap-3">
          <Image
            src="/screen.png"
            alt="CodeOrbit"
            width={72}
            height={72}
            className="w-18 h-18 object-contain shrink-0"
          />

          <div>
            <h4 className="text-xs font-bold text-slate-100 tracking-tight">
              CodeOrbit Analysis
            </h4>

            <span className="text-[11px] font-mono text-slate-500">
              v2.4.0-stable
            </span>
          </div>
        </div>

        {/* New Analysis Button */}
        <button
          onClick={onNewAnalysis}
          className="w-full bg-[#9bb8ff] hover:bg-[#8ab0ff] text-[#0a1020] font-semibold text-xs py-2.5 px-4 rounded-lg transition active:scale-[0.98] shadow"
        >
          New Analysis
        </button>

        {/* Main Navigation Tabs */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab?.(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${isActive
                  ? 'bg-[#00d68f] text-[#081510]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141824]'
                  }`}
              >
                <Icon className={`text-base ${isActive ? 'text-[#081510]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="pt-6 border-t border-[#1b202e] space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#141824] rounded-lg transition">
          <BiTerminal className="text-base text-slate-400" />
          <span>Terminal</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#141824] rounded-lg transition">
          <BiListUl className="text-base text-slate-400" />
          <span>Logs</span>
        </button>
      </div>
    </aside>
  );
}
