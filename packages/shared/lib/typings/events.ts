import { Message, UTXOEventData } from './message'

export type Callback<T> = (error: string, data: T) => void

export interface Event<T> {
    action: string
    id: string
    type: unknown
    payload: T
}

export interface BalanceChangeEventPayload {
    indexationId: string
    messageId: string
    accountIndex: number
    address: string
    balanceChange: {
        spent: number
        received: number
    }
}

export interface TransactionEventPayload {
    accountIndex: number
    message: Message
}

export interface ConfirmationStateChangeEventPayload {
    accountIndex: number
    message: Message
    confirmed: boolean
}

export interface ReattachmentEventPayload {
    indexationId: string
    accountIndex: number
    message: Message
    reattachedMessageId: string
}

export enum TransferProgressEventType {
    // / Syncing account.
    SyncingAccount = 'SyncingAccount',
    // / Performing input selection.
    SelectingInputs = 'SelectingInputs',
    // / Generating address for remainder funds.
    GeneratingRemainderDepositAddress = 'GeneratingRemainderDepositAddress',
    // / Preparing the transaction data.
    PreparedTransaction = 'PreparedTransaction',
    // / Signing the transaction.
    SigningTransaction = 'SigningTransaction',
    // / Performing PoW.
    PerformingPoW = 'PerformingPoW',
    // / Broadcasting.
    Broadcasting = 'Broadcasting',
    // / Complete.
    Complete = 'Complete',
}

export interface TransferProgressEvent {
    // / The transfer progress event type.
    type: TransferProgressEventType
}

export interface GeneratingRemainderDepositAddressEvent extends TransferProgressEvent {
    // / Bech32 representation of remainder address.
    address: string
}

export interface PreparedTransactionEvent extends TransferProgressEvent {
    // / Transaction inputs.
    inputs: UTXOEventData[]
    // / Transaction outputs.
    outputs: UTXOEventData[]
    // / Indexation data.
    data?: string
}

export type TransferProgressEventData =
    | TransferProgressEvent
    | GeneratingRemainderDepositAddressEvent
    | PreparedTransactionEvent

export type TransactionEventData =
    | {
          toAddress?: string
          toAmount?: number
          remainderAddress?: string
          remainderAmount?: number
      }
    | PreparedTransactionEvent

export interface TransferState extends TransferProgressEvent {
    // / Relevant data for this type of transfer progress event.
    data?: TransferProgressEventData
}

export interface TransferProgressEventPayload {
    accountIndex: number
    event: TransferProgressEventData
}

export interface LedgerAddressGenerationEventPayload {
    event: LedgerAddressGenerationEvent
}

export interface LedgerAddressGenerationEvent {
    address: string
}

export interface MiningEvent {
    type: 'MiningBundle'
    data: {
        address: string
    }
}

export interface SigningBundleEvent {
    type: 'SigningBundle'
    data: {
        addresses: string[]
    }
}

export interface BroadcastingBundleEvent {
    type: 'BroadcastingBundle'
    data: {
        bundleHash: string
    }
}
