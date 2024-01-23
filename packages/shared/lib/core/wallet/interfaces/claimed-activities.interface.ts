export interface IClaimedActivitiesPerProfile {
    [profileId: string]: {
        [walletId: string]: {
            [transactionId: string]: IClaimedActivities
        }
    }
}

export interface IClaimedActivities {
    id: string
    claimingTransactionId: string
    claimedTimestamp: number
}
