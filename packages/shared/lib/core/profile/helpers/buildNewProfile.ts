import { IClientOptions, NetworkProtocol, NetworkType } from '@core/network'
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
    isDeveloperProfile: boolean,
    networkProtocol: NetworkProtocol,
    networkType: NetworkType,
    clientOptions: IClientOptions
): IPersistedProfile {
    return {
        id: generateRandomId(),
        name: '',
        type: null,
        networkProtocol,
        networkType,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        settings: {
            currency: AvailableExchangeRates.USD,
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
