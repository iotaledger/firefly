import { loadWallet } from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, activeProfile } from '../../stores'
import { getWallets } from '../getWallets'

export async function loadWallets(): Promise<void> {
    const { hasLoadedWallets, id } = get(activeProfile)
    const walletsResponse = await getWallets()
    if (walletsResponse.length === 0) {
        hasLoadedWallets.set(true)
        return
    }
    if (walletsResponse) {
        const loadedWallets = await Promise.all(
            walletsResponse?.map((walletResponse) => loadWallet(id, walletResponse))
        )
        activeWallets.set(loadedWallets)
        hasLoadedWallets.set(true)
    }
}
