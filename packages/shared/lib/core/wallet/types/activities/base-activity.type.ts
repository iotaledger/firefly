import { ActivityAsyncStatus, ActivityDirection, InclusionState } from '../../enums'
import { IUTXOInput } from '@iota/types'
import { Subject } from '../subject.type'

export type BaseActivity = {
    id: string
    outputId: string
    transactionId: string
    time: Date
    inclusionState: InclusionState
    inputs: IUTXOInput[]
    isHidden?: boolean
    containsValue: boolean
    isAssetHidden: boolean
    direction: ActivityDirection
    isInternal: boolean
    storageDeposit: number
    giftedStorageDeposit: number
    subject: Subject
    metadata?: string
    tag?: string
    isSelfTransaction: boolean
    asyncData: AsyncData
}

export type AsyncData = {
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    isClaimed: boolean
    claimingTransactionId: string
    claimedDate: Date
}
