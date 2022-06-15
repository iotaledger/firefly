import { ActivityType } from '../enums'

export function getActivityType(internal: boolean): ActivityType {
    if (internal) {
        return ActivityType.InternalTransaction
    } else {
        return ActivityType.ExternalTransaction
    }
}
