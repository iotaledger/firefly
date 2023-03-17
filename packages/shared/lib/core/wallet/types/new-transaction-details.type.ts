import type { ILayer2Parameters } from '@core/layer-2'
import type { Subject } from '@core/wallet'
import { NewTransactionType } from '@core/wallet/stores'

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
    disableAssetSelection?: boolean
}

export type NewTokenTransactionDetails = NewBaseTransactionDetails & {
    type: NewTransactionType.TokenTransfer
    rawAmount: string
    assetId: string
    unit: string
}

export type NewNftTransactionDetails = NewBaseTransactionDetails & {
    type: NewTransactionType.NftTransfer
    nftId: string
}
