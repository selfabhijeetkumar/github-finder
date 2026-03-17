'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, UserPlus, Star, GitFork, Code } from 'lucide-react';
import { GitHubUser, GitHubRepo } from '@/lib/types';

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
}

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  glowClass: string;
}

export function StatsGrid({ user, repos }: { user: GitHubUser; repos: GitHubRepo[] }) {
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);

  const stats: StatItem[] = [
    { label: 'Repositories', value: user.public_repos, icon: BookOpen, color: '#22d3ee', glowClass: 'neon-glow-cyan' },
    { label: 'Followers', value: user.followers, icon: Users, color: '#a855f7', glowClass: 'neon-glow-purple' },
    { label: 'Following', value: user.following, icon: UserPlus, color: '#4ade80', glowClass: 'neon-glow-green' },
    { label: 'Total Stars', value: totalStars, icon: Star, color: '#f59e0b', glowClass: '' },
    { label: 'Total Forks', value: totalForks, icon: GitFork, color: '#ef4444', glowClass: '' },
    { label: 'Public Gists', value: user.public_gists, icon: Code, color: '#06b6d4', glowClass: '' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon as any;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="glass rounded-xl p-4 sm:p-5 text-center cursor-default group transition-all duration-300"
          >
            <div
              className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <Icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] mb-1">
              <AnimatedCounter value={stat.value} />
            </div>
            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
