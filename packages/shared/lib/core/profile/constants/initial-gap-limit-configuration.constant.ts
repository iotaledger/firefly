import { ProfileType } from '../enums'
import { RecoverAccountsConfiguration } from '../types'

export const INITIAL_RECOVER_ACCOUNTS_CONFIGURATION: RecoverAccountsConfiguration = {
    [ProfileType.Ledger]: {
        initialAccountRange: 3,
        accountGapLimit: 1,
        numberOfRoundsBetweenBreadthSearch: 1,
        addressGapLimit: 1,
    },
    [ProfileType.Software]: {
        initialAccountRange: 10,
        accountGapLimit: 1,
        numberOfRoundsBetweenBreadthSearch: 1,
        addressGapLimit: 1,
    },
}
