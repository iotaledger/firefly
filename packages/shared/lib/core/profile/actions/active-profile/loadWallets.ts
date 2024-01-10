import { loadWallet } from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, activeProfile } from '../../stores'
import { getWallets } from '../getWallets'

export async function loadWallets(): Promise<void> {
    const { hasLoadedWallets } = get(activeProfile)
    const walletResponse = await getWallets()
    if (walletResponse.length === 0) {
        hasLoadedWallets.set(true)
        return
    }
    if (walletResponse) {
        const loadedWallets = await Promise.all(walletResponse?.map((accountResponse) => loadWallet(accountResponse)))
        activeWallets.set(loadedWallets)
        hasLoadedWallets.set(true)
    }
}
