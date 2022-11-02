import { IAsset, Subject, NewTransactionType } from '@core/wallet'

export type NewTransactionDetails = NewBaseTransactionDetails & (NewNftTransactionDetails | NewTokenTransactionDetails)

export type NewBaseTransactionDetails = {
    metadata: string
    recipient: Subject
    tag: string
    expirationDate?: Date
    giftStorageDeposit?: boolean
    surplus?: string
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
}

export type NewTokenTransactionDetails = {
    type: NewTransactionType.TokenTransfer
    rawAmount: string
    asset: IAsset
    unit: string
}

export type NewNftTransactionDetails = {
    type: NewTransactionType.NftTransfer
    nftId: string
}
