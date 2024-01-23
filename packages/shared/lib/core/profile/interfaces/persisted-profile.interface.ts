import { ClientOptions, IPersistedNetwork } from '@core/network'
import { INft } from '@core/nfts'
import { StrongholdVersion } from '@core/stronghold/enums'
import { SecretManagerType } from '@iota/sdk/out/types'
import { IPersistedWalletData } from '@core/wallet/interfaces'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'

export interface IPersistedProfile {
    id: string
    name: string
    type: ProfileType
    network: IPersistedNetwork
    lastStrongholdBackupTime: Date
    settings: IProfileSettings
    walletPersistedData: {
        [walletId: string]: IPersistedWalletData
    }
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedWalletId?: string // Todo(2.0) Fix all usages of lastUsedAccountIndex
    clientOptions: ClientOptions
    secretManagerOptions: SecretManagerType
    forceAssetRefresh: boolean
    strongholdVersion?: StrongholdVersion
    needsChrysalisToStardustDbMigration?: boolean
    pfp?: INft
}
