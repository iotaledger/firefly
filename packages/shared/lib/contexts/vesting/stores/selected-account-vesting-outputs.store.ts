import { selectedAccount } from '@core/account/stores'
import { Readable, derived } from 'svelte/store'
import { AddressWithVestingOutputs } from '../interfaces'
import { getVestingType, isVestingOutput, mapBasicOutputToVestingOutput, sortVestingOutputs } from '../utils'

export const selectedAccountVestingOutputs: Readable<AddressWithVestingOutputs[]> = derived(
    selectedAccount,
    ($selectedAccount) => {
        const addressesWithVestingOutputs =
            $selectedAccount?.addressesWithOutputs?.filter((addressWithOutputs) =>
                addressWithOutputs.outputs?.find(isVestingOutput)
            ) ?? []
        return addressesWithVestingOutputs.map((addressWithOutputs) => {
            const outputs = addressWithOutputs.outputs
                .filter(isVestingOutput)
                .map(mapBasicOutputToVestingOutput)
                .sort(sortVestingOutputs)
            const type = getVestingType(outputs)
            const lastOutput = outputs[outputs.length - 1]
            return {
                address: addressWithOutputs.address,
                outputs,
                type,
                lastOutput,
            }
        })
    }
)
