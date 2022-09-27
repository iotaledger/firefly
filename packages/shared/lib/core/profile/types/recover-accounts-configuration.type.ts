import { ProfileType } from '@core/profile'

export type RecoverAccountsProfileConfiguration = {
    initialAccountRange: number
    accountGapLimit: number
    numberOfRoundsBetweenBreadthSearch: number
    addressGapLimit: number
}

export type RecoverAccountsConfiguration = {
    [key in ProfileType]?: RecoverAccountsProfileConfiguration
}
