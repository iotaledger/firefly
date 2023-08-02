import { VESTING_OUTPUT_SUPPLY_MARKER } from '@core/wallet/constants'
import { OutputData } from '@iota/wallet'

export function isVestingOutput(outputData: OutputData): boolean {
    const regex = new RegExp(`^${VESTING_OUTPUT_SUPPLY_MARKER}`)
    return regex.test(outputData.outputId)
}
