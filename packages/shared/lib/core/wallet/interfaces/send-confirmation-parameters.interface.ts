import { IAsset, Subject } from '@core/wallet'

export interface ISendConfirmationParameters {
    asset?: IAsset
    amount?: string | undefined
    unit?: string
    recipient?: Subject
    metadata?: string
    tag?: string
    giftStorageDeposit?: boolean
    disableToggleGift?: boolean
    disableChangeExpiration?: boolean
}
