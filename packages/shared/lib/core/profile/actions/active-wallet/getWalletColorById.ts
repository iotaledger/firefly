import { get } from 'svelte/store'
import { visibleActiveWallets } from '../../stores'

export function getWalletColorById(walletId: string): string {
    return get(visibleActiveWallets)?.find((wallet) => wallet.id === walletId)?.color as string
}
