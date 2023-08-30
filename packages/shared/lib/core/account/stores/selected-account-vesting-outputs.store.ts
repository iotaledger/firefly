import { isVestingOutput } from '@core/wallet'
import { derived, Readable } from 'svelte/store'
import { OutputData } from '@iota/sdk/out/types'
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
