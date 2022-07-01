import { IAccountState } from '@core/account'
import { IUTXOInput } from '@iota/types'
import { Transaction } from '@iota/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { Subject } from '../types'
import { ITokenMetadata } from './token-metadata.interface'

export interface IActivity {
    id: string
    outputId?: string
    transactionId?: string
    type: ActivityType
    time: Date
    inputs?: IUTXOInput[]
    direction: ActivityDirection
    inclusionState: InclusionState
    isInternal: boolean
    rawAmount: number
    sender: Subject
    recipient: Subject
    token: ITokenMetadata
    isAsync: boolean
    expirationDate?: Date
    isHidden?: boolean
    isClaiming?: boolean
    isClaimed?: boolean
    publicNote?: string
    claimingTransactionId?: string
    claimedDate?: Date

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void
    setFromTransaction(transactionId: string, transaction: Transaction, account: IAccountState): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}
