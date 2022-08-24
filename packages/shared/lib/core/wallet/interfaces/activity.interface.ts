import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { Subject } from '../types'
import { IUTXOInput } from '@iota/types'

export interface IActivity {
    id: string
    outputId?: string
    transactionId?: string
    type: ActivityType
    time: Date
    inclusionState: InclusionState
    inputs: IUTXOInput[]
    isHidden?: boolean
    isAssetHidden: boolean

    data: ITransactionActivityData | IFoundryActivityData

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}

export interface IPartialActivityWithType extends Omit<Partial<IActivity>, 'data'> {
    data: IPartialTransactionActivityDataWithType | IPartialFoundryActivityDataWithType
}

export interface ITransactionActivityData {
    type: 'transaction'
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
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    isClaimed: boolean
    publicNote: string
    outputId: string
    claimingTransactionId: string
    claimedDate: Date
    metadata: string
    tag: string
    assetId: string
}

export interface IPartialTransactionActivityDataWithType extends Omit<Partial<ITransactionActivityData>, 'type'> {
    type: 'transaction'
}

export interface IFoundryActivityData {
    type: 'foundry'
    assetId: string
    storageDeposit: number
    giftedStorageDeposit: number
    rawAmount: number
}

export interface IPartialFoundryActivityDataWithType extends Omit<Partial<IFoundryActivityData>, 'type'> {
    type: 'foundry'
}
