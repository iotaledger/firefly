import { getOfficialNetworkConfig, NetworkProtocol, NetworkType } from '@core/network'
import { ClientOptions } from '@iota/wallet'
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
 * @param {ClientOptions} clientOptions
 * @returns {IPersistedProfile}
 */
export function buildNewProfile(
    name: string = '',
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType,
    clientOptions: ClientOptions
): IPersistedProfile {
    return {
        id: generateRandomId(),
        name: name.trim(),
        type: null,
        networkProtocol,
        networkType,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        settings: {
            currency: AvailableExchangeRates.USD,
            networkConfig: getOfficialNetworkConfig(networkProtocol, networkType),
            clientOptions,
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
