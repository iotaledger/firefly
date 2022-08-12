import { IAccount, sumTotalFromOutputs, syncAccountsInParallel } from '@core/account'

import { IShimmerClaimingAccount } from '../interfaces'

import { deriveShimmerClaimingAccountState } from './deriveShimmerClaimingAccountState'

export async function prepareShimmerClaimingAccount(
    account: IAccount,
    twinAccount?: IAccount,
    syncAccounts?: boolean
): Promise<IShimmerClaimingAccount> {
    if (syncAccounts) {
        await syncAccountsInParallel(account, twinAccount)
    }

    const twinUnspentOutputs = await twinAccount?.listUnspentOutputs()
    const claimedRewards = sumTotalFromOutputs(twinUnspentOutputs)

    const unspentOutputs = await account?.listUnspentOutputs()
    const unclaimedRewards = sumTotalFromOutputs(unspentOutputs)

    const state = deriveShimmerClaimingAccountState(claimedRewards, unclaimedRewards)

    return {
        ...account,
        ...(twinAccount && { twinAccount }),
        state,
        claimedRewards,
        unclaimedRewards,
    }
}
