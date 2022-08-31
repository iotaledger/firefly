import { IAccount, sumTotalFromOutputs } from '@core/account'
import { filterShimmerClaimingOutputs } from '@core/utils'

export async function sumTotalUnclaimedRewards(accounts: IAccount[]): Promise<number> {
    let totalUnclaimedRewards = 0

    for (const account of accounts) {
        const unspentOutputs = (await account?.listUnspentOutputs()).filter(filterShimmerClaimingOutputs)
        totalUnclaimedRewards += sumTotalFromOutputs(unspentOutputs)
    }

    return totalUnclaimedRewards
}
