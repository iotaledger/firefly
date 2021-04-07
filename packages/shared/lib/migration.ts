import { get, derived, writable, Writable } from 'svelte/store'
import type { MigrationBundle, MigrationData, Input } from 'shared/lib/typings/migration'
import { api } from 'shared/lib/wallet'
import { activeProfile, updateProfile } from 'shared/lib/profile'

export const LOG_FILE_NAME = 'migration'

export const MIGRATION_NODE = 'https://nodes-migration-legacy.iota.cafe:443'

export const PERMANODE = 'https://chronicle.iota.org/api'

export const ADDRESS_SECURITY_LEVEL = 2

export const MINIMUM_MIGRATION_BALANCE = 1000

/** Bundle mining timeout for each bundle */
export const MINING_TIMEOUT_SECONDS = 60

export const MINIMUM_WEIGHT_MAGNITUDE = 14;

const MAX_INPUTS_PER_BUNDLE = 1

interface Bundle {
    index: number;
    shouldMine: boolean;
    bundleHash?: string;
    crackability?: number;
    migrated: boolean;
    selected: boolean;
    inputs: Input[];
}

interface MigrationState {
    didComplete: Writable<boolean>;
    data: Writable<MigrationData>,
    seed: Writable<string>
    bundles: Writable<Bundle[]>
}

/*
 * Migration state
 */
export const migration = writable<MigrationState>({
    didComplete: writable<boolean>(false),
    data: writable<MigrationData>({
        lastCheckedAddressIndex: 0,
        balance: 0,
        inputs: []
    }),
    seed: writable<string>(null),
    bundles: writable<Bundle[]>([])
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
    const { seed, data } = get(migration)

    // data.set({
    //     balance: 0,
    //     inputs: [{
    //         address: 'A'.repeat(81),
    //         index: 0,
    //         balance: 11111110,
    //         spent: true,
    //         securityLevel: 2,
    //         spentBundleHashes: ['9'.repeat(81)]
    //     }, {
    //         address: 'B'.repeat(81),
    //         index: 1,
    //         balance: 10,
    //         spent: false,
    //         securityLevel: 2,
    //         spentBundleHashes: []
    //     }, {
    //         address: 'C'.repeat(81),
    //         index: 2,
    //         balance: 110,
    //         spent: true,
    //         securityLevel: 2,
    //         spentBundleHashes: ['9'.repeat(81)]

    //     }, {
    //         address: 'D'.repeat(81),
    //         index: 3,
    //         balance: 12210,
    //         spent: false,
    //         securityLevel: 2,
    //         spentBundleHashes: []
    //     }, {
    //         address: 'E'.repeat(81),
    //         index: 4,
    //         balance: 12210,
    //         spent: false,
    //         securityLevel: 2,
    //         spentBundleHashes: []
    //     }],
    //     lastCheckedAddressIndex: 30
    // })

    // prepareBundles()
    return new Promise((resolve, reject) => {
        api.getMigrationData(
            migrationSeed,
            [MIGRATION_NODE],
            ADDRESS_SECURITY_LEVEL,
            initialAddressIndex,
            undefined, {
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

                prepareBundles()

                resolve()
            },
            onError(error) {
                reject(error)
            },
        })
    })
};

/**
 * Creates migration bundle
 * 
 * @method createMigrationBundle
 * 
 * @param {number[]} inputIndexes 
 * @param {boolean} mine
 * 
 * @returns {Promise}
 */
export const createMigrationBundle = (inputAddressIndexes: number[], mine: boolean): Promise<any> => {
    const { seed } = get(migration)

    return new Promise((resolve, reject) => {
        api.createMigrationBundle(get(seed), inputAddressIndexes, mine, MINING_TIMEOUT_SECONDS, LOG_FILE_NAME, {
            onSuccess(response) {
                assignBundleHash(inputAddressIndexes, response.payload)
                resolve(response)
            },
            onError(error) {
                reject(error)
            },
        })
    })
};

export const sendMigrationBundle = (bundleHash: string, mwm = MINIMUM_WEIGHT_MAGNITUDE): Promise<void> => {
    return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //     const _activeProfile = get(activeProfile)

        //     updateProfile(
        //         'migratedTransactions',
        //         _activeProfile.migratedTransactions ? [..._activeProfile.migratedTransactions, {
        //             address: 'x'.repeat(81),
        //             balance: '10 Mi',
        //             timestamp: new Date().toISOString(),
        //             index: 0
        //         }] : [{
        //             address: 'x'.repeat(81),
        //             balance: '10 Mi',
        //             timestamp: new Date().toISOString(),
        //             index: 0
        //         }]
        //     )

        //     resolve()
        // }, 4000)
        api.sendMigrationBundle([MIGRATION_NODE], bundleHash, mwm, {
            onSuccess() {
                const { bundles } = get(migration);

                // Update bundle and mark it as migrated
                bundles.update((_bundles) => {
                    return _bundles.map((bundle) => {
                        if (bundle.bundleHash === bundleHash) {
                            return Object.assign({}, bundle, { migrated: true })
                        }

                        return bundle
                    })
                })
                resolve()
            },
            onError(error) {
                reject(error)
            },
        })
    })
}

