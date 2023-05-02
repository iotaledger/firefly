import type { ILayer2Parameters } from '@core/layer-2'
import type { Subject } from '@core/wallet'
import { NewTransactionType } from '@core/wallet/stores'

export type NewTransactionDetails = NewNftTransactionDetails | NewTokenTransactionDetails

type NewBaseTransactionDetails = {
    recipient?: Subject
    tag?: string
    metadata?: string
    expirationDate?: Date
    surplus?: string
    giftStorageDeposit?: boolean
    layer2Parameters?: ILayer2Parameters
    addSenderFeature?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
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
