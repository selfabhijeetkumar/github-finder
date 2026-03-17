'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, GitCompareArrows, Users, BookOpen, Star, GitFork, Loader2 } from 'lucide-react';
import { fetchUser, fetchAllRepos } from '@/lib/github';
import { GitHubUser, GitHubRepo } from '@/lib/types';
import { LanguageChart } from '@/components/LanguageChart';

interface CompareUser {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  languages: number;
}

function StatComparison({
  label,
  leftValue,
  rightValue,
  leftColor = '#22d3ee',
  rightColor = '#a855f7',
}: {
  label: string;
  leftValue: number;
  rightValue: number;
  leftColor?: string;
  rightColor?: string;
}) {
  const max = Math.max(leftValue, rightValue, 1);
  const leftWidth = (leftValue / max) * 100;
  const rightWidth = (rightValue / max) * 100;

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 text-center mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono w-16 text-right" style={{ color: leftColor }}>
          {leftValue.toLocaleString()}
        </span>
        <div className="flex-1 flex gap-1 h-6">
          <div className="flex-1 flex justify-end">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${leftWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-l-lg"
              style={{ background: leftColor, maxWidth: '100%' }}
            />
          </div>
          <div className="flex-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rightWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-r-lg"
              style={{ background: rightColor, maxWidth: '100%' }}
            />
          </div>
        </div>
        <span className="text-sm font-mono w-16" style={{ color: rightColor }}>
          {rightValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [leftUser, setLeftUser] = useState<CompareUser | null>(null);
  const [rightUser, setRightUser] = useState<CompareUser | null>(null);
  const [loading, setLoading] = useState<'left' | 'right' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async (username: string, side: 'left' | 'right') => {
    if (!username.trim()) return;
    setLoading(side);
    setError(null);
    try {
      const [user, repos] = await Promise.all([
        fetchUser(username.trim()),
        fetchAllRepos(username.trim()),
      ]);
      const data: CompareUser = {
        user,
        repos,
        totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
        totalForks: repos.reduce((s, r) => s + r.forks_count, 0),
        languages: new Set(repos.map(r => r.language).filter(Boolean)).size,
      };
      if (side === 'left') setLeftUser(data);
      else setRightUser(data);
    } catch (e) {
      setError(`User "${username}" not found`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 text-sm text-[#a855f7]">
          <GitCompareArrows className="w-4 h-4" />
          Developer Comparison
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Compare <span className="gradient-text">Developers</span>
        </h1>
        <p className="text-gray-400 mt-2">Side-by-side comparison of GitHub profiles</p>
      </motion.div>

      {/* Search inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {(['left', 'right'] as const).map((side) => {
          const inputValue = side === 'left' ? leftInput : rightInput;
          const setInput = side === 'left' ? setLeftInput : setRightInput;
          const userData = side === 'left' ? leftUser : rightUser;
          const accentColor = side === 'left' ? '#22d3ee' : '#a855f7';

          return (
            <motion.div
              key={side}
              initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadUser(inputValue, side);
                }}
                className="flex gap-2 mb-4"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`${side === 'left' ? 'First' : 'Second'} username...`}
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass text-sm text-[var(--foreground)] placeholder-gray-500 focus:outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': `${accentColor}50` } as React.CSSProperties}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || loading === side}
                  className="px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-40 transition-all"
                  style={{ background: accentColor }}
                >
                  {loading === side ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Load'}
                </button>
              </form>

              {/* User card */}
              {userData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={userData.user.avatar_url}
                      alt={userData.user.login}
                      className="w-14 h-14 rounded-full border-2"
                      style={{ borderColor: accentColor }}
                    />
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">
                        {userData.user.name || userData.user.login}
                      </h3>
                      <p className="text-xs text-gray-500">@{userData.user.login}</p>
                    </div>
                  </div>
                  {userData.user.bio && (
                    <p className="text-xs text-gray-400 line-clamp-2">{userData.user.bio}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl p-4 text-center text-red-400 text-sm mb-6"
        >
          {error}
        </motion.div>
      )}

      {/* Comparison results */}
      {leftUser && rightUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Head-to-head stats */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] text-center mb-6">Head-to-Head</h3>
            <StatComparison label="Public Repos" leftValue={leftUser.user.public_repos} rightValue={rightUser.user.public_repos} />
            <StatComparison label="Followers" leftValue={leftUser.user.followers} rightValue={rightUser.user.followers} />
            <StatComparison label="Following" leftValue={leftUser.user.following} rightValue={rightUser.user.following} />
            <StatComparison label="Total Stars" leftValue={leftUser.totalStars} rightValue={rightUser.totalStars} />
            <StatComparison label="Total Forks" leftValue={leftUser.totalForks} rightValue={rightUser.totalForks} />
            <StatComparison label="Languages" leftValue={leftUser.languages} rightValue={rightUser.languages} />
            <StatComparison label="Gists" leftValue={leftUser.user.public_gists} rightValue={rightUser.user.public_gists} />
          </div>

          {/* Language comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-[#22d3ee] mb-3 text-center">{leftUser.user.login}&apos;s Languages</h3>
              <LanguageChart repos={leftUser.repos} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#a855f7] mb-3 text-center">{rightUser.user.login}&apos;s Languages</h3>
              <LanguageChart repos={rightUser.repos} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
