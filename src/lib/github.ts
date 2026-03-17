import { GitHubUser, GitHubRepo, GitHubEvent } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
  }
}

async function fetchFromGitHub<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError('User not found', 404);
    }
    if (response.status === 403) {
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining === '0') {
        const resetTime = response.headers.get('X-RateLimit-Reset');
        const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
        throw new GitHubApiError(
          `API rate limit exceeded. Resets at ${resetDate?.toLocaleTimeString() || 'unknown'}`,
          403
        );
      }
      throw new GitHubApiError('Access forbidden', 403);
    }
    throw new GitHubApiError(`GitHub API error: ${response.statusText}`, response.status);
  }

  return response.json();
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return fetchFromGitHub<GitHubUser>(`/users/${username}`);
}

export async function fetchRepos(
  username: string,
  page: number = 1,
  perPage: number = 30,
  sort: string = 'updated'
): Promise<GitHubRepo[]> {
  return fetchFromGitHub<GitHubRepo[]>(
    `/users/${username}/repos?page=${page}&per_page=${perPage}&sort=${sort}&direction=desc`
  );
}

export async function fetchAllRepos(username: string): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const repos = await fetchFromGitHub<GitHubRepo[]>(
      `/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`
    );
    allRepos.push(...repos);
    if (repos.length < perPage) break;
    page++;
    if (page > 10) break; // Safety limit
  }

  return allRepos;
}

export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  return fetchFromGitHub<GitHubEvent[]>(`/users/${username}/events/public?per_page=100`);
}

export async function fetchFollowers(username: string): Promise<GitHubUser[]> {
  return fetchFromGitHub<GitHubUser[]>(`/users/${username}/followers?per_page=20`);
}

export async function fetchFollowing(username: string): Promise<GitHubUser[]> {
  return fetchFromGitHub<GitHubUser[]>(`/users/${username}/following?per_page=20`);
}

export { GitHubApiError };
