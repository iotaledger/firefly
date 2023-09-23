import { VestingOutputStatus } from '../enums'
import { IRewardsPerAddresses } from './vesting-overview.interface'

export interface IVestingPayout {
    amounts: IRewardsPerAddresses[]
    totalAmount: number
    unlockTime: Date
    status: VestingOutputStatus
}
