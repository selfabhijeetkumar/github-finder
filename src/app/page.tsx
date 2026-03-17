'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, Github, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground').then(m => ({ default: m.ParticleBackground })),
  { ssr: false }
);

const sampleUsers = [
  { name: 'torvalds', label: 'Linus Torvalds', desc: 'Linux Creator' },
  { name: 'gaearon', label: 'Dan Abramov', desc: 'React Core' },
  { name: 'sindresorhus', label: 'Sindre Sorhus', desc: 'Open Source Legend' },
  { name: 'tj', label: 'TJ Holowaychuk', desc: 'Express.js Creator' },
  { name: 'yyx990803', label: 'Evan You', desc: 'Vue.js Creator' },
];

export default function Home() {
  const [username, setUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(
    async (name?: string) => {
      const target = name || username.trim();
      if (!target) return;
      setIsSearching(true);
      router.push(`/user/${target}`);
    },
    [username, router]
  );

  return (
    <div className="min-h-screen animated-gradient-bg flex flex-col items-center justify-center relative overflow-hidden">
      <ParticleBackground />

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#22d3ee]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-4 max-w-3xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-[#22d3ee]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore the Developer Universe</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight"
        >
          <span className="text-[var(--foreground)]">GitHub</span>
          <br />
          <span className="gradient-text">Universe Explorer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-400 mb-12 max-w-xl mx-auto"
        >
          Transform any GitHub profile into an immersive 3D experience. Visualize contributions,
          explore repositories, and discover developer insights like never before.
        </motion.p>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative max-w-lg mx-auto mb-10"
        >
          <div className="gradient-border">
            <div className="relative glass rounded-2xl p-1">
              <div className="flex items-center">
                <div className="pl-5">
                  <Github className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter GitHub username..."
                  className="flex-1 bg-transparent px-4 py-4 text-lg text-[var(--foreground)] placeholder-gray-500 focus:outline-none font-medium"
                  aria-label="GitHub username search"
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={!username.trim() || isSearching}
                  className="mr-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#a855f7] text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Explore</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sample Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-sm text-gray-500 mb-4">Try these popular developers:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {sampleUsers.map((user, i) => (
              <motion.button
                key={user.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setUsername(user.name);
                  handleSearch(user.name);
                }}
                className="group glass rounded-xl px-4 py-3 cursor-pointer hover:neon-glow-cyan transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {user.label}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#22d3ee] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs text-gray-500">{user.desc}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
    </div>
  );
}
