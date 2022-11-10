import { DEFAULT_MARKET_CURRENCY } from '@core/market'
import { NetworkProtocol, NetworkType } from '@core/network/enums'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'

export const DEFAULT_PERSISTED_PROFILE_OBJECT: IPersistedProfile = {
    id: '',
    name: '',
    type: ProfileType.Software,
    networkProtocol: NetworkProtocol?.Shimmer,
    networkType: NetworkType?.Mainnet,
    lastStrongholdBackupTime: undefined,
    settings: {
        marketCurrency: DEFAULT_MARKET_CURRENCY,
        lockScreenTimeoutInMinutes: 5,
        hideNetworkStatistics: true,
    },
    accountMetadata: [],
    isDeveloperProfile: false,
    clientOptions: {},
}
