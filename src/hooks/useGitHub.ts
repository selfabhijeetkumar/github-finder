'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUser, fetchAllRepos, fetchEvents, fetchFollowers, fetchFollowing } from '@/lib/github';

export function useUser(username: string) {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => fetchUser(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useRepos(username: string) {
  return useQuery({
    queryKey: ['repos', username],
    queryFn: () => fetchAllRepos(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useEvents(username: string) {
  return useQuery({
    queryKey: ['events', username],
    queryFn: () => fetchEvents(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useFollowers(username: string) {
  return useQuery({
    queryKey: ['followers', username],
    queryFn: () => fetchFollowers(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useFollowing(username: string) {
  return useQuery({
    queryKey: ['following', username],
    queryFn: () => fetchFollowing(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
