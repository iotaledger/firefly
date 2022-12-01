import { ActivityAsyncStatus, ActivityDirection, InclusionState, ActivityAction } from '../../enums'
import { IUTXOInput } from '@iota/types'
import { Subject } from '../subject.type'
import { ILayer2Parameters, Layer2Metadata } from '@core/layer-2'

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
    action: ActivityAction
    isInternal: boolean
    storageDeposit: number
    giftedStorageDeposit: number
    subject: Subject
    metadata?: string
    tag?: string
    asyncData: AsyncData
    destinationNetwork?: string
    parsedLayer2Metadata?: Layer2Metadata
    layer2Parameters?: ILayer2Parameters
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
