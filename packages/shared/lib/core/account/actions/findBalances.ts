import { DEFAULT_SYNC_OPTIONS, SearchAlgorithmType } from '@core/account'
import {
    BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION,
    UnableToFindProfileTypeError,
    activeProfile,
} from '@core/profile'
import { RecoverAccountsPayload, recoverAccounts } from '@core/profile-manager'
import { get } from 'svelte/store'

const INITIAL_SEARCH_ADDRESS_START_INDEX = 0
const INITIAL_SEARCH_ACCOUNT_START_INDEX = 0

let searchAddressStartIndex: number
let searchAccountStartIndex: number

let _accountGapLimit: number
let _addressGapLimit: number

export function initialiseAccountRecoveryConfiguration(algortihmType: SearchAlgorithmType): void {
    const profileType = get(activeProfile)?.type
    if (!profileType) {
        throw new UnableToFindProfileTypeError()
    }

    const { initialAccountRange, accountGapLimit, addressGapLimit } =
        BALANCE_FINDER_ACCOUNT_RECOVERY_CONFIGURATION[profileType]

    _accountGapLimit = accountGapLimit
    _addressGapLimit = addressGapLimit

    searchAddressStartIndex =
        algortihmType === SearchAlgorithmType.BFS ? _addressGapLimit : INITIAL_SEARCH_ADDRESS_START_INDEX
    searchAccountStartIndex = initialAccountRange
}

export async function findBalances(algortihmType: SearchAlgorithmType, init?: boolean): Promise<void> {
    if (init) {
        initialiseAccountRecoveryConfiguration(algortihmType)
    }
    if (algortihmType === SearchAlgorithmType.BFS || algortihmType === SearchAlgorithmType.IDS) {
        await breadthSearchAndRecoverAccounts()
        searchAccountStartIndex += _accountGapLimit
    }
    if (algortihmType === SearchAlgorithmType.DFS || algortihmType === SearchAlgorithmType.IDS) {
        await depthSearchAndRecoverAccounts()
        // TODO: Improve the address start index, checking which is the last address index found in a account and continuing searching from that index
        searchAddressStartIndex += _addressGapLimit
    }
}

// Perform an in-depth search, looking for outputs in all searched accounts starting from the previous address index
async function depthSearchAndRecoverAccounts(): Promise<void> {
    const recoverAccountsPayload: RecoverAccountsPayload = {
        accountStartIndex: INITIAL_SEARCH_ACCOUNT_START_INDEX,
        accountGapLimit: searchAccountStartIndex,
        addressGapLimit: _addressGapLimit,
        syncOptions: {
            ...DEFAULT_SYNC_OPTIONS,
            addressStartIndex: searchAddressStartIndex,
            addressStartIndexInternal: searchAddressStartIndex,
        },
    }
    await recoverAccounts(recoverAccountsPayload)
}

// Perform a breadth search, looking for outputs in all previous addresses of a new account index
async function breadthSearchAndRecoverAccounts(): Promise<void> {
    for (
        let chunkAddressStartIndex = INITIAL_SEARCH_ADDRESS_START_INDEX;
        chunkAddressStartIndex < searchAddressStartIndex;
        chunkAddressStartIndex += _addressGapLimit
    ) {
        const recoverAccountsPayload: RecoverAccountsPayload = {
            accountStartIndex: searchAccountStartIndex,
            accountGapLimit: _accountGapLimit,
            addressGapLimit: _addressGapLimit,
            syncOptions: {
                ...DEFAULT_SYNC_OPTIONS,
                addressStartIndex: chunkAddressStartIndex,
                addressStartIndexInternal: chunkAddressStartIndex,
            },
        }
        await recoverAccounts(recoverAccountsPayload)
    }
}
