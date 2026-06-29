"use client";

import { FaBars, FaMoon, FaSun, FaBell, FaChevronDown } from "react-icons/fa";
import { useTheme } from "@/components/ThemeProvider";
import { useSidebar } from "@/components/SidebarContext";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-50 h-[70px] border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-between px-6 transition-colors">
      {/* Left side: Hamburger menu */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Icon */}
        <button 
          onClick={toggleTheme}
          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
        </button>

        {/* Notifications Bell with Badge */}
        <button 
          className="relative text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-2 rounded-lg transition-colors cursor-pointer"
          aria-label="View Notifications"
        >
          <FaBell size={18} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </button>

        {/* Production Badge */}
        <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
          Production
        </span>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 transition-colors"></div>

        {/* User Profile Avatar with dropdown */}
        <button className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-left">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-zinc-400 font-medium leading-none">Admin</p>
            <p className="text-[10px] text-zinc-500 leading-none mt-0.5">Admin User</p>
          </div>
          <FaChevronDown size={12} className="text-zinc-500" />
        </button>
      </div>
    </header>
  );
}
