export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Devnet = 'devnet',
    Comnet = 'comnet',
}

export interface Node {
    url: string
    auth?: {
        password: string
        username: string
    }
}

export interface ClientOptions {
    nodes?: Node[]
    node?: Node
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

export interface Account {
    id: string
    alias: string
    createdAt: string
    clientOptions: ClientOptions
    index: number
    lastSyncedAt: string
    signerType: {
        type: 'Stronghold'
    }
    storagePath: string
    messages: Message[]
    addresses: Address[]
}

export interface AddressOutput {
    address: string
    amount: number
    index: number
    isSpent: boolean
    messageId: string
    transactionId: number[]
}

export interface Address {
    address: string
    balance: number
    keyIndex: number
    internal: boolean
    outputs: AddressOutput[]
}

type MessageVersion = 1;

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

export type Input = { type: 'UTXO', data: UTXOInput }

export interface SignatureLockedSingleOutput {
    address: string
    amount: number
    remainder: boolean
}

export interface SignatureLockedDustAllowance {
    address: string
    amount: number
    remainder: boolean
}

export type Output = {
    type: 'SignatureLockedSingle',
    data: SignatureLockedSingleOutput
} | {
    type: 'SignatureLockedDustAllowance',
    data: SignatureLockedDustAllowance
}

export interface RegularEssence {
    inputs: Input[];
    outputs: Output[];
    payload?: {
        type: 'Indexation',
        data: any;
    };
    incoming: boolean;
    internal: boolean;
    value: number;
    remainderValue: number;
}

export type Essence = {
    type: 'Regular',
    data: RegularEssence
}

export interface Transaction {
    type: 'Transaction',
    data: {
        essence: Essence;
        unlock_blocks: {
            type: 'Signature';
            data: {
                type: 'Ed25519';
                data: {
                    public_key: number[];
                    signature: number[]
                }
            }
        }[]
    }
}

export type Payload = Transaction;

export interface Message {
    id: string;
    version: MessageVersion;
    parents: string[];
    payloadLength: number;
    payload: Payload;
    timestamp: string;
    nonce: number;
    confirmed?: boolean;
    broadcasted: boolean;
}