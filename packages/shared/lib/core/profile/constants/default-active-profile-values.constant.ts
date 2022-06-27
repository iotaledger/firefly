import { NetworkProtocol, NetworkType } from '@core/network'
import { AvailableExchangeRates } from '@lib/typings/currency'
import { HistoryDataProps } from '@lib/typings/market'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'

export const DEFAULT_ACTIVE_PROFILE_VALUE: IPersistedProfile = {
    id: '',
    name: '',
    type: ProfileType.Software,
    version: 0,
    networkProtocol: NetworkProtocol.Shimmer,
    networkType: NetworkType.Mainnet,
    lastStrongholdBackupTime: new Date(),
    settings: {
        currency: AvailableExchangeRates.USD,
        lockScreenTimeoutInMinutes: 5,
        chartSelectors: {
            currency: AvailableExchangeRates.USD,
            timeframe: HistoryDataProps.TWENTY_FOUR_HOURS,
        },
        hideNetworkStatistics: true,
    },
    accountMetadata: [],
    isDeveloperProfile: false,
    clientOptions: {},
}
