import { ActivityAsyncStatus } from '@core/wallet/enums'

export function getAsyncStatus(
    isClaimed: boolean,
    expirationDate: Date,
    timelockDate: Date,
    currentTimeStamp: number
): ActivityAsyncStatus {
    if (isClaimed) {
        return ActivityAsyncStatus.Claimed
    } else if (timelockDate) {
        if (timelockDate.getTime() > currentTimeStamp) {
            return ActivityAsyncStatus.Timelocked
        } else {
            return ActivityAsyncStatus.Unclaimed
        }
    } else if (expirationDate && expirationDate.getTime() < currentTimeStamp) {
        return ActivityAsyncStatus.Expired
    } else {
        return ActivityAsyncStatus.Unclaimed
    }
}
