export interface IClaimedActivitiesPerAccount {
    accountIndex: number
    activities: Map<string, IClaimedActivities>
}

export interface IClaimedActivities {
    id: string
    claimingTransactionId: string
    claimedTimestamp: number
}
