import { mkdir } from 'fs/promises'
import { useMultiFileAuthState } from 'baileys'
import { env } from '../config/env.js'

export const loadAuthState = async () => {
  await mkdir(env.sessionDir, { recursive: true })
  return useMultiFileAuthState(env.sessionDir)
}
