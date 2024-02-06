import { derived, Readable } from 'svelte/store'
import { selectedWalletMainAccountId } from './selected-wallet-main-account-id.store'
import { selectedWallet } from './selected-wallet.store'
import { AccountOutput, OutputData } from '@iota/sdk'

export const selectedWalletMainAccount: Readable<OutputData | undefined> = derived(
    [selectedWallet, selectedWalletMainAccountId],
    ([$selectedWallet, $selectedWalletMainAccountId]) =>
        $selectedWallet?.accountOutputs?.find(
            (account) => (account?.output as AccountOutput)?.accountId === $selectedWalletMainAccountId
        )
)
