import { derived, Readable } from 'svelte/store'
import { mainAccountId } from './main-account-id.store'
import { selectedWallet } from './selected-wallet.store'
import { OutputData } from '@iota/sdk'

export const mainAccount: Readable<OutputData | undefined> = derived(
    [selectedWallet, mainAccountId],
    ([$selectedWallet, $mainAccountId]) =>
        $selectedWallet?.accountOutputs?.find((account) => account?.output?.accountId === $mainAccountId)
)
