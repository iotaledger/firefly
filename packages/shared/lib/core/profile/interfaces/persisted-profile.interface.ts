import { IAccountMetadata } from '@core/account'
import { IClientOptions, IPersistedNetwork } from '@core/network'
import { IEvmAddresses } from '@core/network/interfaces'
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
    accountMetadata: IAccountMetadata[]
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountIndex?: number
    clientOptions: IClientOptions
    forceAssetRefresh: boolean
    strongholdVersion: StrongholdVersion
    pfp?: INft
    evmAddresses: {
        [index: number]: IEvmAddresses
    }
}
