import { IAsset, Subject } from '@core/wallet'

export interface ISendFormParameters {
    asset?: IAsset
    amount?: string | undefined
    unit?: string
    recipient?: Subject
    metadata?: string
    tag?: string
    giftStorageDeposit?: boolean
}
