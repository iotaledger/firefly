import { VESTING_OUTPUT_SUPPLY_MARKER } from '../constants'
import { OutputData } from '@iota/sdk/out/types'

const OUTPUT_ID_REGEX = new RegExp(`^${VESTING_OUTPUT_SUPPLY_MARKER}`)

export function isVestingOutputId(outputId: string): boolean {
    return OUTPUT_ID_REGEX.test(outputId)
}

export function isVestingOutput(outputData: OutputData): boolean {
    return isVestingOutputId(outputData.outputId)
}
