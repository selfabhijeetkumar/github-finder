'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { GitHubRepo, GitHubEvent, getLanguageColor } from '@/lib/types';

export function InsightsPanel({ repos, events }: { repos: GitHubRepo[]; events: GitHubEvent[] }) {
  // Repo creation timeline
  const creationTimeline = useMemo(() => {
    const years: Record<string, number> = {};
    repos.forEach(r => {
      const year = new Date(r.created_at).getFullYear().toString();
      years[year] = (years[year] || 0) + 1;
    });
    return Object.entries(years)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, count]) => ({ year, count }));
  }, [repos]);

  // Top languages by stars
  const languageStars = useMemo(() => {
    const stats: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) {
        stats[r.language] = (stats[r.language] || 0) + r.stargazers_count;
      }
    });
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([language, stars]) => ({ language, stars, fill: getLanguageColor(language) }));
  }, [repos]);

  // Activity by hour
  const activityByHour = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: `${i}:00`, count: 0 }));
    events.forEach(e => {
      const hour = new Date(e.created_at).getHours();
      hours[hour].count++;
    });
    return hours;
  }, [events]);

  // Summary stats
  const avgStars = repos.length > 0
    ? Math.round(repos.reduce((s, r) => s + r.stargazers_count, 0) / repos.length)
    : 0;
  const topRepo = repos.reduce((max, r) =>
    r.stargazers_count > (max?.stargazers_count || 0) ? r : max, repos[0]);
  const languages = new Set(repos.map(r => r.language).filter(Boolean));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Languages Used', value: languages.size, color: '#a855f7' },
          { label: 'Avg Stars/Repo', value: avgStars, color: '#f59e0b' },
          { label: 'Top Repo Stars', value: topRepo?.stargazers_count || 0, color: '#22d3ee' },
          { label: 'Recent Events', value: events.length, color: '#4ade80' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold" style={{ color: item.color }}>
              {item.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repo creation timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Repos Created Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={creationTimeline}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#22d3ee" fill="url(#colorCount)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stars by language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Stars by Language</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={languageStars} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="language"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="stars" radius={[0, 6, 6, 0]} barSize={16}>
                {languageStars.map((entry, index) => (
                  <motion.rect
                    key={index}
                    fill={entry.fill}
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity by hour */}
      {events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-base font-semibold text-[var(--foreground)] mb-4">Activity by Hour</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={activityByHour}>
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
}
