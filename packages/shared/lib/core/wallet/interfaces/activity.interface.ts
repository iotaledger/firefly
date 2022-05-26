import { ActivityType, ActivityDirection } from '../enums'
import { ITokenMetadata } from './token-metadata.interface'

export interface IActivity {
    id: string
    type: string
    timestamp: string
    activityType: ActivityType
    direction: ActivityDirection
    confirmed: boolean
    internal: boolean
    amount: string
    subjectAccountName: string
    subjectAddress: string
    token: ITokenMetadata
    conversion?: number
    isAsync: boolean
    expireDate?: Date
    hidden?: boolean
    isClaimed?: boolean
    fiatAmount?: string
}
