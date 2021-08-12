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

export interface Bip32 {
    /**
     * NOTE: purpose and coinType will always be the same
     * as they pertain to the IOTA token (hence their optionality).
     *
     * Base 10: m/44'/4218'/...
     * Hex:     m/2c'/107a'/...
     */

    purpose?: number | string
    coinType?: number | string

    accountIndex: number | string
    changeIndex: number | string
    addressIndex: number | string
}

export type Bip32Path = string
