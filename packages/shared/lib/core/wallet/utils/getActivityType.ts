import { ActivityType } from '../enums'
import { OutputTypes } from '@iota/types'
import { OUTPUT_TYPE_FOUNDRY } from '../constants'

export function getActivityType(outputs: OutputTypes[]): ActivityType {
    if (outputs.some((output) => output.type === OUTPUT_TYPE_FOUNDRY)) {
        return ActivityType.Foundry
    } else {
        return ActivityType.Transaction
    }
}
