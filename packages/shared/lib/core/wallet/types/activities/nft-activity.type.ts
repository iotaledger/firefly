import { ActivityType } from '@core/wallet'
import { BaseActivity } from './base-activity.type'

export type NftActivity = BaseActivity & {
    type: ActivityType.Nft
    nftId: string
}
