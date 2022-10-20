import { writable } from 'svelte/store'
import { INITIAL_ACTIVE_TAB } from '../constants'
import { WalletTab } from '../enums'

export const activeWalletTab = writable<WalletTab | null>(INITIAL_ACTIVE_TAB)

export function updateActiveWalletTab(tab: WalletTab): void {
    activeWalletTab?.set(tab)
}
