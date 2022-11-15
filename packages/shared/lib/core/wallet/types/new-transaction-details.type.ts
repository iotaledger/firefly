import { ILayer2Parameters } from '@core/layer-2'
import { IAsset, Subject, NewTransactionType } from '@core/wallet'

export type NewTransactionDetails = NewNftTransactionDetails | NewTokenTransactionDetails

type NewBaseTransactionDetails = {
    metadata?: string
    recipient: Subject
    tag?: string
    expirationDate?: Date
    giftStorageDeposit?: boolean
    surplus?: string
    layer2Parameters?: ILayer2Parameters
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
    addSenderFeature?: boolean
}

export type NewTokenTransactionDetails = NewBaseTransactionDetails & {
    type: NewTransactionType.TokenTransfer
    rawAmount: string
    asset: IAsset
    unit: string
}

export type NewNftTransactionDetails = NewBaseTransactionDetails & {
    type: NewTransactionType.NftTransfer
    nftId: string
}
