import { addAccountMetadataToActiveProfile, getAccountMetadataById } from '@core/profile'
import { IAccount, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { buildAccountStateAndMetadata } from './buildAccountStateAndMetadata'

export async function loadAccount(account: IAccount): Promise<IAccountState> {
    // Temporary sync on load until we enable background sync and event listeners
    await account.sync()
    const metadata = getAccountMetadataById(account?.meta?.index.toString())
    let accountState
    if (metadata) {
        accountState = await buildAccountState(account, metadata)
    } else {
        const [newAccountState, metadata] = await buildAccountStateAndMetadata(account)
        addAccountMetadataToActiveProfile(metadata)
        accountState = newAccountState
    }
    return accountState
}
