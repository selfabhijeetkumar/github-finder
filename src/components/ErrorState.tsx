'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, UserX, WifiOff, RefreshCw, Clock, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  type: 'not-found' | 'rate-limit' | 'network' | 'generic';
  message?: string;
  onRetry?: () => void;
}

const errorConfig = {
  'not-found': {
    icon: UserX,
    title: 'User Not Found',
    description: "We couldn't find a GitHub user with that username. Double-check the spelling and try again.",
    color: '#a855f7',
  },
  'rate-limit': {
    icon: Clock,
    title: 'Rate Limit Exceeded',
    description: "You've made too many requests. The GitHub API allows 60 requests per hour for unauthenticated users.",
    color: '#f59e0b',
  },
  network: {
    icon: WifiOff,
    title: 'Connection Error',
    description: "Unable to reach GitHub's servers. Please check your internet connection and try again.",
    color: '#ef4444',
  },
  generic: {
    icon: AlertTriangle,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again later.',
    color: '#ef4444',
  },
};

export function ErrorState({ type, message, onRetry }: ErrorStateProps) {
  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-10 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ background: `${config.color}15`, border: `2px solid ${config.color}30` }}
        >
          <Icon className="w-10 h-10" style={{ color: config.color }} />
        </motion.div>

        <h2 className="text-2xl font-bold mb-3 text-[var(--foreground)]">{config.title}</h2>
        <p className="text-gray-400 mb-2">{config.description}</p>
        {message && (
          <p className="text-sm text-gray-500 mb-6 font-mono glass rounded-lg p-3 mt-4">{message}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#a855f7] text-white font-semibold hover:opacity-90 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          )}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-[var(--foreground)] font-semibold hover:neon-glow-cyan transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
