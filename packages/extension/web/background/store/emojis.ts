import storage from './storage'

const key = 'emojis'

export async function getEmojis(): Promise<string> {
  const r = await storage.get()
  return r[key] ? r[key] : ''
}

export async function setEmojis(e: string) {
  await storage.set({
    emojis: e
  })
}
