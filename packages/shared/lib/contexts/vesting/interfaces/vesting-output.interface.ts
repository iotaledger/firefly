import { VestingOutputStatus } from '../enums'

export interface IVestingOutput {
    outputId: string
    status: VestingOutputStatus
    unlockTime: Date
    amount: number
    isSpent: boolean
}
