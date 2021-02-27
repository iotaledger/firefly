import type { Bridge, CommunicationIds } from './bridge'
import type { AccountIdentifier } from './account'

type MessageVersion = 1

export interface UTXOInput {
    type: 'UTXO'
    data: string
}

export type Input = UTXOInput

export interface SignatureLockedSingle {
    type: 'SignatureLockedSingle'
    data: {
        address: string
        amount: number
        remainder: boolean
    }
}

export interface SignatureLockedDustAllowance {
    type: 'SignatureLockedDustAllowance'
    data: {
        address: string
        amount: number
        remainder: boolean
    }
}

export type Output = SignatureLockedSingle | SignatureLockedDustAllowance

export interface TransactionEssence {
    inputs: Input[]
    outputs: Output[]
    // TODO: Add proper type for essence payload
    payload?: any
}

export interface MessagePayload {
    type: 'Transaction'
    data: {
        essence: {
            data: TransactionEssence
        }
        unlock_blocks: {
            type: 'Signature'
            data: {
                type: 'Ed25519'
                data: {
                    public_key: number[]
                    signature: number[]
                }
            }
        }
    }
}

export interface Message {
    broadcasted: boolean
    id: string
    incoming: boolean
    nonce: number
    parents: string[]
    remainderValue: number
    timestamp: string
    value: number
    version: MessageVersion
    payload: MessagePayload
}

export enum MessageType {
    /// Message received.
    Received,
    /// Message sent.
    Sent,
    /// Message not broadcasted.
    Failed,
    /// Message not confirmed.
    Unconfirmed,
    /// A value message.
    Value,
}

export interface ListMessageFilter {
    messageType?: MessageType
}

export interface Transfer {
    amount: number
    address: string
}

export function reattach(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier, messageId: string) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'Reattach',
        payload: {
            accountId,
            messageId,
        },
    })
}
