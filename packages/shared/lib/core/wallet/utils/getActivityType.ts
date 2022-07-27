import { ActivityType } from '../enums'

export function getActivityType(internal: boolean, isFoundry?: boolean): ActivityType {
    if (isFoundry) {
        return ActivityType.Minting
    }
    if (internal) {
        return ActivityType.InternalTransaction
    } else {
        return ActivityType.ExternalTransaction
    }
}
