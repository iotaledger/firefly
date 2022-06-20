export interface IClaimedActivitiesPerAccount {
    accountId: string
    activities: Map<string, IClaimedActivities>
}

export interface IClaimedActivities {
    isClaimed: boolean
    id: string
    claimingTransactionId: string
    claimedTimestamp: number
}
