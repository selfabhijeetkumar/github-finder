'use client';

import { motion } from 'framer-motion';
import {
  MapPin, Building2, Link as LinkIcon, Twitter,
  Calendar, ExternalLink, Star, Award
} from 'lucide-react';
import { GitHubUser, GitHubRepo, UserBadge } from '@/lib/types';

function computeBadges(user: GitHubUser, repos: GitHubRepo[]): UserBadge[] {
  const badges: UserBadge[] = [];
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const accountAge = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  if (totalStars >= 100) badges.push({ id: 'star', label: 'Star Collector', icon: '⭐', color: '#f59e0b', description: `${totalStars} total stars` });
  if (totalStars >= 1000) badges.push({ id: 'superstar', label: 'Superstar', icon: '🌟', color: '#eab308', description: `${totalStars}+ stars across repos` });
  if (user.public_repos >= 50) badges.push({ id: 'prolific', label: 'Prolific Dev', icon: '🚀', color: '#22d3ee', description: `${user.public_repos} public repos` });
  if (languages.size >= 5) badges.push({ id: 'polyglot', label: 'Polyglot', icon: '🌐', color: '#a855f7', description: `Codes in ${languages.size} languages` });
  if (user.followers >= 100) badges.push({ id: 'influencer', label: 'Influencer', icon: '👥', color: '#4ade80', description: `${user.followers} followers` });
  if (accountAge >= 5) badges.push({ id: 'veteran', label: 'Veteran', icon: '🏆', color: '#f97316', description: `${accountAge} years on GitHub` });
  if (repos.some(r => r.stargazers_count >= 1000)) badges.push({ id: 'famous', label: 'Famous Repo', icon: '🔥', color: '#ef4444', description: 'Has a 1k+ star repo' });
  if (user.blog) badges.push({ id: 'blogger', label: 'Blogger', icon: '✍️', color: '#06b6d4', description: 'Maintains a blog/website' });

  return badges;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getAccountAge(created: string): string {
  const years = Math.floor(
    (Date.now() - new Date(created).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  if (years < 1) return 'Less than a year';
  return `${years} year${years > 1 ? 's' : ''}`;
}

export function ProfileHero({ user, repos }: { user: GitHubUser; repos: GitHubRepo[] }) {
  const badges = computeBadges(user, repos);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden"
    >
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#22d3ee]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#a855f7]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
        {/* Avatar with animated gradient ring */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative flex-shrink-0"
        >
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[3px] avatar-ring">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-full h-full rounded-full object-cover border-4 border-[var(--background)]"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-[#4ade80] border-3 border-[var(--background)] neon-glow-green" />
        </motion.div>

        {/* User info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              {user.name || user.login}
            </h1>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-400 hover:text-[#22d3ee] transition-colors text-sm"
            >
              @{user.login}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {user.bio && (
            <p className="text-gray-400 mb-4 max-w-xl text-sm sm:text-base">{user.bio}</p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 mb-4 text-sm text-gray-400">
            {user.company && (
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#a855f7]" />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#ef4444]" />
                {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#22d3ee] transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-[#22d3ee]" />
                {user.blog.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            )}
            {user.twitter_username && (
              <a
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors"
              >
                <Twitter className="w-4 h-4 text-[#1d9bf0]" />
                @{user.twitter_username}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#4ade80]" />
              Joined {formatDate(user.created_at)} ({getAccountAge(user.created_at)})
            </span>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium cursor-default"
                  title={badge.description}
                  style={{ borderColor: `${badge.color}30` }}
                >
                  <span>{badge.icon}</span>
                  <span style={{ color: badge.color }}>{badge.label}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-row md:flex-col gap-2">
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:neon-glow-cyan transition-all flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Profile
          </a>
          <a
            href={`${user.html_url}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-xl px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:neon-glow-purple transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Repos
          </a>
        </div>
      </div>
    </motion.div>
  );
}
