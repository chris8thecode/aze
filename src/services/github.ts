import { getJson } from './http.js'

export interface GithubUser {
  login: string
  name?: string | null
  bio?: string | null
  location?: string | null
  company?: string | null
  blog?: string | null
  twitter_username?: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
  avatar_url: string
  created_at: string
}

export interface GithubRepo {
  full_name: string
  description?: string | null
  homepage?: string | null
  language?: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  default_branch: string
  topics?: string[]
  license?: { name: string } | null
  pushed_at: string
  html_url: string
}

const API = 'https://api.github.com'

export const fetchGithubUser = async (login: string): Promise<GithubUser> =>
  getJson<GithubUser>(`${API}/users/${encodeURIComponent(login)}`)

export const fetchGithubRepo = async (owner: string, repo: string): Promise<GithubRepo> =>
  getJson<GithubRepo>(`${API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
