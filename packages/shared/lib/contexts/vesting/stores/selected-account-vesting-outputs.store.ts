import { selectedAccount } from '@core/account/stores'
import { Readable, derived } from 'svelte/store'
import { AddressWithVestingOutputs } from '../interfaces'
import { isVestingOutput, mapBasicOutputToVestingOutput, sortVestingOutputs } from '../utils'

export const selectedAccountVestingOutputs: Readable<AddressWithVestingOutputs[]> = derived(
    selectedAccount,
    ($selectedAccount) => {
        const addressesWithVestingOutputs =
            $selectedAccount?.addressesWithOutputs?.filter((addressWithOutputs) =>
                addressWithOutputs.outputs?.find(isVestingOutput)
            ) ?? []
        return addressesWithVestingOutputs.map((addressWithOutputs) => ({
            address: addressWithOutputs.address,
            outputs: addressWithOutputs.outputs.map(mapBasicOutputToVestingOutput).sort(sortVestingOutputs),
        }))
    }
)
