import { ProfileType } from '../enums'
import { GapLimitConfiguration } from '../types'

export const INITIAL_GAP_LIMIT_CONFIGURATION: GapLimitConfiguration = {
    [ProfileType.Ledger]: {
        accountGapLimit: 3,
        addressGapLimit: 1,
    },
    [ProfileType.Software]: {
        accountGapLimit: 10,
        addressGapLimit: 1,
    },
}
