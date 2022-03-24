import type { Unit } from '@iota/unit-converter'

export type SendOperationParameters = {
    address: string
    amount: number
    unit: Unit
    message: string
}
