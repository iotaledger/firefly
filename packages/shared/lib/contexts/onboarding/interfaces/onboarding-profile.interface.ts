import { ProfileType } from '@core/profile'
import { IClientOptions, NetworkProtocol, NetworkType } from '@core/network'

import { ProfileRecoveryType, ProfileSetupType } from '../enums'

export interface IOnboardingProfile {
    id: string
    name: string
    isDeveloperProfile: boolean
    networkProtocol: NetworkProtocol
    networkType: NetworkType
    clientOptions: IClientOptions
    type: ProfileType
    setupType: ProfileSetupType
    recoveryType?: ProfileRecoveryType
    lastStrongholdBackupTime?: Date
}
