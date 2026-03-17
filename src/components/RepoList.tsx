'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, GitFork, Eye, ExternalLink, Code, Search,
  Grid3X3, List, ArrowUpDown, Clock, Copy, Check
} from 'lucide-react';
import { GitHubRepo, getLanguageColor } from '@/lib/types';

type SortKey = 'stars' | 'forks' | 'updated' | 'name' | 'size';
type ViewMode = 'grid' | 'list';

export function RepoList({ repos }: { repos: GitHubRepo[] }) {
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('stars');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showCount, setShowCount] = useState(12);

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean) as string[]);
    return Array.from(langs).sort();
  }, [repos]);

  const filtered = useMemo(() => {
    let result = repos.filter(r => !r.fork);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
      );
    }
    if (language !== 'all') {
      result = result.filter(r => r.language === language);
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'stars': return b.stargazers_count - a.stargazers_count;
        case 'forks': return b.forks_count - a.forks_count;
        case 'updated': return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
        case 'name': return a.name.localeCompare(b.name);
        case 'size': return b.size - a.size;
        default: return 0;
      }
    });
    return result;
  }, [repos, search, language, sortBy]);

  const displayed = filtered.slice(0, showCount);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass text-sm text-[var(--foreground)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30"
          />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-4 py-2.5 rounded-xl glass text-sm text-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30 cursor-pointer"
        >
          <option value="all">All Languages</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="px-4 py-2.5 rounded-xl glass text-sm text-[var(--foreground)] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#22d3ee]/30 cursor-pointer"
        >
          <option value="stars">⭐ Most Stars</option>
          <option value="forks">🔱 Most Forks</option>
          <option value="updated">🕐 Recently Updated</option>
          <option value="name">🔤 Alphabetical</option>
          <option value="size">📦 Size</option>
        </select>
        <div className="flex gap-1 glass rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#22d3ee]/20 text-[#22d3ee]' : 'text-gray-400 hover:text-[var(--foreground)]'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#22d3ee]/20 text-[#22d3ee]' : 'text-gray-400 hover:text-[var(--foreground)]'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {displayed.length} of {filtered.length} repositories
      </p>

      {/* Repository list */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Code className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-gray-400">No repositories match your filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {displayed.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {displayed.map((repo, i) => (
              <RepoListItem key={repo.id} repo={repo} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load more */}
      {showCount < filtered.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => setShowCount(c => c + 12)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#a855f7] text-white font-semibold hover:opacity-90 transition-all"
          >
            Load More ({filtered.length - showCount} remaining)
          </button>
        </motion.div>
      )}
    </div>
  );
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const [copied, setCopied] = useState(false);
  const langColor = getLanguageColor(repo.language);
  const timeAgo = getTimeAgo(repo.pushed_at);

  const copyCloneUrl = () => {
    navigator.clipboard.writeText(repo.clone_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass rounded-xl p-5 group transition-all duration-300 hover:neon-glow-cyan relative overflow-hidden"
    >
      {/* Hover gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee]/0 to-[#a855f7]/0 group-hover:from-[#22d3ee]/5 group-hover:to-[#a855f7]/5 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-[var(--foreground)] hover:text-[#22d3ee] transition-colors flex items-center gap-2 group/link"
          >
            {repo.name}
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
          <button
            onClick={copyCloneUrl}
            className="p-1.5 rounded-lg glass opacity-0 group-hover:opacity-100 transition-opacity hover:neon-glow-cyan"
            title="Copy clone URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
          </button>
        </div>

        {/* Description */}
        {repo.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{repo.description}</p>
        )}

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {repo.topics.slice(0, 4).map(topic => (
              <span key={topic} className="text-xs px-2 py-0.5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/20">
                {topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="text-xs px-2 py-0.5 rounded-full glass text-gray-400">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: langColor }} />
                {repo.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#f59e0b]" />
              {repo.stargazers_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {repo.forks_count.toLocaleString()}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function RepoListItem({ repo, index }: { repo: GitHubRepo; index: number }) {
  const langColor = getLanguageColor(repo.language);
  const timeAgo = getTimeAgo(repo.pushed_at);

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ x: 4 }}
      className="glass rounded-xl p-4 flex items-center gap-4 group hover:neon-glow-cyan transition-all duration-300 block"
    >
      {/* Language dot */}
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: langColor }} />

      {/* Name + desc */}
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-[var(--foreground)] group-hover:text-[#22d3ee] transition-colors">
          {repo.name}
        </span>
        {repo.description && (
          <p className="text-xs text-gray-500 truncate">{repo.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-400 flex-shrink-0">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-[#f59e0b]" />
          {repo.stargazers_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          {repo.forks_count.toLocaleString()}
        </span>
        <span className="hidden sm:flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </span>
      </div>
    </motion.a>
  );
}

function getTimeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
