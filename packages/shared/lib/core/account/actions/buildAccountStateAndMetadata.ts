import { getRandomAccountColor } from '../utils'
import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { localize } from '@core/i18n'

export async function buildAccountStateAndMetadata(
    account: IAccount,
    name?: string,
    color?: string
): Promise<[IAccountState, IAccountMetadata]> {
    const { index } = account.getMetadata()
    const metadata = {
        id: index.toString(),
        name: name || `${localize('general.account')} ${index + 1}`,
        color: color || getRandomAccountColor(),
        hidden: false,
    }
    const accountState = await buildAccountState(account, metadata)
    return [accountState, metadata]
}
