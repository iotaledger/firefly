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
