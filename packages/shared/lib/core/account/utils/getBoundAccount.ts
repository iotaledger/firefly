import { get, Writable } from 'svelte/store'

import { IAccount, UnableToGetBoundAccountError } from '@core/account'
import { api, IProfileManager, profileManager as _profileManager } from '@core/profile-manager'
import { ErrorType } from '@lib/typings/events'

export async function getBoundAccount(
    accountIndex: number,
    createAccountsIfNotFound: boolean = false,
    profileManager: Writable<IProfileManager> = _profileManager
): Promise<IAccount> {
    try {
        /**
         * CAUTION: Do NOT remove the unnecessary `await` keyword here.
         * It is needed in the case of handling an AccountNotFound
         * error by creating more accounts.
         */
        return await api?.getAccount(get(profileManager)?.id, accountIndex ?? 0)
    } catch (err) {
        if (err?.type === ErrorType?.AccountNotFound && createAccountsIfNotFound) {
            let accountsCreated = 0
            while (accountsCreated <= accountIndex) {
                const account = await get(profileManager)?.createAccount({})
                if (account?.meta?.index === accountIndex) {
                    return api?.getAccount(get(profileManager)?.id, account?.meta?.index)
                } else {
                    accountsCreated++
                }
            }
            throw new UnableToGetBoundAccountError()
        } else {
            throw err
        }
    }
}
