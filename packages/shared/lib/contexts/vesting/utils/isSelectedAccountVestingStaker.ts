import { get } from 'svelte/store'
import { STAKER_VESTING_DURATION, STARTING_VESTING_YEAR } from '../constants'
import { selectedAccountVestingOutputs } from '../stores'

// TODO: consider staker/investor address based, not account based
export function isSelectedAccountVestingStaker(): boolean {
    const $selectedAccountVestingOutputs = get(selectedAccountVestingOutputs)
    if (!$selectedAccountVestingOutputs?.length) {
        return false
    } else {
        const isStaker = $selectedAccountVestingOutputs
            .filter((addressWithOutputs) => addressWithOutputs.outputs.length > 0)
            .every((addressWithOutputs) => {
                // Get the last vesting output this address will ever unlock
                const lastVestingOutput = addressWithOutputs.outputs[addressWithOutputs.outputs.length - 1]
                if (!lastVestingOutput) {
                    return false
                }
                // Check if the unlock time is before the stakers period ends
                return lastVestingOutput.unlockTime.getFullYear() <= STARTING_VESTING_YEAR + STAKER_VESTING_DURATION
            })
        return isStaker
    }
}
