import { get, writable, Writable } from 'svelte/store'
import type { MigrationData } from 'shared/lib/typings/migration'
import { api } from 'shared/lib/wallet'

export const MIGRATION_NODE = 'https://nodes.iota.org'

export const PERMANODE = 'https://chronicle.iota.org/api'

export const ADDRESS_SECURITY_LEVEL = 2

export const MINIMUM_MIGRATION_BALANCE = 1000000

interface MigrationState {
    data: Writable<MigrationData>,
    seed: Writable<string>
}

/*
 * Migration state
 */
export const migration = writable<MigrationState>({
    data: writable<MigrationData>({
        lastCheckedAddressIndex: 0,
        balance: 0,
        inputs: []
    }),
    seed: writable<string>(null),
})

/**
 * Gets migration data and sets it to state
 * 
 * @method getMigrationData
 * 
 * @param {string} migrationSeed 
 * @param {number} initialAddressIndex 
 * 
 * @returns {Promise<void} 
 */
export const getMigrationData = (migrationSeed: string, initialAddressIndex = 0): Promise<void> => {
    return new Promise((resolve, reject) => {
        api.getMigrationData(migrationSeed, [MIGRATION_NODE], PERMANODE, ADDRESS_SECURITY_LEVEL, initialAddressIndex, {
            onSuccess(response) {
                const { seed, data } = get(migration)

                if (initialAddressIndex === 0) {
                    seed.set(migrationSeed)
                    data.set(response.payload)
                } else {
                    data.update((_existingData) => {
                        return Object.assign({}, _existingData, {
                            balance: _existingData.balance + response.payload.balance,
                            inputs: [..._existingData.inputs, ...response.payload.inputs]
                        })
                    })
                }

                resolve()
            },
            onError(error) {
                reject(error)
            },
        })
    })
};
