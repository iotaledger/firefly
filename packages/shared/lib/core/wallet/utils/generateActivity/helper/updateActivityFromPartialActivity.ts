import { ActivityType } from '@core/wallet/enums'
import { Activity } from '@core/wallet/types'

export function updateActivityFromPartialActivity(activity: Activity, partialData: Partial<Activity>): void {
    if (partialData.type === ActivityType.Basic && activity.type === ActivityType.Basic) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Foundry && activity.type === ActivityType.Foundry) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Account && activity.type === ActivityType.Account) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Nft && activity.type === ActivityType.Nft) {
        Object.assign(activity, partialData)
    }
}
