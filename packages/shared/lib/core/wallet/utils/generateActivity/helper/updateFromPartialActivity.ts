import { ActivityType } from '@core/wallet/enums'
import { Activity } from '@core/wallet/types'

export function updateFromPartialActivity(activity: Activity, partialData: Partial<Activity>): void {
    if (partialData.type === ActivityType.Transaction && activity.type === ActivityType.Transaction) {
        activity = { ...activity, ...partialData }
    } else if (partialData.type === ActivityType.Foundry && activity.type === ActivityType.Foundry) {
        activity = { ...activity, ...partialData }
    } else if (partialData.type === ActivityType.Alias && activity.type === ActivityType.Alias) {
        activity = { ...activity, ...partialData }
    } else if (partialData.type === ActivityType.Nft && activity.type === ActivityType.Nft) {
        activity = { ...activity, ...partialData }
    }
}
