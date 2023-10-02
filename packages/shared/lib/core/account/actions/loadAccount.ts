import { addAccountPersistedDataToActiveProfile, getActiveProfilePersistedAccountData } from '@core/profile'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IAccount, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { buildAccountStateAndPersistedData } from './buildAccountStateAndPersistedData'

export async function loadAccount(account: IAccount): Promise<IAccountState> {
    // Temporary sync on load until we enable background sync and event listeners
    const accountIndex = account.getMetadata().index
    const addresses = await account.addresses()
    await account.sync({ ...DEFAULT_SYNC_OPTIONS, addresses: addresses.map((a) => a.address) })
    const accountPersistedData = getActiveProfilePersistedAccountData(accountIndex)
    let accountState: IAccountState
    if (accountPersistedData) {
        accountState = await buildAccountState(account, accountPersistedData)
    } else {
        const [newAccountState, accountPersistedData] = await buildAccountStateAndPersistedData(account)
        addAccountPersistedDataToActiveProfile(accountIndex, accountPersistedData)
        accountState = newAccountState
    }
    return accountState
}
