'use client';

import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
      {/* Hero skeleton */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="shimmer w-36 h-36 rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <div className="shimmer h-8 w-64 rounded-lg" />
            <div className="shimmer h-5 w-48 rounded-lg" />
            <div className="shimmer h-16 w-full max-w-md rounded-lg" />
            <div className="flex gap-3">
              <div className="shimmer h-8 w-24 rounded-full" />
              <div className="shimmer h-8 w-24 rounded-full" />
              <div className="shimmer h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="shimmer h-10 w-20 rounded-lg mb-3" />
            <div className="shimmer h-4 w-16 rounded" />
          </motion.div>
        ))}
      </div>

      {/* Repos skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="glass rounded-xl p-6 space-y-3"
          >
            <div className="shimmer h-6 w-48 rounded-lg" />
            <div className="shimmer h-4 w-full rounded" />
            <div className="shimmer h-4 w-3/4 rounded" />
            <div className="flex gap-4">
              <div className="shimmer h-4 w-16 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
