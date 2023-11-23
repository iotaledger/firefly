import { IAccount } from '@core/account'
import { RecoverAccountsPayload } from '@core/profile-manager/interfaces'

// TODO(2.0): Refactor all this, recover accounts has changed completely
// as it is not provided by the SDK anymore
export function recoverAccounts(
    _recoverAccountsPayload: RecoverAccountsPayload,
): Promise<IAccount[]> {
    return Promise.resolve([])
}
