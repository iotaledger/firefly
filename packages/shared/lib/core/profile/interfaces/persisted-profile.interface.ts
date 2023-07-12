import { IPersistedAccountData } from '@core/account'
import { ClientOptions, IPersistedNetwork } from '@core/network'
import { INft } from '@core/nfts'
import { StrongholdVersion } from '@core/stronghold/enums'
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
    forceAssetRefresh: boolean
    strongholdVersion: StrongholdVersion
    pfp?: INft
}
