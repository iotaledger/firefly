import type { Unit } from '@iota/unit-converter'

export interface SendParams {
    amount: number
    unit?: Unit
    address: string
    message: string
    isInternal: boolean
}
