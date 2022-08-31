export interface IShimmerClaimingTransactionStore {
    [profileId: string]: {
        [transactionId: string]: boolean
    }
}
