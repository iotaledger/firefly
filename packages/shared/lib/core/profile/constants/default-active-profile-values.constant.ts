import { NetworkProtocol, NetworkType } from '@core/network'
import { AvailableExchangeRates } from '@lib/typings/currency'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'
import { PROFILE_VERSION } from './profile-version.constant'

export const DEFAULT_ACTIVE_PROFILE_VALUE: IPersistedProfile = {
    id: '',
    name: '',
    type: ProfileType.Software,
    version: PROFILE_VERSION,
    networkProtocol: NetworkProtocol?.Shimmer,
    networkType: NetworkType?.Mainnet,
    lastStrongholdBackupTime: new Date(),
    settings: {
        currency: AvailableExchangeRates.USD,
        lockScreenTimeoutInMinutes: 5,
        hideNetworkStatistics: true,
    },
    accountMetadata: [],
    isDeveloperProfile: false,
    clientOptions: {},
}
