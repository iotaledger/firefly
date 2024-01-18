import { get } from 'svelte/store'
import { visibleActiveWallets } from '../../stores'

// TODO(2.0) Fix all usages
export function getWalletColorById(walletId: string): string {
    return get(visibleActiveWallets)?.find((wallet) => wallet.id === walletId)?.color as string
}
