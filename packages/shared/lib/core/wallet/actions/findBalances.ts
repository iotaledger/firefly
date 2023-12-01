// TODO(2.0) Fix all of this after having implemented the recover wallets

import { DEFAULT_SYNC_OPTIONS, SearchAlgorithmType } from '@core/wallet'
import { updateLedgerNanoStatus } from '@core/ledger'
import {
    BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION,
    UnableToFindProfileTypeError,
    activeProfile,
    isActiveLedgerProfile,
    RecoverAccountsPayload,
} from '@core/profile'
import { get } from 'svelte/store'

const INITIAL_SEARCH_ADDRESS_START_INDEX = 0
const INITIAL_SEARCH_ACCOUNT_START_INDEX = 0

let searchAddressStartIndex: number
let searchAccountStartIndex: number

let _accountGapLimit: number
let _addressGapLimit: number

export function initialiseAccountRecoveryConfiguration(
    algortihmType: SearchAlgorithmType,
    config?: RecoverAccountsPayload
): void {
    const profileType = get(activeProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }
    const { initialAccountRange, accountGapLimit, addressGapLimit } =
        BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION[profileType]

    _accountGapLimit = config ? config.accountGapLimit : accountGapLimit
    _addressGapLimit = config ? config.addressGapLimit : addressGapLimit
    searchAccountStartIndex = config ? config.accountStartIndex : initialAccountRange

    searchAddressStartIndex =
        algortihmType === SearchAlgorithmType.BFS ? _addressGapLimit : INITIAL_SEARCH_ADDRESS_START_INDEX
}

export async function findBalances(
    algortihmType: SearchAlgorithmType,
    init?: boolean,
    config?: RecoverAccountsPayload
): Promise<void> {
    const _isActiveLedgerProfile = get(isActiveLedgerProfile)
    try {
        if (init) {
            initialiseAccountRecoveryConfiguration(algortihmType, config)
        }
        if (_isActiveLedgerProfile) {
            // Note: This is a way to know the ledger is doing heavy work
            updateLedgerNanoStatus({ busy: true })
        }
        if (algortihmType === SearchAlgorithmType.BFS || algortihmType === SearchAlgorithmType.IDS) {
            await breadthSearchAndRecoverAccounts(config)
            searchAccountStartIndex += _accountGapLimit
        }
        if (algortihmType === SearchAlgorithmType.DFS || algortihmType === SearchAlgorithmType.IDS) {
            await depthSearchAndRecoverAccounts(config)
            // TODO: Improve the address start index, checking which is the last address index found in a account and continuing searching from that index
            searchAddressStartIndex += _addressGapLimit
        }
    } catch (error) {
        const message = error?.message ?? error?.error ?? ''
        throw new Error(message)
    } finally {
        if (_isActiveLedgerProfile) {
            updateLedgerNanoStatus({ busy: false })
        }
    }
}

// Perform an in-depth search, looking for outputs in all searched accounts starting from the previous address index
async function depthSearchAndRecoverAccounts(config?: RecoverAccountsPayload): Promise<void> {
    let recoverAccountsPayload: RecoverAccountsPayload
    if (config) {
        recoverAccountsPayload = {
            ...config,
            syncOptions: {
                ...(config.syncOptions || DEFAULT_SYNC_OPTIONS),
                addressStartIndex: searchAddressStartIndex, // TODO(2.0) Fix this
                addressStartIndexInternal: searchAddressStartIndex,
            },
        }
    } else {
        recoverAccountsPayload = {
            accountStartIndex: INITIAL_SEARCH_ACCOUNT_START_INDEX,
            accountGapLimit: searchAccountStartIndex,
            addressGapLimit: _addressGapLimit,
            syncOptions: {
                ...DEFAULT_SYNC_OPTIONS,
                addressStartIndex: searchAddressStartIndex,
                addressStartIndexInternal: searchAddressStartIndex,
            },
        }
    }
    await recoverAccounts(recoverAccountsPayload)
}

// Perform a breadth search, looking for outputs in all previous addresses of a new account index
async function breadthSearchAndRecoverAccounts(config?: RecoverAccountsPayload): Promise<void> {
    for (
        let chunkAddressStartIndex = INITIAL_SEARCH_ADDRESS_START_INDEX;
        chunkAddressStartIndex < searchAddressStartIndex;
        chunkAddressStartIndex += _addressGapLimit
    ) {
        let recoverAccountsPayload: RecoverAccountsPayload
        if (config) {
            recoverAccountsPayload = {
                ...config,
                accountStartIndex: searchAccountStartIndex,
                syncOptions: {
                    ...(config.syncOptions || DEFAULT_SYNC_OPTIONS),
                    addressStartIndex: chunkAddressStartIndex, // TODO(2.0) Fix this
                    addressStartIndexInternal: chunkAddressStartIndex,
                },
            }
        } else {
            recoverAccountsPayload = {
                accountStartIndex: searchAccountStartIndex,
                accountGapLimit: _accountGapLimit,
                addressGapLimit: _addressGapLimit,
                syncOptions: {
                    ...DEFAULT_SYNC_OPTIONS,
                    addressStartIndex: chunkAddressStartIndex, // TODO(2.0) Fix this
                    addressStartIndexInternal: chunkAddressStartIndex,
                },
            }
        }
        await recoverAccounts(recoverAccountsPayload)
    }
}
