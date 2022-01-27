import storage from './storage'
import type {SimpleProfile} from '../../shared/types'

const key = 'profile'

export function validateProfile(data): boolean {
  if (!(data.emojis && typeof data.emojis === "string")) return false;
  if (!(data.accounts && data.accounts.length)) return false;
  if (!(data.id && typeof data.id === "string")) return false;
  if (!(data.name && typeof data.name === "string")) return false;
  return true;
}

export async function getProfile(): Promise<SimpleProfile> {
  const r = await storage.get()
  return r[key] ? r[key] : {}
}

export async function setProfile(p: SimpleProfile) {
  await storage.set({
    [key]: p
  })
}
