import { ProfileType } from '@core/profile'

export type GapLimitProfileConfiguration = {
    accountGapLimit: number
    addressGapLimit: number
}

export type GapLimitConfiguration = {
    [key in ProfileType]?: GapLimitProfileConfiguration
}
