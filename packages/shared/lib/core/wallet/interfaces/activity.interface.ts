import { ITokenMetadata } from './token-metadata.interface'

export enum ActivityType {
    Stake = 'stake',
    Transfer = 'transfer',
    Receive = 'receive',
    Send = 'send',
    Migrate = 'migrate',
}

export enum ActivityStatus {
    InProgress = 'inProgress',
    Pending = 'pending',
    Confirmed = 'confirmed',
    Conflict = 'conflict',
    Failed = 'failed',
}

export enum ActivityAsyncStatus {
    Unclaimed = 'unclaimed',
    Claimed = 'claimed',
    Expired = 'expired',
}

export enum ActivityDirection {
    In = 'in',
    Out = 'out',
}

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
    fiatAmount?: number
}
