import { activeProfile, updateProfile } from 'shared/lib/profile'
import type { Input, MigrationBundle, MigrationData } from 'shared/lib/typings/migration'
import type { Address } from 'shared/lib/typings/address'
import Validator from 'shared/lib/validator'
import { api } from 'shared/lib/wallet'
import { derived, get, writable, Writable } from 'svelte/store'

export const LOG_FILE_NAME = 'migration.log'

export const MIGRATION_NODE = 'https://nodes-migration4-legacy.iota.cafe/'

export const PERMANODE = 'http://permanode-migration4.iota.cafe/api'

export const ADDRESS_SECURITY_LEVEL = 2

/** Minimum migration balance */
export const MINIMUM_MIGRATION_BALANCE = 1000000

/** Bundle mining timeout for each bundle */
export const MINING_TIMEOUT_SECONDS = 60 * 10

export const MINIMUM_WEIGHT_MAGNITUDE = 14;

const MAX_INPUTS_PER_BUNDLE = 10

interface Bundle {
    index: number;
    shouldMine: boolean;
    selectedToMine: boolean;
    bundleHash?: string;
    crackability?: number;
    migrated: boolean;
    selected: boolean;
    inputs: Input[];
    miningRuns: number;
    confirmed: boolean;
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

/*
 * Chrysalis status
 */
export const chrysalisLive = writable<Boolean>(false)
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
        api.getMigrationData(
            migrationSeed,
            [MIGRATION_NODE],
            ADDRESS_SECURITY_LEVEL,
            initialAddressIndex,
            PERMANODE, {
            onSuccess(response) {
                const { seed, data } = get(migration)

                if (initialAddressIndex === 0) {
                    seed.set(migrationSeed)
                    data.set(response.payload)
                } else {
                    data.update((_existingData) => {
                        return Object.assign({}, _existingData, {
                            balance: _existingData.balance + response.payload.balance,
                            inputs: [..._existingData.inputs, ...response.payload.inputs],
                            lastCheckedAddressIndex: response.payload.lastCheckedAddressIndex
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
export const createMigrationBundle = (inputAddressIndexes: number[], offset: number, mine: boolean): Promise<any> => {
    const { seed } = get(migration)

    return new Promise((resolve, reject) => {
        api.createMigrationBundle(get(seed), inputAddressIndexes, mine, MINING_TIMEOUT_SECONDS, offset, LOG_FILE_NAME, {
            onSuccess(response) {
                assignBundleHash(inputAddressIndexes, response.payload, mine)
                resolve(response)
            },
            onError(error) {
                reject(error)
            },
        })
    })
};

/**
 * Signs and broadcast bundle to the (legacy) network
 * 
 * @method sendMigrationBundle
 * 
 * @param {string} bundleHash 
 * @param {number} [mwm]
 *  
 * @returns {Promise<void>}
 */
export const sendMigrationBundle = (bundleHash: string, mwm = MINIMUM_WEIGHT_MAGNITUDE): Promise<void> => {
    return new Promise((resolve, reject) => {
        api.sendMigrationBundle([MIGRATION_NODE], bundleHash, mwm, {
            onSuccess(response) {
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

                // Persist these bundles in local storage
                const _activeProfile = get(activeProfile)

                const migratedTransaction = {
                    address: response.payload.address,
                    balance: response.payload.value,
                    tailTransactionHash: response.payload.tailTransactionHash,
                    timestamp: new Date().toISOString(),
                    // Account index. Since we migrate funds to account at 0th index
                    account: 0
                }

                updateProfile(
                    'migratedTransactions',
                    _activeProfile.migratedTransactions ? [..._activeProfile.migratedTransactions, migratedTransaction] : [migratedTransaction]
                )
                resolve()
            },
            onError(error) {
                reject(error)
            },
        })
    })
}

/**
 * Assigns bundle hash and crackability score to bundles
 * 
 * @method assignBundleHash
 * 
 * @param inputAddressIndexes 
 * @param migrationBundle 
 * 
 * @returns {void}
 */
export const assignBundleHash = (inputAddressIndexes: number[], migrationBundle: MigrationBundle, didMine: boolean): void => {
    const { bundles } = get(migration);

    bundles.update((_bundles) => {
        return _bundles.map((bundle) => {
            const indexes = bundle.inputs.map((input) => input.index);
            if (indexes.length && indexes.every((index) => inputAddressIndexes.includes(index))) {
                const isNewCrackabilityScoreLowerThanPrevious = bundle.bundleHash && bundle.crackability && migrationBundle.crackability < bundle.crackability

                // If bundle hash is already set, that means bundle mining has already been performed for this
                if (bundle.bundleHash) {
                    return Object.assign({}, bundle, {
                        miningRuns: didMine ? bundle.miningRuns + 1 : bundle.miningRuns,
                        bundleHash: isNewCrackabilityScoreLowerThanPrevious ? migrationBundle.bundleHash : bundle.bundleHash,
                        crackability: isNewCrackabilityScoreLowerThanPrevious ? migrationBundle.crackability : bundle.crackability
                    })
                }

                return Object.assign({}, bundle, {
                    miningRuns: didMine ? bundle.miningRuns + 1 : bundle.miningRuns,
                    bundleHash: migrationBundle.bundleHash,
                    crackability: migrationBundle.crackability
                })
            }

            return bundle
        })
    })
};

/**
 * Prepares inputs (as bundles) for unspent addresses.
 * Steps:
 *   - Categorises inputs in two groups 1) inputs with balance >= MINIMUM_MIGRATION_BALANCE 2) inputs with balance < MINIMUM_MIGRATION_BALANCE
 *   - Creates chunks of category 1 input addresses such that length of each chunk should not exceed MAX_INPUTS_PER_BUNDLE
 *   - For category 2: 
 *         - Sort the inputs in descending order based on balance;
 *         - Pick first N inputs (where N = MAX_INPUTS_PER_BUNDLE) and see if their accumulative balance >= MINIMUM_MIGRATION_BALANCE
 *         - If yes, then repeat the process for next N inputs. Otherwise, iterate on the remaining inputs and add it to a chunk that has space for more inputs
 *         - If there's no chunk with space left, then ignore these funds. NOTE THAT THESE FUNDS WILL ESSENTIALLY BE LOST!
 * 
 * NOTE: If the total sum of provided inputs are less than MINIMUM_MIGRATION_BALANCE, then this method will just return and empty array as those funds can't be migrated.
 * 
 * This method gives precedence to max inputs over funds. It ensures, a maximum a bundle could have is 30 inputs and their accumulative balance >= MINIMUM_MIGRATION_BALANCE
 * 
 * @method selectInputsForUnspentAddresses
 * 
 * @params {Input[]} inputs
 * 
 * @returns {Input[][]}
 */
const selectInputsForUnspentAddresses = (inputs: Input[]): Input[][] => {
    const totalInputsBalance: number = inputs.reduce((acc, input) => acc + input.balance, 0);

    // If the total sum of unspent addresses is less than MINIMUM MIGRATION BALANCE, just return an empty array as these funds cannot be migrated
    if (totalInputsBalance < MINIMUM_MIGRATION_BALANCE) {
        return [];
    }

    const { inputsWithEnoughBalance, inputsWithLowBalance } = inputs.reduce((acc, input) => {
        if (input.balance >= MINIMUM_MIGRATION_BALANCE) {
            acc.inputsWithEnoughBalance.push(input);
        } else {
            acc.inputsWithLowBalance.push(input);
        }

        return acc;
    }, { inputsWithEnoughBalance: [], inputsWithLowBalance: [] })

    let chunks = inputsWithEnoughBalance.reduce((acc, input, index) => {
        const chunkIndex = Math.floor(index / MAX_INPUTS_PER_BUNDLE)

        if (!acc[chunkIndex]) {
            acc[chunkIndex] = [] // start a new chunk
        }

        acc[chunkIndex].push(input)

        return acc
    }, [])

    const fill = (_inputs) => {
        _inputs.every((input) => {
            const chunkIndexWithSpaceForInput = chunks.findIndex((chunk) => chunk.length < MAX_INPUTS_PER_BUNDLE);

            if (chunkIndexWithSpaceForInput > -1) {
                chunks = chunks.map((chunk, idx) => {
                    if (idx === chunkIndexWithSpaceForInput) {
                        return [...chunk, input]
                    }

                    return chunk
                })

                return true;
            }

            // If there is no space, then exit
            return false;
        })
    }

    const totalBalanceOnInputsWithLowBalance: number = inputsWithLowBalance.reduce((acc, input) => acc + input.balance, 0)

    // If all the remaining input addresses have accumulative balance less than the minimum migration balance,
    // Then sort the inputs in descending order and try to pair the
    if (totalBalanceOnInputsWithLowBalance < MINIMUM_MIGRATION_BALANCE) {
        const sorted = inputsWithLowBalance.slice().sort((a, b) => b.balance - a.balance)

        fill(sorted)
    } else {
        let startIndex = 0

        const sorted = inputsWithLowBalance.slice().sort((a, b) => b.balance - a.balance)
        const max = Math.ceil(sorted.length / MAX_INPUTS_PER_BUNDLE);

        while (startIndex < max) {
            const inputsSubset = sorted.slice(startIndex * MAX_INPUTS_PER_BUNDLE, (startIndex + 1) * MAX_INPUTS_PER_BUNDLE)
            const balanceOnInputsSubset = inputsSubset.reduce((acc, input) => acc + input.balance, 0);

            if (balanceOnInputsSubset >= MINIMUM_MIGRATION_BALANCE) {
                chunks = [...chunks, inputsSubset]
            } else {
                fill(inputsSubset)
            }

            startIndex++;
        }
    }

    return chunks;
};

/**
 * Prepares bundles from inputs
 * 
 * @method prepareBundles
 * 
 * @returns {void}
 */
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
    const spentInputs = spent.filter((input) => input.balance >= MINIMUM_MIGRATION_BALANCE)

    const _shouldMine = (input) => (input.spentBundleHashes && input.spentBundleHashes.length > 0)

    bundles.set([
        ...spentInputs.map((input) => ({ confirmed: false, miningRuns: 0, migrated: false, selected: true, shouldMine: _shouldMine(input), selectedToMine: true, inputs: [input] })),
        ...unspentInputChunks.map((inputs) => ({ confirmed: false, miningRuns: 0, migrated: false, selected: true, shouldMine: false, selectedToMine: false, inputs }))
    ].map((_, index) => ({ ..._, index })))
};

/**
 * Gets input indexes for all addresses / inputs in a bundle
 * 
 * @method getInputIndexesForBundle
 * 
 * @param {Bundle} bundle
 *  
 * @returns {number[]} 
 */
export const getInputIndexesForBundle = (bundle: Bundle): number[] => {
    const { inputs } = bundle;

    return inputs.map((input) => input.index);
}

/**
 * Get all spent addresses from bundles
 */
export const spentAddressesFromBundles = derived(get(migration).bundles, (_bundles) => _bundles
    .filter((bundle) => bundle.migrated === false && bundle.shouldMine === true)
    .map((bundle) => Object.assign({}, bundle.inputs[0], {
        selectedToMine: bundle.selectedToMine,
        bundleHash: bundle.bundleHash,
        crackability: bundle.crackability
    }))
)

/**
 * Determines if we only have a single bundle to migrate
 */
export const hasSingleBundle = derived(get(migration).bundles, (_bundles) => _bundles.length === 1 && _bundles[0].selected === true)

/**
 * Determines if we have bundles with spent addresses
 */
export const hasBundlesWithSpentAddresses = derived(get(migration).bundles, (_bundles) => _bundles.length && _bundles.some((bundle) => bundle.shouldMine === true &&
    bundle.selected === true))

/**
 * Toggles mining selection
 * 
 * @method toggleMiningSelection
 * 
 * @param {Address} address
 * 
 * @returns {void} 
 */
export const toggleMiningSelection = (address: Address): void => {
    const { bundles } = get(migration)

    bundles.update((_bundles) => _bundles.map((bundle) => {
        if (bundle.inputs.some((input) => input.address === address.address)) {
            return Object.assign({}, bundle, { selectedToMine: !bundle.selectedToMine })
        }

        return bundle
    }))
}

/**
 * Selects all addresses for mining
 * 
 * @method selectAllAddressesForMining
 * 
 * @returns {void}
 */
export const selectAllAddressesForMining = (): void => {
    const { bundles } = get(migration)
    bundles.update((_bundles) => _bundles.map((bundle) => {
        if (bundle.shouldMine) {
            return Object.assign({}, bundle, { selectedtoMine: true })
        }
        return bundle
    }))
}

/**
 * Resets migration state
 * 
 * @method resetMigrationState
 * 
 * @returns {void}
 */
export const resetMigrationState = (): void => {
    const { didComplete, data, seed, bundles } = get(migration)
    didComplete.set(false)
    data.set({
        lastCheckedAddressIndex: 0,
        balance: 0,
        inputs: []
    })
    seed.set(null)
    bundles.set([])
}

/**
 * All selected bundles for mining
 */
export const selectedBundlesToMine = derived(get(migration).bundles, (_bundles) => _bundles.filter((bundle) =>
    bundle.selectedToMine === true &&
    bundle.shouldMine === true
))

/**
 * All selected bundles that are yet to migrate
 */
export const unmigratedBundles = derived(get(migration).bundles, (_bundles) => _bundles.filter((bundle) =>
    bundle.selected === true &&
    bundle.migrated === false
))

/**
 * Determines if we have migrated all bundles
 */
export const hasMigratedAllBundles = derived(get(migration).bundles, (_bundles) => _bundles.length && _bundles.every((bundle) =>
    bundle.selected === true &&
    bundle.migrated === true
))

/**
 * Determines if we have migrated any bundle
 */
export const hasMigratedAnyBundle = derived(get(migration).bundles, (_bundles) => _bundles.some((bundle) =>
    bundle.selected === true &&
    bundle.migrated === true
))

/**
 * Determines if we have migrated all selected bundles
 */
export const hasMigratedAllSelectedBundles = derived(get(migration).bundles, (_bundles) => {
    const selectedBundles = _bundles.filter((bundle) => bundle.selected === true)

    return selectedBundles.length && selectedBundles.every((bundle) => bundle.migrated === true)
});

/**
 * Determines if all migrated bundles are confirmed
 */
export const hasMigratedAndConfirmedAllSelectedBundles = derived(get(migration).bundles, (_bundles) => {
    const selectedBundles = _bundles.filter((bundle) => bundle.selected === true)

    return selectedBundles.length && selectedBundles.every((bundle) => bundle.migrated === true && bundle.confirmed === true)
});

/**
 * Total migration balance
 */
export const totalMigratedBalance = derived(get(migration).bundles, (_bundles) => {
    return _bundles.reduce((acc, bundle) => {
        if (bundle.selected && bundle.migrated) {
            return acc + bundle.inputs.reduce((_acc, input) => _acc + input.balance, 0)
        }

        return acc
    }, 0)
})

/**
 * Determines if all spent addresses have low (less than MINIMUM MIGRATION) balance
 */
export const hasLowBalanceOnAllSpentAddresses = derived(get(migration).bundles, (_bundles) => {
    const bundlesWithSpentAddresses = _bundles.filter((bundle) =>
        bundle.shouldMine === true
    );

    return bundlesWithSpentAddresses.length && bundlesWithSpentAddresses.every((bundle) => bundle.inputs.every((input) => input.balance < MINIMUM_MIGRATION_BALANCE))
})

/**
 * Bundles with unspent addresses as inputs
 */
export const bundlesWithUnspentAddresses = derived(get(migration).bundles, (_bundles) => _bundles.filter((bundle) =>
    bundle.selected === true &&
    bundle.shouldMine === false
))

/**
 * Determines if there is any spent address with associated (previous) bundle hashes
 */
export const hasAnySpentAddressWithNoBundleHashes = derived(get(migration).bundles, (_bundles) => _bundles.length &&
    _bundles.some((bundle) => bundle.inputs.some((input) => input.spent && ((Array.isArray(input.spentBundleHashes) && !input.spentBundleHashes.length) || input.spentBundleHashes === null))))


/**
 * All spent address that have no bundle hashes
 */
export const spentAddressesWithNoBundleHashes = derived([get(migration).data, get(migration).bundles], ([data]) => data.inputs.filter((input) => input.spent && input.balance >= MINIMUM_MIGRATION_BALANCE && ((Array.isArray(input.spentBundleHashes) && !input.spentBundleHashes.length) || input.spentBundleHashes === null)))

/**
 * Inputs that were not selected for migration (have low balance)
 */
export const unselectedInputs = derived([get(migration).data, get(migration).bundles], ([data, bundles]) => {
    return data.inputs.filter((input) => !bundles.some((bundle) => bundle.inputs.some((bundleInput) => bundleInput.address === input.address)))
})

/**
 * All confirmed bundles
 */
export const confirmedBundles = derived(get(migration).bundles, (_bundles) => _bundles.filter((bundle) =>
    bundle.selected === true &&
    bundle.confirmed === true
))

/**
 * List of chrysalis node endpoints to detect when is live
 */
// TODO: Update to mainnet chrysalis endpoint
export const CHRYSALIS_NODE_ENDPOINTS = ['https://api.lb-0.migration4.iotatestmigration4.net/api/v1/info']

/**
* Default timeout for a request made to an endpoint
*/
const DEFAULT_CHRYSALIS_NODE_ENDPOINT_TIMEOUT = 5000

/**
* Mainnet ID used in a chrysalis node 
*/
// TODO: Update to 'mainnet'
const MAINNET_ID = 'migration4'

/**
 * Default interval for polling the market data
 */
const DEFAULT_CHRYSALIS_NODE_POLL_INTERVAL = 300000 // 5 minutes

type ChrysalisNode = {
    data: ChrysalisNodeData
}

type ChrysalisNodeData = {
    networkId: string
}

export type ChrysalisNodeDataValidationResponse = {
    type: 'ChrysalisNode'
    payload: ChrysalisNode
}

let chrysalisStatusIntervalID = null

/**
 * Poll the Chrysalis mainnet status at an interval
 */
export async function pollChrysalisStatus(): Promise<void> {
    await checkChrysalisStatus()
    chrysalisStatusIntervalID = setInterval(async () => checkChrysalisStatus(), DEFAULT_CHRYSALIS_NODE_POLL_INTERVAL)
}

/**
 * Stops Chrysalis mainnet poll
 */
function stopPoll(): void {
    if (chrysalisStatusIntervalID) {
        clearInterval(chrysalisStatusIntervalID)
    }
}

/**
 * Fetches Chrysalis mainnet status
 *
 * @method fetchMarketData
 *
 * @returns {Promise<void>}
 */
export async function checkChrysalisStatus(): Promise<void> {
    const requestOptions: RequestInit = {
        headers: {
            Accept: 'application/json',
        },
    }
    for (let index = 0; index < CHRYSALIS_NODE_ENDPOINTS.length; index++) {
        const endpoint = CHRYSALIS_NODE_ENDPOINTS[index]
        try {
            const abortController = new AbortController()
            const timerId = setTimeout(
                () => {
                    if (abortController) {
                        abortController.abort();
                    }
                },
                DEFAULT_CHRYSALIS_NODE_ENDPOINT_TIMEOUT);

            requestOptions.signal = abortController.signal;

            const response = await fetch(endpoint, requestOptions);

            clearTimeout(timerId)

            const jsonResponse: ChrysalisNode = await response.json()

            const { isValid, payload } = new Validator().performValidation({
                type: 'ChrysalisNode',
                payload: jsonResponse,
            })
            if (isValid) {
                const nodeData: ChrysalisNodeData = jsonResponse?.data
                if (nodeData?.networkId === MAINNET_ID) {
                    chrysalisLive.set(true)
                    stopPoll()
                    break
                }
            } else {
                throw new Error(payload.error)
            }
            break
        } catch (err) {
            console.error(err.name === "AbortError" ? new Error(`Could not fetch from ${endpoint}.`) : err)
        }
    }
}

/**
 * Initialise migration process listeners
 */
export const initialiseMigrationListeners = () => {
    api.onMigrationProgress({
        onSuccess(response) {
            if (response.payload.event.type === 'TransactionConfirmed') {
                const { bundles } = get(migration)

                bundles.update((_bundles) => _bundles.map((bundle) => {
                    // @ts-ignore
                    if (bundle.bundleHash && bundle.bundleHash === response.payload.event.data.bundleHash) {
                        return Object.assign({}, bundle, { confirmed: true })
                    }

                    return bundle
                }))
            }
            console.log('Response', response)
        }, onError(error) {
            console.log('Error', error)
        }
    })
}


