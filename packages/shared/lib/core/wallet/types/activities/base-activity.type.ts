import { ActivityAsyncStatus, ActivityDirection, InclusionState, ActivityAction } from '../../enums'
import { Subject } from '../subject.type'
import { Layer2Metadata } from '@core/layer-2'

export type BaseActivity = {
    id: string
    outputId: string
    transactionId: string
    time: Date
    inclusionState: InclusionState
    isHidden?: boolean
    containsValue: boolean
    isAssetHidden: boolean
    direction: ActivityDirection
    action: ActivityAction
    isInternal: boolean
    storageDeposit: number
    giftedStorageDeposit: number
    surplus?: number
    subject: Subject | undefined
    metadata?: string
    tag?: string
    asyncData: AsyncData
    destinationNetwork?: string
    parsedLayer2Metadata?: Partial<Layer2Metadata>
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
