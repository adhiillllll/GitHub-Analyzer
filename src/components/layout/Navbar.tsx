'use client'

import React, { useState, useRef, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiSearch, BiPalette, BiSlider, BiInfoCircle } from 'react-icons/bi';
import { IoSettingsOutline, IoNotificationsOutline, IoMenu, IoClose } from 'react-icons/io5';

type NavbarProps = {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
};

export default function Navbar({ activeTab, onNavigateTab }: NavbarProps) {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHistoryActive = activeTab === 'History' || pathname === '/history';
  const isFavoritesActive = activeTab === 'Favorites' || pathname === '/favorites';
  const isDocsActive = activeTab === 'Docs' || pathname === '/docs';
  const isProfileActive = pathname === '/profile';

  return (
    <header className="w-full border-b border-[#1b202e] bg-[#0d1017] px-4 sm:px-6 py-3 flex items-center justify-between text-sm sticky top-0 z-50">

      <div className="flex items-center gap-6 sm:gap-8">
        <Link href="/" className="text-xl font-bold text-white tracking-wide hover:opacity-90 transition">
          CodeOrbit
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-slate-300 font-medium">
          <Link
            href="/history"
            onClick={() => onNavigateTab?.('History')}
            className={`hover:text-white transition py-1 ${isHistoryActive ? 'text-white border-b-2 border-[#00d68f]' : 'text-slate-400'}`}
          >
            History
          </Link>
          <Link
            href="/favorites"
            onClick={() => onNavigateTab?.('Favorites')}
            className={`hover:text-white transition py-1 ${isFavoritesActive ? 'text-white border-b-2 border-[#00d68f]' : 'text-slate-400'}`}
          >
            Favorites
          </Link>
          <Link
            href="/docs"
            onClick={() => onNavigateTab?.('Docs')}
            className={`hover:text-white transition py-1 ${isDocsActive ? 'text-white border-b-2 border-[#00d68f]' : 'text-slate-400'}`}
          >
            Docs
          </Link>
        </nav>
      </div>


      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Input UI */}
        <div className="hidden sm:flex items-center bg-[#141824] border border-[#232a3d] rounded-lg px-3 py-1.5 text-xs text-slate-300 w-48 sm:w-64 focus-within:border-slate-500 transition">
          <BiSearch className="text-slate-400 text-sm mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search ... find..."
            className="bg-transparent outline-none w-full text-slate-100 placeholder-slate-500"
          />
        </div>

        {/* Settings Popover */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
            }}
            className={`text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-[#191f2f] ${showSettings ? 'text-white bg-[#191f2f]' : ''}`}
            title="Settings"
          >
            <IoSettingsOutline className="text-lg" />
          </button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-56 bg-[#121622] border border-[#1e2434] rounded-xl shadow-2xl p-2 text-xs z-50 font-mono space-y-1">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 border-b border-[#1b202e] uppercase tracking-wider">
                Settings
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-[#1c2234] rounded-lg transition text-left">
                <BiPalette className="text-slate-400" />
                <span>Appearance</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-[#00d68f] hover:bg-[#1c2234] rounded-lg transition text-left">
                <BiSlider className="text-slate-400" />
                <span>Preferences</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-[#1c2234] rounded-lg transition text-left">
                <BiInfoCircle className="text-slate-400" />
                <span>About CodeOrbit</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
            }}
            className={`text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-[#191f2f] ${showNotifications ? 'text-white bg-[#191f2f]' : ''}`}
            title="Notifications"
          >
            <IoNotificationsOutline className="text-lg" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-[#121622] border border-[#1e2434] rounded-xl shadow-2xl p-4 text-xs z-50 font-mono text-center">
              <div className="text-[11px] font-semibold text-slate-400 border-b border-[#1b202e] pb-2 mb-3 text-left uppercase tracking-wider">
                Notifications
              </div>
              <p className="text-slate-400 py-3">No new notifications</p>
            </div>
          )}
        </div>

        <span className="h-4 w-px bg-[#232a3d] hidden sm:inline-block" />

        {/* Profile Link */}
        <Link
          href="/profile"
          className={`border text-xs px-3 py-1.5 rounded-lg font-medium transition ${
            isProfileActive
              ? 'border-[#00d68f] bg-[#00d68f]/10 text-[#00d68f]'
              : 'border-[#283147] bg-[#141824] text-slate-200 hover:bg-[#1b2234] hover:text-white'
          }`}
        >
          Profile
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-400 hover:text-white transition p-1.5"
          title="Toggle Menu"
        >
          {mobileMenuOpen ? <IoClose className="text-xl" /> : <IoMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0d1017] border-b border-[#1b202e] p-4 flex flex-col gap-3 md:hidden z-40">
          <Link
            href="/history"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold ${isHistoryActive ? 'bg-[#141824] text-white' : 'text-slate-400'}`}
          >
            History
          </Link>
          <Link
            href="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold ${isFavoritesActive ? 'bg-[#141824] text-white' : 'text-slate-400'}`}
          >
            Favorites
          </Link>
          <Link
            href="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className={`py-2 px-3 rounded-lg text-xs font-semibold ${isDocsActive ? 'bg-[#141824] text-white' : 'text-slate-400'}`}
          >
            Docs
          </Link>
        </div>
      )}
    </header>
  );
}
