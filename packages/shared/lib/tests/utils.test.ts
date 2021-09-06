import { migrateObjects } from '../utils'
import { Profile, ProfileType } from '../typings/profile'
import { AvailableExchangeRates } from '../typings/currency'
import { getDefaultNetworkConfig } from '../network'
import { HistoryDataProps } from '../typings/market'

describe('File: utils.ts', () => {
    describe('Function: migrateObjects', () => {
        const buildProfile = (): Profile => ({
            id: 'TEST',
            name: 'TEST',
            type: null,
            lastStrongholdBackupTime: null,
            isDeveloperProfile: false,
            settings: {
                currency: AvailableExchangeRates.USD,
                networkConfig: getDefaultNetworkConfig(),
                lockScreenTimeout: 5,
                chartSelectors: {
                    currency: AvailableExchangeRates.USD,
                    timeframe: HistoryDataProps.SEVEN_DAYS,
                },
            },
            ledgerMigrationCount: 0,
        })

        it('should migrate simple objects', () => {
            const oldObj: any = {
                existingProp1: 0,
                existingProp2: '',
                existingProp3: true,
            }
            const newObj: any = {
                newProp1: 0,
                existingProp1: 1,
                existingProp2: 'string',
            }

            const result = migrateObjects(oldObj, newObj)
            expect(result).toEqual({
                existingProp1: 0,
                existingProp2: '',
                newProp1: 0,
            })
        })

        it('should migrate complex objects with different props', () => {
            const oldProfileData: any = {
                id: 'ID',
                name: 'NAME',
                type: ProfileType.Software,
                settings: {
                    currency: AvailableExchangeRates.EUR,
                    nodeUrl: 'NODE_URL',
                    networkId: 'NETWORK_ID',
                    hiddenAccounts: false,
                },
            }
            const newProfile = buildProfile()

            const result = migrateObjects(oldProfileData, newProfile)
            expect(result).toEqual({
                id: oldProfileData.id,
                name: oldProfileData.name,
                type: oldProfileData.type,
                lastStrongholdBackupTime: null,
                isDeveloperProfile: false,
                settings: {
                    currency: AvailableExchangeRates.EUR,
                    networkConfig: getDefaultNetworkConfig(),
                    lockScreenTimeout: 5,
                    chartSelectors: {
                        currency: AvailableExchangeRates.USD,
                        timeframe: HistoryDataProps.SEVEN_DAYS,
                    },
                },
                ledgerMigrationCount: 0,
            })
        })

        it('should migrate complex objects with similar props', () => {
            const oldProfileData: any = {
                id: 'ID',
                name: 'NAME',
                type: ProfileType.Software,
                settings: {
                    currency: AvailableExchangeRates.JPY,
                    networkConfig: getDefaultNetworkConfig(),
                    lockScreenTimeout: 9,
                    chartSelectors: {
                        currency: AvailableExchangeRates.USD,
                        timeframe: HistoryDataProps.SEVEN_DAYS,
                    },
                },
            }
            const newProfile = buildProfile()

            const result = migrateObjects(oldProfileData, newProfile)
            expect(result).toEqual({
                id: oldProfileData.id,
                name: oldProfileData.name,
                type: oldProfileData.type,
                lastStrongholdBackupTime: null,
                isDeveloperProfile: false,
                settings: {
                    currency: oldProfileData.settings.currency,
                    networkConfig: oldProfileData.settings.networkConfig,
                    lockScreenTimeout: oldProfileData.settings.lockScreenTimeout,
                    chartSelectors: oldProfileData.settings.chartSelectors,
                },
                ledgerMigrationCount: 0,
            })
        })
    })
})
