export interface IClaimedActivitiesPerAccount {
    accountId: string
    activities: Map<string, IClaimedActivities>
}

export interface IClaimedActivities {
    isClaimed: boolean
    claimedTransactionId: string
    claimedTimestamp: number
}
