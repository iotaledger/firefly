import { getRandomAccountColor } from '../utils'
import { IAccount, IAccountPersistedData, IAccountState } from '../interfaces'
import { buildAccountState } from './buildAccountState'
import { localize } from '@core/i18n'

export async function buildAccountStateAndPersistedData(
    account: IAccount,
    name?: string,
    color?: string
): Promise<[number, IAccountState, IAccountPersistedData]> {
    const { index } = account.getMetadata()
    const accountPersistedData: IAccountPersistedData = {
        name: name || `${localize('general.account')} ${index + 1}`,
        color: color || getRandomAccountColor(),
        hidden: false,
        shouldRevote: false,
    }
    const accountState = await buildAccountState(index, account, accountPersistedData)
    return [index, accountState, accountPersistedData]
}
