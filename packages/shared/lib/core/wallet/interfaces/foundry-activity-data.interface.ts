import { ActivityType } from '../enums'

export interface IPartialFoundryActivityDataWithType extends Omit<Partial<IFoundryActivityData>, 'type'> {
    type: ActivityType.Foundry
}

export interface IFoundryActivityData {
    type: ActivityType.Foundry
    assetId: string
    storageDeposit: number
    giftedStorageDeposit: number
    rawAmount: number
}
