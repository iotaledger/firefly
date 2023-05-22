import { addAccountPersistedDataToActiveProfile, getActiveProfilePersistedAccountData } from '@core/profile'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IAccount, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { buildAccountStateAndPersistedData } from './buildAccountStateAndPersistedData'

export async function loadAccount(account: IAccount): Promise<IAccountState> {
    // Temporary sync on load until we enable background sync and event listeners
    const accountIndex = account.getMetadata().index
    await account.sync(DEFAULT_SYNC_OPTIONS)
    const persistedData = getActiveProfilePersistedAccountData(accountIndex)
    let accountState: IAccountState
    if (persistedData) {
        accountState = await buildAccountState(accountIndex, account, persistedData)
    } else {
        const [accountIndex, newAccountState, persistedData] = await buildAccountStateAndPersistedData(account)
        addAccountPersistedDataToActiveProfile(accountIndex, persistedData)
        accountState = newAccountState
    }
    return accountState
}
