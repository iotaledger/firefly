import { filterShimmerClaimingOutputs } from '@core/utils'
import { IWallet } from '@core/profile'
import { sumTotalFromOutputs } from '@core/wallet/utils'

export async function sumTotalUnclaimedRewards(wallets: IWallet[]): Promise<number> {
    let totalUnclaimedRewards = 0

    for (const wallet of wallets) {
        const unspentOutputs = (await wallet?.unspentOutputs())?.filter(filterShimmerClaimingOutputs)
        totalUnclaimedRewards += sumTotalFromOutputs(unspentOutputs)
    }

    return totalUnclaimedRewards
}
