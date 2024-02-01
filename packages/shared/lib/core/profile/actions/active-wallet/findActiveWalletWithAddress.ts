import { IWalletState } from '@core/wallet/interfaces'
import { get } from 'svelte/store'
import { activeWallets } from '../../stores'

/**
 * Find an address in one of our wallets
 * @param address The address to find
 * @returns The wallet matching the address or undefined if not found
 */
export function findActiveWalletWithAddress(address: string): IWalletState {
    if (!address) {
        return
    }
    const wallets = get(activeWallets)
    return wallets.find((wallet) => wallet.depositAddress === address)
}
