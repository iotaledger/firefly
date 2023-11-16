import { ProfileType } from '../enums'
import { AccountRecoveryConfiguration } from '../types'

export const BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION: AccountRecoveryConfiguration = {
    [ProfileType.Ledger]: {
        initialAccountRange: 2,
        accountGapLimit: 1,
        numberOfRoundsBetweenBreadthSearch: 1,
        addressGapLimit: 5,
    },
    [ProfileType.Software]: {
        initialAccountRange: 3,
        accountGapLimit: 1,
        numberOfRoundsBetweenBreadthSearch: 1,
        addressGapLimit: 30,
    },
}
