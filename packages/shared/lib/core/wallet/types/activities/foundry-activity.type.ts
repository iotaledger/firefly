import { ActivityType } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type FoundryActivity = BaseActivity & {
    type: ActivityType.Foundry
    rawAmount: number
    assetId: string
    accountAddress: string
    mintedTokens: string
    meltedTokens: string
    maximumSupply: string
}
