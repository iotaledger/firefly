import { ActivityType, AliasType } from '../enums'

export interface IPartialAliasActivityDataWithType extends Omit<Partial<IAliasActivityData>, 'type'> {
    type: ActivityType.Alias
}

export interface IAliasActivityData {
    type: ActivityType.Alias
    outputId: string
    assetId: string
    storageDeposit: number
    aliasId: string
    aliasType: AliasType
    governorAddress: string
    stateControllerAddress: string
}
