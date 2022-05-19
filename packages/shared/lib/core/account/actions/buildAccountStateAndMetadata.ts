import { getRandomAccountColor } from '../utils'
import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'

export async function buildAccountStateAndMetadata(
    account: IAccount,
    color?: string
): Promise<[IAccountState, IAccountMetadata]> {
    const metadata = {
        id: account.meta.index.toString(),
        name: account.meta.alias,
        color: color || getRandomAccountColor(),
        hidden: false,
    }
    const accountState = await buildAccountState(account, metadata)
    return [accountState, metadata]
}
