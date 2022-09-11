type MessageVersion = 1

export enum MessageType {
    // / Message received.
    Received = 1,
    // / Message sent.
    Sent = 2,
    // / Message not broadcasted.
    Failed = 3,
    // / Message not confirmed.
    Unconfirmed = 4,
    // / A value message.
    Value = 5,
}

export interface RegularEssence {
    inputs: Input[]
    outputs: Output[]
    payload?: {
        type: 'Indexation'
        data: {
            data: number[]
            index: number[]
        }
    }
    incoming: boolean
    internal: boolean
    value: number
    remainderValue: number
}

export type Essence = {
    type: 'Regular'
    data: RegularEssence
}

export type Input = { type: 'UTXO'; data: UTXOInput }

/**
 * Describes an input which references an unspent
 * transaction output to consume.
 */
export interface UTXOInput {
    input: string
    metadata?: {
        transactionId: string
        messageId: string
        index: number
        amount: number
        isSpent: boolean
        address: string
        kind: 'SignatureLockedSingle'
    }
}

/**
 * UTXO data as it is used in the events-handlers of
 * transferring funds between addresses.
 */
export interface UTXOEventData {
    address: string
    amount: number
    remainder?: boolean
}

/**
 * A deposit to a single address, which is unlocked
 * via a signature.
 */
export interface SignatureLockedSingleOutput {
    address: string
    amount: number
    remainder: boolean
}

/**
 * A deposit that alters the dust allowance of the
 * target address via a special property.
 */
export interface SignatureLockedDustAllowance {
    address: string
    amount: number
    remainder: boolean
}

export type Output =
    | {
          type: 'SignatureLockedSingle'
          data: SignatureLockedSingleOutput
      }
    | {
          type: 'SignatureLockedDustAllowance'
          data: SignatureLockedDustAllowance
      }

export interface Transaction {
    type: 'Transaction'
    data: {
        essence: Essence
        unlock_blocks: {
            type: 'Signature'
            data: {
                type: 'Ed25519'
                data: {
                    public_key: number[]
                    signature: number[]
                }
            }
        }[]
    }
}

interface ReceiptFunds {
    output: {
        address: string
        amount: number
        remainder: boolean
    }
    tailTransactionHash: string
}

interface Receipt {
    type: 'Receipt'
    data: {
        last: boolean
        migratedAt: number
        funds: ReceiptFunds[]
        transaction: {
            data: {
                input: {
                    data: string
                    type: 'Treasury'
                }
                output: {
                    data: {
                        amount: number
                    }
                }
            }
            type: 'TreasuryTransaction'
        }
    }
}

interface MilestoneEssence {
    index: number
    merkleProof: number[]
    nextPowScore: number
    nextPowScoreMilestoneIndex: number
    parents: string[]
    publicKeys: number[]
    receipt: Receipt
    timestamp: number
    value: number
}

export interface Milestone {
    type: 'Milestone'
    data: {
        essence: MilestoneEssence
        signatures: number[]
    }
}

export type Payload = Transaction | Milestone

export interface Message {
    id: string
    version: MessageVersion
    parents: string[]
    payloadLength: number
    payload?: Payload
    timestamp: string
    nonce: number
    confirmed?: boolean
    broadcasted: boolean
}

export interface ListMessageFilter {
    messageType?: MessageType
}

export interface Transfer {
    amount: number
    address: string
}
