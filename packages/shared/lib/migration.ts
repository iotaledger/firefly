import { get, writable, Writable } from 'svelte/store'
import type { MigrationData } from 'shared/lib/typings/migration'
import { api } from 'shared/lib/wallet'

export const MIGRATION_NODE = 'https://nodes.devnet.iota.org'

export const ADDRESS_SECURITY_LEVEL = 2

interface MigrationState {
    data: Writable<MigrationData>,
    seed: Writable<string>
}

/*
 * Migration state
 */
export const migration = writable<MigrationState>({
    data: writable<MigrationData>({
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
        api.getMigrationData(migrationSeed, MIGRATION_NODE, ADDRESS_SECURITY_LEVEL, initialAddressIndex, {
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
