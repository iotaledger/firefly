import { VestingOutputStatus } from '../enums'

export interface IVestingPayout {
    amount: number
    unlockTime: Date
    status: VestingOutputStatus
}
