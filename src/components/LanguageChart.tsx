'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GitHubRepo, getLanguageColor, LanguageStat } from '@/lib/types';

export function LanguageChart({ repos }: { repos: GitHubRepo[] }) {
  const data: LanguageStat[] = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach(r => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.count - a.count);
  }, [repos]);

  if (data.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400">No language data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Language Distribution</h3>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Chart */}
        <div className="w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="count"
                animationBegin={200}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: '#e2e8f0',
                  fontSize: '13px',
                }}
                formatter={(value: any, name: any) => [
                  `${value} repo${value > 1 ? 's' : ''}`,
                  name,
                ] as any}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 grid grid-cols-2 gap-2 w-full">
          {data.slice(0, 10).map((lang, i) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-3 glass rounded-lg px-3 py-2"
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: lang.color }} />
              <span className="text-sm text-[var(--foreground)] flex-1 truncate">{lang.name}</span>
              <span className="text-xs text-gray-500 font-mono">{lang.percentage}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
