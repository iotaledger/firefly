import { get } from 'svelte/store'

import { IAccount } from '@core/account'

import { profileManager } from '../stores'
import { api } from '../../api'
import { RecoverAccountsPayload } from '../../api/interfaces'

export function recoverAccounts(
    recoverAccountsPayload: RecoverAccountsPayload,
    manager = profileManager
): Promise<IAccount[]> {
    const { id } = get(manager)
    return api.recoverAccounts(id, recoverAccountsPayload)
}
