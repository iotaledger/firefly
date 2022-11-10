import { ActivityType } from '../enums'
import { OUTPUT_TYPE_ALIAS, OUTPUT_TYPE_FOUNDRY, OUTPUT_TYPE_NFT } from '../constants'
import { IWrappedOutput } from '../interfaces'

export function getActivityType(outputs: IWrappedOutput[]): ActivityType {
    if (outputs.some((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)) {
        return ActivityType.Foundry
    }
    if (outputs.some((output) => output.output.type === OUTPUT_TYPE_NFT)) {
        return ActivityType.Nft
    }
    if (outputs.some((output) => output.output.type === OUTPUT_TYPE_ALIAS)) {
        return ActivityType.Alias
    } else {
        return ActivityType.Transaction
    }
}
