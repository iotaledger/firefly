import { FeatureTypes } from '@iota/types'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '../enums'
import { Subject } from '../types'

export interface IPartialNftActivityDataWithType extends Omit<Partial<INftActivityData>, 'type'> {
    type: ActivityType.Nft
}

export interface INftActivityData {
    type: ActivityType.Nft
    outputId: string
    nftId: string
    nftMetadata: string
    immutableFeatures: FeatureTypes[]
    storageDeposit: number
    tag: string
    metadata: string
    direction: ActivityDirection
    isInternal: boolean
    sender: Subject
    recipient: Subject
    subject: Subject
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    isClaimed: boolean
    claimingTransactionId: string
    claimedDate: Date
}
