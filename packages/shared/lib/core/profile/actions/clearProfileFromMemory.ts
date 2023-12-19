import { api } from '@core/api'
import { selectedWalletId } from '@core/wallet'
import { activeWallets } from '../stores'

export async function clearProfileFromMemory(): Promise<void> {
    selectedWalletId.set(null)
    activeWallets.set([])
    await api.clearWalletsFromMemory()
}
