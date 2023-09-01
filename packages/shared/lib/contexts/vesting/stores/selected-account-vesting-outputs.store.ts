import { AddressWithOutputs } from '@core/account/interfaces'
import { selectedAccount } from '@core/account/stores'
import { getTimelockDateFromOutput } from '@core/wallet'
import { CommonOutput, OutputData } from '@iota/sdk/out/types'
import { Readable, derived } from 'svelte/store'
import { isVestingOutput } from '../utils'

const sortVestingOutputs = (a: OutputData, b: OutputData): number => {
    const unlockConditionA = getTimelockDateFromOutput(a.output as CommonOutput)
    const unlockConditionB = getTimelockDateFromOutput(b.output as CommonOutput)
    if (!unlockConditionA) return -1
    return unlockConditionA?.getTime() - (unlockConditionB?.getTime() ?? -1)
}

export const selectedAccountVestingOutputs: Readable<AddressWithOutputs[]> = derived(
    selectedAccount,
    ($selectedAccount) => {
        const addressWithVestingOutputs: AddressWithOutputs[] =
            $selectedAccount?.addressesWithOutputs?.map((addressWithOutputs) => ({
                address: addressWithOutputs.address,
                outputs: addressWithOutputs.outputs.filter(isVestingOutput).sort(sortVestingOutputs),
            })) ?? []
        return addressWithVestingOutputs
    }
)
