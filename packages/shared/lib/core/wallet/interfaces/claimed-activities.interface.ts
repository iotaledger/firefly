export interface IClaimedActivitiesPerAccount {
    accountId: string
    activities: Map<string, IClaimedActivities>
}

export interface IClaimedActivities {
    id: string
    claimingTransactionId: string
    claimedTimestamp: number
}
