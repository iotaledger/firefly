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
    outputs: {
        [key: string]: AddressOutput
    }
}

export type BipPath = string | {
    seed: string
    purpose: number
    coinType: number
    accountIndex: number
    changeIndex: number
    addressIndex: number
}
