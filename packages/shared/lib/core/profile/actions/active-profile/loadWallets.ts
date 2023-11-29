import { loadWallet } from '@core/wallet'
import { get } from 'svelte/store'
import { activeAccounts, activeProfile } from '../../stores'
import { getWallets } from '../getWallets'

export async function loadWallets(): Promise<void> {
    const { hasLoadedAccounts } = get(activeProfile)
    const walletResponse = await getWallets()
    if (walletResponse.length === 0) {
        hasLoadedAccounts.set(true)
        return
    }
    if (walletResponse) {
        const loadedWallets = await Promise.all(
            walletResponse?.map((accountResponse) => loadWallet(accountResponse))
        )
        activeAccounts.set(loadedWallets) // TODO(2.0) We can't sort this like this: sort((a, b) => a.getMetadata().index - b.getMetadata().index)
        hasLoadedAccounts.set(true)
    }
}
