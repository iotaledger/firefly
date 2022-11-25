import { IAccountMetadata } from '@core/account'
import { IClientOptions, NetworkProtocol, NetworkType } from '@core/network'

import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'

export interface IPersistedProfile {
    id: string
    name: string
    type: ProfileType
    networkProtocol: NetworkProtocol
    networkType: NetworkType
    lastStrongholdBackupTime: Date
    settings: IProfileSettings
    accountMetadata: IAccountMetadata[]
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
}
