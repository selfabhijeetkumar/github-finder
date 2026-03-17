'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Github, Search, Sun, Moon, GitCompareArrows } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'framer-motion';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/user/${searchValue.trim()}`);
      setSearchValue('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#22d3ee] to-[#a855f7] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Github className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-lg font-bold gradient-text">
              Universe Explorer
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search GitHub username..."
                className="w-full pl-10 pr-4 py-2 rounded-xl glass text-sm text-[var(--foreground)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/50 transition-all duration-300"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/compare"
              className="flex items-center gap-2 px-3 py-2 rounded-xl glass text-sm hover:neon-glow-purple transition-all duration-300 text-[var(--foreground)]"
            >
              <GitCompareArrows className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl glass hover:neon-glow-cyan transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
