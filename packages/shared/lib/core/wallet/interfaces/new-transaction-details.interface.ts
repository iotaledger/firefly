import { IAsset, Subject } from '@core/wallet'

export interface INewTransactionDetails {
    amount?: string
    asset?: IAsset
    expirationDate?: Date
    // TODO: do we need this?
    internal?: boolean
    metadata?: string
    recipient?: Subject
    tag?: string
    unit?: string
}
