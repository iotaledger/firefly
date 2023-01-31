import { addAccountMetadataToActiveProfile, getAccountMetadataByIndex } from '@core/profile'
import { DEFAULT_SYNC_OPTIONS } from '../constants'
import { IAccount, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { buildAccountStateAndMetadata } from './buildAccountStateAndMetadata'

export async function loadAccount(account: IAccount): Promise<IAccountState> {
    // Temporary sync on load until we enable background sync and event listeners
    await account.sync(DEFAULT_SYNC_OPTIONS)
    const metadata = getAccountMetadataByIndex(account.getMetadata().index)
    let accountState: IAccountState
    if (metadata) {
        accountState = await buildAccountState(account, metadata)
    } else {
        const [newAccountState, metadata] = await buildAccountStateAndMetadata(account)
        addAccountMetadataToActiveProfile(metadata)
        accountState = newAccountState
    }
    return accountState
}
