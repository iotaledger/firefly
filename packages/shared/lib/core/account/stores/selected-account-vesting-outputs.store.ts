import { isVestingOutput } from '@core/wallet'
import { OutputData } from '@iota/wallet'
import { derived, Readable } from 'svelte/store'
import { selectedAccount } from '.'

export const selectedAccountVestingOutputs: Readable<OutputData[] | undefined> = derived(
    selectedAccount,
    ($selectedAccount) => {
        const selectedAccountsOutputs: OutputData[] =
            $selectedAccount?.addressesWithOutputs?.reduce(
                (outputs, addressWithOutputs) => [...outputs, ...addressWithOutputs.outputs],
                [] as OutputData[]
            ) ?? []
        selectedAccountsOutputs?.filter((output) => isVestingOutput(output)) ?? []
    }
)
