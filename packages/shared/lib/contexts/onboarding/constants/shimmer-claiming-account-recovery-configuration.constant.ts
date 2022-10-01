import { ProfileType } from '@core/profile/enums'
import { AccountRecoveryConfiguration } from '@core/profile/types'

export const SHIMMER_CLAIMING_ACCOUNT_RECOVERY_CONFIGURATION: AccountRecoveryConfiguration = {
    [ProfileType.Ledger]: {
        initialAccountRange: 5,
        accountGapLimit: 1,
        numberOfRoundsBetweenBreadthSearch: 4,
        addressGapLimit: 5,
    },
    [ProfileType.Software]: {
        initialAccountRange: 10,
        accountGapLimit: 1,
        numberOfRoundsBetweenBreadthSearch: 2,
        addressGapLimit: 20,
    },
}
