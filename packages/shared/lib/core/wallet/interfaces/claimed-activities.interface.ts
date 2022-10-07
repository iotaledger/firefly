export interface IClaimedActivitiesPerProfile {
    [profileId: string]: {
        [accountIndex: string]: {
            [transactionId: string]: IClaimedActivities
        }
    }
}

export interface IClaimedActivities {
    id: string
    claimingTransactionId: string
    claimedTimestamp: number
}
