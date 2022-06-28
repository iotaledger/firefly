import { PROFILE_VERSION } from '@core/profile'
import { AvailableExchangeRates } from '@lib/typings/currency'
import { HistoryDataProps } from '@lib/typings/market'
import { generateRandomId } from '@lib/utils'

import { IPersistedProfile } from '../../../core/profile/interfaces'

/**
 * Build a default profile object given a name and developer status.
 *
 * @method buildNewProfile
 * @param {boolean} isDeveloperProfile
 * @param {NetworkProtocol} networkProtocol
 * @param {NetworkType} networkType
 * @param {IClientOptions} clientOptions
 * @param {string} name
 * @returns {IPersistedProfile}
 */
export function buildNewProfile(isDeveloperProfile: boolean): Partial<IPersistedProfile> {
    return {
        id: generateRandomId(),
        name: '',
        type: null,
        version: PROFILE_VERSION,
        lastStrongholdBackupTime: null,
        isDeveloperProfile,
        settings: {
            currency: AvailableExchangeRates.USD,
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
