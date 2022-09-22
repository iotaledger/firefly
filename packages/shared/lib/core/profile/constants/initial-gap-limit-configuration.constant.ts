import { ProfileType } from '../enums'
import { GapLimitConfiguration } from '../types'

export const INITIAL_GAP_LIMIT_CONFIGURATION: GapLimitConfiguration = {
    [ProfileType.Ledger]: {
        accountGapLimit: 1,
        addressGapLimit: 0,
    },
    [ProfileType.Software]: {
        accountGapLimit: 10,
        addressGapLimit: 0,
    },
}
