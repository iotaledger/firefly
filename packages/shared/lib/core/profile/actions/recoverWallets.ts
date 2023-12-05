import { IWallet, RecoverAccountsPayload } from '../interfaces'

// TODO(2.0): Refactor all this, recover accounts has changed completely
// as it is not provided by the SDK anymore
export function recoverWallets(
    _recoverAccountsPayload: RecoverAccountsPayload,
): Promise<IWallet[]> {
    return Promise.resolve([])
}
