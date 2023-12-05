import { api } from '@core/api'

export async function clearProfileFromMemory(): Promise<void> {
    await api.clearWalletsFromMemory()
}
