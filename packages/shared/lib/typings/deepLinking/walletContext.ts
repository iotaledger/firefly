import { Unit } from '@iota/unit-converter'

export enum WalletOperations {
    Send = 'send',
}

export enum SendRequestParameters {
    Amount = 'amount',
    Unit = 'unit',
}

export interface SendOperationParameters {
    address: string
    amount: number
    unit: Unit
    message: string
}
