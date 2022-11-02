import { NetworkProtocol, NetworkType } from '@core/network'
import { ExchangeRate } from '@core/utils'

import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'

export const DEFAULT_PERSISTED_PROFILE_OBJECT: IPersistedProfile = {
    id: '',
    name: '',
    type: ProfileType.Software,
    networkProtocol: NetworkProtocol?.Shimmer,
    networkType: NetworkType?.Mainnet,
    lastStrongholdBackupTime: new Date(),
    settings: {
        currency: ExchangeRate.USD,
        lockScreenTimeoutInMinutes: 5,
        hideNetworkStatistics: true,
    },
    accountMetadata: [],
    isDeveloperProfile: false,
    clientOptions: {},
}
