import { ActivityAsyncStatus, ActivityDirection, InclusionState } from '../../enums'
import { IUTXOInput } from '@iota/types'
import { Subject } from '../subject.type'
import { Layer2Metadata } from '@core/layer-2'

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
    destinationNetwork?: string
    parsedLayer2Metadata?: Layer2Metadata
}

export type AsyncData = {
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    claimingTransactionId: string
    claimedDate: Date
}
