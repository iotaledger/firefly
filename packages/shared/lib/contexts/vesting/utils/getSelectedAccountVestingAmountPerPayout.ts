import { get } from 'svelte/store'
import { selectedAccountVestingOutputs } from '../stores'

export function getSelectedAccountVestingAmountPerPayout(): number {
    const $selectedAccountVestingOutputs = get(selectedAccountVestingOutputs)
    if (!$selectedAccountVestingOutputs?.length) {
        return 0
    } else {
        // note: we use the last output of each address to calculate the amount per payout
        // because the first output of each address is the initial payout which is not part of the vesting schedule
        const calculatedTotalAmount = $selectedAccountVestingOutputs.reduce(
            (acc, vestingOutputsWithAddress) =>
                acc +
                    parseInt(
                        vestingOutputsWithAddress.outputs[vestingOutputsWithAddress.outputs?.length - 1]?.output.amount,
                        10
                    ) || 0,
            0
        )
        return calculatedTotalAmount
    }
}
