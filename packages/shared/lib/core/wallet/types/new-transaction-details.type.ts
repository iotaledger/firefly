import type { FeatureTypes } from '@iota/types'
import { IAsset, Subject } from '@core/wallet'

export type NewTransactionDetails = NewNftTransactionDetails | NewTokenTransactionDetails

export type NewTokenTransactionDetails = {
    type: 'newToken'
    rawAmount: string
    asset: IAsset
    metadata: string
    recipient: Subject
    tag: string
    unit: string
    expirationDate?: Date
    giftStorageDeposit?: boolean
    surplus?: string
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
}

export type NewNftTransactionDetails = {
    type: 'newNft'
    nftId: string
    recipient: Subject
    immutableFeatures: FeatureTypes[]
    giftStorageDeposit?: boolean
    expirationDate?: Date
    surplus?: string
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
}
