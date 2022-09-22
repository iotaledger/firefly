import { ProfileType } from '@core/profile'

export type GapLimitConfiguration = {
    [key in ProfileType]: {
        accountGapLimit: number
        addressGapLimit: number
    }
}
