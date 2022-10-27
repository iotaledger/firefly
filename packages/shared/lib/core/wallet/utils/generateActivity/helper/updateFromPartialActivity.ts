import { ActivityType } from '@core/wallet/enums'
import { Activity } from '@core/wallet/types'

export function updateFromPartialActivity(activity: Activity, partialData: Partial<Activity>): void {
    if (partialData.type === ActivityType.Transaction && activity.type === ActivityType.Transaction) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Foundry && activity.type === ActivityType.Foundry) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Alias && activity.type === ActivityType.Alias) {
        Object.assign(activity, partialData)
    } else if (partialData.type === ActivityType.Nft && activity.type === ActivityType.Nft) {
        Object.assign(activity, partialData)
    }
}
