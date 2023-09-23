export interface IVestingOverview {
    accumulatedPayout: number
    remainingPayout: number
    totalRewards: number
    rewardsPerAddresses: IRewardsPerAddresses[]
}

export interface IRewardsPerAddresses {
    address: string
    amount: number
}
