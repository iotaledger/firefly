import { ProfileType } from '@core/profile/enums'
import { GapLimitConfiguration } from '@core/profile/types'

export const SHIMMER_CLAIMING_GAP_LIMIT_CONFIGURATION: GapLimitConfiguration = {
    [ProfileType.Ledger]: {
        accountGapLimit: 4,
        addressGapLimit: 10,
    },
    [ProfileType.Software]: {
        accountGapLimit: 10,
        addressGapLimit: 20,
    },
}
