import { IAccount, UnableToGetBoundAccountError } from '@core/account'
import { createAccount, getAccount, profileManager as _profileManager } from '@core/profile-manager'

export async function getBoundAccount(
    accountIndex: number,
    createAccountsIfNotFound: boolean = false,
    profileManager = _profileManager
): Promise<IAccount> {
    try {
        /**
         * CAUTION: Do NOT remove the `await` keyword here.
         * It is needed in the case of handling an AccountNotFound
         * error by creating more accounts.
         */
        const account = await getAccount(accountIndex ?? 0, profileManager)
        return account
    } catch (err) {
        // TODO: Update error type when sdk Error enum has been updated
        if (err?.type === 'wallet' && createAccountsIfNotFound) {
            for (let indexToCreateAccount = 0; indexToCreateAccount < accountIndex; indexToCreateAccount++) {
                const account = await createAccount({}, profileManager)
                if (account?.getMetadata()?.index === accountIndex) {
                    return account
                }
            }
            throw new UnableToGetBoundAccountError()
        } else {
            throw err
        }
    }
}
