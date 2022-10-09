import { ActivityType } from '../enums'

export interface IPartialNftActivityDataWithType extends Omit<Partial<INftActivityData>, 'type'> {
    type: ActivityType.Nft
}

export interface INftActivityData {
    type: ActivityType.Nft
    assetId: string
    outputId: string
    storageDeposit: number
}
