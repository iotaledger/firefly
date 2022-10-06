import { DEFAULT_MARKET_CURRENCY } from '@core/market'
import { NetworkProtocol, NetworkType } from '@core/network'
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
        marketCurrency: DEFAULT_MARKET_CURRENCY,
        lockScreenTimeoutInMinutes: 5,
        hideNetworkStatistics: true,
    },
    accountMetadata: [],
    isDeveloperProfile: false,
    clientOptions: {},
}
