import { IAsset, Subject } from '@core/wallet'

export interface INewTransactionDetails {
    rawAmount?: string
    asset?: IAsset
    expirationDate?: Date
    metadata?: string
    recipient?: Subject
    tag?: string
    unit?: string
    giftStorageDeposit?: boolean
    surplus?: string
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
}
