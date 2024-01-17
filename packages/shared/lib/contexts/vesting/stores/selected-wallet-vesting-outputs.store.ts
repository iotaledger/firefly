import { selectedWallet } from '@core/wallet/stores/selected-wallet.store'
import { Readable, derived } from 'svelte/store'
import { AddressWithVestingOutputs } from '../interfaces'
import { getVestingType, isVestingOutput, mapBasicOutputToVestingOutput, sortVestingOutputs } from '../utils'

export const selectedWalletVestingOutputs: Readable<AddressWithVestingOutputs[]> = derived(
    selectedWallet,
    ($selectedWallet) => {
        const vestingOutputs = $selectedWallet?.walletOutputs?.filter(isVestingOutput) ?? []
        const outputs = vestingOutputs
            .filter(isVestingOutput)
            .map(mapBasicOutputToVestingOutput)
            .sort(sortVestingOutputs)
        const type = getVestingType(outputs)
        const lastOutput = outputs[outputs.length - 1]
        const address = $selectedWallet?.depositAddress || ''

        // TODO(2.0) It would be better to not return an array but this way we don't need to refactor more code for now
        return [
            {
                address,
                outputs,
                type,
                lastOutput,
            },
        ]
    }
)
