import type { ILayer2Parameters } from '@core/layer-2'
import type { IAsset, Subject, TokenMetadata } from '@core/wallet'
import { NewTransactionType } from '@core/wallet/stores'

export type NewTransactionDetails = NewNftTransactionDetails | NewTokenTransactionDetails

type NewBaseTransactionDetails = {
    recipient?: Subject
    tag?: string
    metadata?: string
    expirationDate?: Date
    timelockDate?: Date
    surplus?: string
    giftStorageDeposit?: boolean
    layer2Parameters?: ILayer2Parameters
    addSenderFeature?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
    disableAssetSelection?: boolean
    tokenMetadata?: TokenMetadata
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
