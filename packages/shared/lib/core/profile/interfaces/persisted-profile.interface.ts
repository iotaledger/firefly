import { IAccountMetadata } from '@core/account'
import { NetworkProtocol, NetworkType } from '@core/network'
import { ProfileType } from '../enums'
import { IProfileSettings } from './profile-settings.interface'

export interface IPersistedProfile {
    id: string
    name: string
    type: ProfileType
    networkProtocol: NetworkProtocol
    networkType: NetworkType
    lastStrongholdBackupTime: Date | null
    settings: IProfileSettings
    hiddenAccounts?: string[]
    isDeveloperProfile: boolean
    hasVisitedDashboard?: boolean
    lastUsedAccountId?: string
    accountMetadata?: IAccountMetadata[]
    hasFinishedSingleAccountGuide?: boolean
}
