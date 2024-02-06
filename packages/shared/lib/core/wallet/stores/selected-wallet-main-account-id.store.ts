import { derived } from 'svelte/store'
import { selectedWallet } from './selected-wallet.store'

export const selectedWalletMainAccountId = derived(
    selectedWallet,
    ($selectedWallet) => $selectedWallet?.mainAccountId ?? null
)
