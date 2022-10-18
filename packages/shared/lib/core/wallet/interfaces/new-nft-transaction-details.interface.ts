import { Subject } from '@core/wallet'
import type { FeatureTypes } from '@iota/types'

export interface INewNftTransactionDetails {
    expirationDate: Date
    recipient: Subject
    immutableFeatures: FeatureTypes[]
    nftId: string
}
