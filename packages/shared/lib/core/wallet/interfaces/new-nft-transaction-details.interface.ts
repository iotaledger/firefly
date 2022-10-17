import { Subject } from '@core/wallet'

export interface INewNftTransactionDetails {
    expirationDate: Date
    recipient: Subject
    giftStorageDeposit: boolean
    nftId: string
}
