import { get } from 'svelte/store'
import { INVESTOR_VESTING_DURATION, STAKER_VESTING_DURATION, VESTING_PAYOUTS_IN_1_YEAR } from '../constants'
import { VestingType } from '../enums'
import { selectedAccountVestingOutputs } from '../stores'

export function getTotalVestingPayouts(): number {
    const $selectedAccountVestingOutputs = get(selectedAccountVestingOutputs)
    if (!$selectedAccountVestingOutputs?.length) {
        return 0
    } else {
        let vestingType = VestingType.Staker
        if ($selectedAccountVestingOutputs.find(({ type }) => type === VestingType.Investor)) {
            vestingType = VestingType.Investor
        }
        const vestingDuration = vestingType === VestingType.Staker ? STAKER_VESTING_DURATION : INVESTOR_VESTING_DURATION
        return VESTING_PAYOUTS_IN_1_YEAR * vestingDuration
    }
}