/**
 * 
 * @param inputAddressIndexes 
 * @param migrationBundle 
 */
export const assignBundleHash = (inputAddressIndexes: number[], migrationBundle: MigrationBundle): void => {
    const { bundles } = get(migration);

    bundles.update((_bundles) => {
        return _bundles.map((bundle) => {
            const indexes = bundle.inputs.map((input) => input.index);
            if (indexes.length && indexes.every((index) => inputAddressIndexes.includes(index))) {
                return Object.assign({}, bundle, {
                    bundleHash: migrationBundle.bundleHash,
                    crackability: parseInt(migrationBundle.crackability.toString())
                })
            }

            return bundle
        })
    })

};

const selectInputsForUnspentAddresses = (inputs: Input[]) => {
    const createChunks = (_inputs: Input[]) => {
        let chunks = [];

        _inputs.forEach(_input => {
            const chunkIndex = chunks
                .findIndex(_chunk => {
                    const sum = _chunk.reduce((acc, chunkInput) => acc + chunkInput.balance, 0);

                    return (sum + _input.balance) >= MINIMUM_MIGRATION_BALANCE && _chunk.length < MAX_INPUTS_PER_BUNDLE;
                });

            if (chunkIndex > -1) {
                chunks = chunks.map((_chunk, idx) => {
                    if (idx === chunkIndex) {
                        return [..._chunk, _input]
                    }

                    return _chunk
                })
            } else {
                chunks = [...chunks, [_input]]
            }
        });

        return chunks;
    }

    const chunks = createChunks(inputs);

    const { chunksWithCorrectBalance, chunksWithLessBalance } = chunks.reduce((acc, chunk) => {
        if (chunk.reduce((acc, chunkInput) => acc + chunkInput.balance) < MINIMUM_MIGRATION_BALANCE, 0) {
            acc.chunksWithLessBalance.push(chunk);
        } else {
            acc.chunksWithCorrectBalance.push(chunk);
        }

        return acc
    }, { chunksWithCorrectBalance: [], chunksWithLessBalance: [] })

    let remainingChunks = []

    chunksWithLessBalance.forEach((chunk) => {
        chunk.forEach((c) => remainingChunks.push(c))
    })

    let chunkIndex = 0

    remainingChunks.forEach((b) => {
        chunksWithCorrectBalance[chunkIndex].push(b)

        // If runs out of chunks, reset
        if (!chunksWithCorrectBalance[chunkIndex + 1]) {
            chunkIndex = 0
        } else {
            chunkIndex++
        }
    })

    return chunksWithCorrectBalance;
};

export const prepareBundles = () => {
    const { data, bundles } = get(migration)
    const { inputs } = get(data)

    // Categorise spent vs unspent inputs
    const { spent, unspent } = inputs.reduce((acc, input) => {
        if (input.spent) {
            acc.spent.push(input)
        } else {
            acc.unspent.push(input)
        }

        return acc;
    }, { spent: [], unspent: [] })

    const unspentInputChunks = selectInputsForUnspentAddresses(unspent)

    bundles.set([
        ...spent.map((input) => ({ migrated: false, selected: input.balance >= MINIMUM_MIGRATION_BALANCE, shouldMine: true, inputs: [input] })),
        ...unspentInputChunks.map((inputs) => ({ migrated: false, selected: true, shouldMine: false, inputs }))
    ].map((_, index) => ({ ..._, index })))
};

export const getInputIndexesForBundle = (bundle: Bundle): number[] => {
    const { inputs } = bundle;

    return inputs.map((input) => input.index);
}

export const spentAddressesFromBundles = derived(get(migration).bundles, (_bundles) => _bundles
    .filter((bundle) => bundle.shouldMine === true)
    // TODO: Perhaps use a different way to gather inputs
    .map((bundle) => Object.assign({}, bundle.inputs[0], {
        bundleHash: bundle.bundleHash,
        crackability: bundle.crackability
    }))
)

export const hasSingleBundle = derived(get(migration).bundles, (_bundles) => _bundles.length === 1)

export const hasBundlesWithSpentAddresses = derived(get(migration).bundles, (_bundles) => _bundles.length && _bundles.some((bundle) => bundle.shouldMine === true))

export const toggleInputSelection = (address: string): void => {
    const { bundles } = get(migration)

    bundles.update((_bundles) => _bundles.map((bundle) => {
        if (bundle.inputs.some((input) => input.address === address)) {
            return Object.assign({}, bundle, { selected: !bundle.selected })
        }

        return bundle
    }))
}

export const selectedBundlesWithSpentAddresses = derived(get(migration).bundles, (_bundles) => _bundles.filter((bundle) =>
    bundle.selected === true &&
    bundle.shouldMine === true
))

export const unmigratedBundles = derived(get(migration).bundles, (_bundles) => _bundles.filter((bundle) =>
    bundle.migrated === false
))

export const hasMigratedAllBundles = derived(get(migration).bundles, (_bundles) => _bundles.length && _bundles.every((bundle) =>
    bundle.migrated === true
))
