import { ActivityBase } from "../../..";

// TODO: Move into BaseActivity or individual classes
export function updateActivityFromPartialActivity(activity: ActivityBase, partialData: Partial<ActivityBase>): void {
    // if (partialData.type === ActivityType.Transaction && activity.type === ActivityType.Transaction) {
    //     Object.assign(activity, partialData)
    // } else if (partialData.type === ActivityType.Foundry && activity.type === ActivityType.Foundry) {
    //     Object.assign(activity, partialData)
    // } else if (partialData.type === ActivityType.Account && activity.type === ActivityType.Account) {
    //     Object.assign(activity, partialData)
    // } else if (partialData.type === ActivityType.Nft && activity.type === ActivityType.Nft) {
    //     Object.assign(activity, partialData)
    // }
}
