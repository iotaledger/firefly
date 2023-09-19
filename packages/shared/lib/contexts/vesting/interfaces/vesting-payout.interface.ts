import { VestingOutputStatus } from '../enums'

export interface IVestingPayout {
    amounts: { address: string; amount: number }[]
    totalAmount: number
    unlockTime: Date
    status: VestingOutputStatus
}
