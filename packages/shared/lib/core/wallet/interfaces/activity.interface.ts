import { AccountMessage } from '@lib/typings/wallet'
import { ActivityAsyncStatus, ActivityDirection, ActivityType } from '../enums'
import { Recipient } from '../types'
import { ITokenMetadata } from './token-metadata.interface'

export interface IActivity {
    id: string
    type: string
    time: Date
    activityType: ActivityType
    direction: ActivityDirection
    confirmed: boolean
    internal: boolean
    rawAmount: number
    recipient: Recipient
    token: ITokenMetadata
    conversion?: number
    isAsync: boolean
    expireDate?: Date
    hidden?: boolean
    isClaimed?: boolean

    setFromAccountMessage(message: AccountMessage): void
    getAsyncStatus(time: Date): ActivityAsyncStatus
    getFormattedAmount(signum: boolean): string
    getFiatAmount(fiatPrice: number, exchangeRate: number): string
}
