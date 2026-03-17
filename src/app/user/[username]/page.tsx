'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, BarChart3, Activity, Lightbulb } from 'lucide-react';
import { useUser, useRepos, useEvents } from '@/hooks/useGitHub';
import { ProfileHero } from '@/components/ProfileHero';
import { StatsGrid } from '@/components/StatsGrid';
import { RepoList } from '@/components/RepoList';
import { LanguageChart } from '@/components/LanguageChart';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { InsightsPanel } from '@/components/InsightsPanel';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import dynamic from 'next/dynamic';

const RepoGalaxy = dynamic(
  () => import('@/components/RepoGalaxy').then(m => ({ default: m.RepoGalaxy })),
  { ssr: false, loading: () => <div className="glass rounded-xl h-[500px] shimmer" /> }
);

const ContributionLandscape = dynamic(
  () => import('@/components/ContributionLandscape').then(m => ({ default: m.ContributionLandscape })),
  { ssr: false, loading: () => <div className="glass rounded-xl h-[400px] shimmer" /> }
);

type TabKey = 'repos' | 'visualizations' | 'activity' | 'insights';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'repos', label: 'Repositories', icon: BookOpen },
  { key: 'visualizations', label: 'Visualizations', icon: BarChart3 },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function UserProfile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState<TabKey>('repos');

  const { data: user, isLoading: userLoading, error: userError, refetch: refetchUser } = useUser(username);
  const { data: repos, isLoading: reposLoading } = useRepos(username);
  const { data: events } = useEvents(username);

  if (userLoading || reposLoading) {
    return <LoadingSkeleton />;
  }

  if (userError) {
    const errorMessage = (userError as Error).message || 'Something went wrong';
    let type: 'not-found' | 'rate-limit' | 'network' | 'generic' = 'generic';
    if (errorMessage.includes('not found')) type = 'not-found';
    else if (errorMessage.includes('rate limit')) type = 'rate-limit';
    else if (errorMessage.includes('Failed to fetch')) type = 'network';

    return <ErrorState type={type} message={errorMessage} onRetry={() => refetchUser()} />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-7xl mx-auto">
      {/* Profile Hero */}
      <ProfileHero user={user} repos={repos || []} />

      {/* Stats */}
      <StatsGrid user={user} repos={repos || []} />

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass rounded-xl mb-8 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon as any;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#22d3ee]/20 to-[#a855f7]/20 text-[var(--foreground)]'
                  : 'text-gray-500 hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'repos' && repos && <RepoList repos={repos} />}
          {activeTab === 'visualizations' && (
            <div className="space-y-6">
              {repos && <LanguageChart repos={repos} />}
              {repos && <RepoGalaxy repos={repos} />}
              {events && <ContributionLandscape events={events} />}
            </div>
          )}
          {activeTab === 'activity' && events && <ActivityTimeline events={events} />}
          {activeTab === 'insights' && repos && events && (
            <InsightsPanel repos={repos} events={events} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
