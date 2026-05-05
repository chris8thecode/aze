import { defineCommand } from '../../types.js'
import { fetchGithubRepo, fetchGithubUser } from '../../../services/github.js'
import { getBuffer } from '../../../services/http.js'
import { truncate } from '../../../utils/text.js'

const renderRepo = async (slug: string) => {
  const [owner, repo] = slug.split('/')
  if (!owner || !repo) throw new Error('Format: owner/repo')
  const r = await fetchGithubRepo(owner, repo)
  const lines = [
    `*${r.full_name}*`,
    r.description ? `_${truncate(r.description, 200)}_` : '',
    '',
    '```',
    `stars     ${r.stargazers_count}`,
    `forks     ${r.forks_count}`,
    `issues    ${r.open_issues_count}`,
    `language  ${r.language ?? '—'}`,
    `license   ${r.license?.name ?? '—'}`,
    `branch    ${r.default_branch}`,
    `pushed    ${new Date(r.pushed_at).toISOString().slice(0, 10)}`,
    '```',
    r.topics?.length ? `topics: ${r.topics.join(', ')}` : '',
    r.html_url
  ].filter(Boolean)
  return { caption: lines.join('\n'), image: null as Buffer | null }
}

const renderUser = async (login: string) => {
  const u = await fetchGithubUser(login)
  const lines = [
    `*${u.name ?? u.login}* (@${u.login})`,
    u.bio ? `_${truncate(u.bio, 200)}_` : '',
    '',
    '```',
    `repos     ${u.public_repos}`,
    `followers ${u.followers}`,
    `following ${u.following}`,
    `joined    ${new Date(u.created_at).toISOString().slice(0, 10)}`,
    u.location ? `location  ${u.location}` : '',
    u.company ? `company   ${u.company}` : '',
    u.blog ? `blog      ${u.blog}` : '',
    '```',
    u.html_url
  ].filter(Boolean)
  let image: Buffer | null = null
  try {
    image = (await getBuffer(u.avatar_url)).data
  } catch {}
  return { caption: lines.join('\n'), image }
}

export default defineCommand({
  name: 'github',
  aliases: ['gh'],
  category: 'general',
  description: 'GitHub user or repo info.',
  usage: 'github <user> | <owner/repo>',
  cooldown: 3000,
  run: async ({ send, message, args }) => {
    if (args.length === 0) return send.reply(message, 'Usage: github <user> | <owner/repo>')
    const target = args[0]!
    const { caption, image } = target.includes('/') ? await renderRepo(target) : await renderUser(target)
    if (image) return send.reply(message, { image, caption })
    await send.reply(message, caption)
  }
})
