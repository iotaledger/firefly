import { ActivityAsyncStatus, ActivityType, ActivityDirection } from '../enums'
import { Subject } from '../types'

export interface ITransactionActivityData {
    type: ActivityType.Transaction
    direction: ActivityDirection
    isInternal: boolean
    storageDeposit: number
    giftedStorageDeposit: number
    rawAmount: number
    sender: Subject
    recipient: Subject
    subject: Subject
    isSelfTransaction: boolean
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    isClaimed: boolean
    isShimmerClaiming: boolean
    publicNote: string
    outputId: string
    claimingTransactionId: string
    claimedDate: Date
    metadata: string
    tag: string
    assetId: string
}

export interface IPartialTransactionActivityDataWithType extends Omit<Partial<ITransactionActivityData>, 'type'> {
    type: ActivityType.Transaction
}
