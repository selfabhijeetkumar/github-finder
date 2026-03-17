// GitHub API Types

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  type: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  visibility: string;
  clone_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
    avatar_url: string;
  };
  repo: {
    name: string;
    url: string;
  };
  payload: Record<string, unknown>;
  created_at: string;
}

export interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface UserBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

// Language colors matching GitHub conventions
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  R: '#198CE7',
  Perl: '#0298c3',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Erlang: '#B83998',
  Julia: '#a270ba',
  Jupyter: '#DA5B0B',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  SCSS: '#c6538c',
  Sass: '#a53b70',
  Less: '#1d365d',
  Objective: '#438eff',
  Assembly: '#6E4C13',
  PowerShell: '#012456',
  Vim: '#199f4b',
  Zig: '#ec915c',
};

export const getLanguageColor = (lang: string | null): string => {
  if (!lang) return '#8b8b8b';
  return LANGUAGE_COLORS[lang] || '#8b8b8b';
};
