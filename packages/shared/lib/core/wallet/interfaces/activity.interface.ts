import { Transaction } from '@iota/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { Recipient } from '../types'
import { ITokenMetadata } from './token-metadata.interface'

export interface IActivity {
    id: string
    type: ActivityType
    time: Date
    direction: ActivityDirection
    inclusionState: InclusionState
    internal: boolean
    rawAmount: number
    recipient: Recipient
    token: ITokenMetadata
    conversion?: number
    isAsync: boolean
    expireDate?: Date
    hidden?: boolean
    isClaimed?: boolean

    setFromTransaction(transactionId: string, transaction: Transaction): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}
