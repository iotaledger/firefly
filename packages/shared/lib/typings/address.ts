export interface AddressOutput {
    address: string
    amount: number
    index: number
    isSpent: boolean
    messageId: string
    transactionId: string
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

export interface ParsedAddress {
    address: string
    message: string
    amount: number | string
}
