import { IAccountMetadata } from '@core/account'
import { IClientOptions, INetwork, NetworkProtocol, NetworkType } from '@core/network'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'

export interface IPersistedProfile {
    id: string
    name: string
    type: ProfileType
    network: INetwork
    lastStrongholdBackupTime: Date
    settings: IProfileSettings
    accountMetadata: IAccountMetadata[]
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
    strongholdVersion: number
    // not used anymore, but kept for migration purposes
    networkProtocol?: NetworkProtocol
    networkType?: NetworkType
}
