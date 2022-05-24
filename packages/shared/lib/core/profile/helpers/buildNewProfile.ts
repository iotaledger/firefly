import { getOfficialNetworkConfig, NetworkProtocol, NetworkType } from '@core/network'
import { PROFILE_VERSION } from '@core/profile'
import { AvailableExchangeRates } from '@lib/typings/currency'
import { HistoryDataProps } from '@lib/typings/market'
import { generateRandomId } from '@lib/utils'

import { IPersistedProfile } from '../interfaces'

/**
 * Build a default profile object given a name and developer status.
 *
 * @method buildNewProfile
 * @param {string} name
 * @param {boolean} isDeveloperProfile
 * @param {NetworkProtocol} networkProtocol
 * @param {NetworkType} networkType
 * @returns {IPersistedProfile}
 */
export function buildNewProfile(
    name: string,
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType
): IPersistedProfile {
    return {
        id: generateRandomId(),
        name,
        type: null,
        version: PROFILE_VERSION,
        networkProtocol,
        networkType,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        settings: {
            currency: AvailableExchangeRates.USD,
            networkConfig: getOfficialNetworkConfig(networkProtocol, networkType),
            lockScreenTimeoutInMinutes: 5,
            chartSelectors: {
                currency: AvailableExchangeRates.USD,
                timeframe: HistoryDataProps.SEVEN_DAYS,
            },
            hideNetworkStatistics: !isDeveloperProfile,
        },
        accountMetadata: [],
    }
}
