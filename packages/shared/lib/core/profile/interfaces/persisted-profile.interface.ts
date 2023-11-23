import { IPersistedAccountData } from '@core/account'
import { ClientOptions, IPersistedNetwork } from '@core/network'
import { INft } from '@core/nfts'
import { StrongholdVersion } from '@core/stronghold/enums'
import { SecretManagerType } from '@iota/sdk/out/types'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'

export interface IPersistedProfile {
    id: string
    name: string
    type: ProfileType
    network: IPersistedNetwork
    lastStrongholdBackupTime: Date
    settings: IProfileSettings
    accountPersistedData: {
        [accountId: string]: IPersistedAccountData
    }
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: ClientOptions
    secretManagerOptions: SecretManagerType,
    forceAssetRefresh: boolean
    strongholdVersion?: StrongholdVersion
    needsChrysalisToStardustDbMigration?: boolean
    pfp?: INft
}
