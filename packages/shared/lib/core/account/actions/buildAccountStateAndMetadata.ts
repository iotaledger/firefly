import { getRandomAccountColor } from '../utils'
import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { localize } from '@core/i18n'
import { activeAccounts } from '@core/profile'
import { get } from 'svelte/store'

export async function buildAccountStateAndMetadata(
    account: IAccount,
    name?: string,
    color?: string
): Promise<[IAccountState, IAccountMetadata]> {
    const metadata = {
        id: account.meta.index.toString(),
        name: name || `${localize('general.account')} ${account.meta.index + 1}`,
        color: color || getRandomAccountColor(),
        hidden: false,
    }
    const accountState = await buildAccountState(account, metadata)
    return [accountState, metadata]
}
