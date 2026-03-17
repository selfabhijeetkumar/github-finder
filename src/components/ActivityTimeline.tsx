'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  GitPullRequest, Star, GitFork, Eye, MessageSquare,
  GitCommit, Code, Tag, Trash2, Plus
} from 'lucide-react';
import { GitHubEvent } from '@/lib/types';

const eventConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  PushEvent: { icon: GitCommit, label: 'Pushed commits', color: '#4ade80' },
  CreateEvent: { icon: Plus, label: 'Created', color: '#22d3ee' },
  DeleteEvent: { icon: Trash2, label: 'Deleted', color: '#ef4444' },
  WatchEvent: { icon: Star, label: 'Starred', color: '#f59e0b' },
  ForkEvent: { icon: GitFork, label: 'Forked', color: '#a855f7' },
  IssuesEvent: { icon: MessageSquare, label: 'Issue', color: '#f97316' },
  IssueCommentEvent: { icon: MessageSquare, label: 'Commented', color: '#06b6d4' },
  PullRequestEvent: { icon: GitPullRequest, label: 'Pull Request', color: '#22d3ee' },
  PullRequestReviewEvent: { icon: Eye, label: 'Reviewed PR', color: '#8b5cf6' },
  ReleaseEvent: { icon: Tag, label: 'Released', color: '#10b981' },
  PublicEvent: { icon: Code, label: 'Made public', color: '#4ade80' },
};

function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getEventDescription(event: GitHubEvent): string {
  const repoName = event.repo.name.split('/')[1];
  switch (event.type) {
    case 'PushEvent': {
      const size = (event.payload as { size?: number }).size || 0;
      return `Pushed ${size} commit${size !== 1 ? 's' : ''} to ${repoName}`;
    }
    case 'CreateEvent': {
      const refType = (event.payload as { ref_type?: string }).ref_type || 'repository';
      return `Created ${refType} in ${repoName}`;
    }
    case 'WatchEvent':
      return `Starred ${repoName}`;
    case 'ForkEvent':
      return `Forked ${repoName}`;
    case 'IssuesEvent': {
      const action = (event.payload as { action?: string }).action || 'opened';
      return `${action.charAt(0).toUpperCase() + action.slice(1)} issue in ${repoName}`;
    }
    case 'PullRequestEvent': {
      const action = (event.payload as { action?: string }).action || 'opened';
      return `${action.charAt(0).toUpperCase() + action.slice(1)} PR in ${repoName}`;
    }
    default:
      return `Activity in ${repoName}`;
  }
}

export function ActivityTimeline({ events }: { events: GitHubEvent[] }) {
  const recentEvents = useMemo(() => events.slice(0, 20), [events]);

  if (recentEvents.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-400">No recent activity found</p>
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
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Recent Activity</h3>
      <div className="space-y-1">
        {recentEvents.map((event, i) => {
          const config = eventConfig[event.type] || { icon: Code, label: event.type, color: '#8b8b8b' };
          const Icon = config.icon as any;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="flex items-start gap-3 py-3 relative"
            >
              {/* Timeline line */}
              {i < recentEvents.length - 1 && (
                <div className="absolute left-[15px] top-[40px] w-[2px] h-[calc(100%-16px)] bg-gradient-to-b from-[var(--glass-border)] to-transparent" />
              )}

              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 z-10"
                style={{ background: `${config.color}15`, border: `1px solid ${config.color}30` }}
              >
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)]">{getEventDescription(event)}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatEventTime(event.created_at)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
