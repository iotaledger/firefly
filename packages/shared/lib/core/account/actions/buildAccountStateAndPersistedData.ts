import { localize } from '@core/i18n'
import { IAccount, IAccountState, IPersistedAccountData } from '../interfaces'
import { getRandomAccountColor } from '../utils'
import { buildAccountState } from './buildAccountState'

export async function buildAccountStateAndPersistedData(
    account: IAccount,
    name?: string,
    color?: string
): Promise<[IAccountState, IPersistedAccountData]> {
    const { index } = account.getMetadata()
    const persistedAccountData: IPersistedAccountData = {
        name: name || `${localize('general.account')} ${index + 1}`,
        color: color || getRandomAccountColor(),
        hidden: false,
        shouldRevote: false,
    }
    const accountState = await buildAccountState(account, persistedAccountData)
    return [accountState, persistedAccountData]
}
