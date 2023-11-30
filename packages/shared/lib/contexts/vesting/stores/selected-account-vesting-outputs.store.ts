import { selectedWallet } from '@core/wallet/stores/selected-wallet.store'
import { Readable, derived } from 'svelte/store'
import { AddressWithVestingOutputs } from '../interfaces'
import { getVestingType, isVestingOutput, mapBasicOutputToVestingOutput, sortVestingOutputs } from '../utils'

// TODO(2.0) Fix this and all usages
export const selectedAccountVestingOutputs: Readable<AddressWithVestingOutputs[]> = derived(
    selectedWallet,
    ($selectedWallet) => {
        const addressesWithVestingOutputs =
            $selectedWallet?.addressesWithOutputs?.filter((addressWithOutputs) =>
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
