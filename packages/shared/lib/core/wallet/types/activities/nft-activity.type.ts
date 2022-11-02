import { ActivityType } from '@core/wallet'
import type { FeatureTypes } from '@iota/types'
import { BaseActivity } from './base-activity.type'

export type NftActivity = BaseActivity & {
    type: ActivityType.Nft
    nftId: string
    metadata: string
    tag: string
    immutableFeatures: FeatureTypes[]
}
