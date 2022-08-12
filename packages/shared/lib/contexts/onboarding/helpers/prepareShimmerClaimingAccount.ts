import { IAccount, IAccountBalance } from '@core/account'

import { ShimmerClaimingAccountState } from '../enums'
import { IShimmerClaimingAccount } from '../interfaces'
import { OutputData } from '@iota/wallet/types/output'

/* eslint-disable-next-line @typescript-eslint/require-await */
export async function prepareShimmerClaimingAccount(
    account: IAccount,
    twinAccount?: IAccount,
    syncAccounts?: boolean
): Promise<IShimmerClaimingAccount> {
    if (syncAccounts) {
        await syncAccountsInParallel(account, twinAccount)
    }

    const twinUnspentOutputs = await twinAccount?.listUnspentOutputs()
    const claimedRewards = getTotalAmountFromOutputs(twinUnspentOutputs)

    const unspentOutputs = await account?.listUnspentOutputs()
    const unclaimedRewards = getTotalAmountFromOutputs(unspentOutputs)

    const state = deriveShimmerClaimingAccountState(claimedRewards, unclaimedRewards)

    return {
        ...account,
        ...(twinAccount && { twinAccount }),
        state,
        claimedRewards,
        unclaimedRewards,
    }
}

function getTotalAmountFromOutputs(outputs: OutputData[]): number {
    return outputs?.reduce((total: number, curr: OutputData) => (total += Number(curr?.output?.amount)), 0)
}

async function syncAccountsInParallel(...accounts: IAccount[]): Promise<IAccountBalance[]> {
    return Promise.all(accounts.map((account) => account?.sync()))
}

function deriveShimmerClaimingAccountState(
    claimedRewards: number,
    unclaimedRewards: number
): ShimmerClaimingAccountState {
    if (claimedRewards > 0) {
        if (unclaimedRewards > 0) {
            return ShimmerClaimingAccountState.PartiallyClaimed
        } else {
            return ShimmerClaimingAccountState.FullyClaimed
        }
    } else {
        return ShimmerClaimingAccountState.Unclaimed
    }
}
