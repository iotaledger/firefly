import { ActivityAsyncStatus } from '@core/wallet/enums'

export function getAsyncStatus(
    isClaimed: boolean,
    expirationDate: Date,
    timelockDate: Date,
    hasStorageDeposit: boolean,
    currentTimeStamp: number
): ActivityAsyncStatus {
    if (isClaimed) {
        return ActivityAsyncStatus.Claimed
    } else if (timelockDate && timelockDate.getTime() > currentTimeStamp) {
        return ActivityAsyncStatus.Timelocked
    } else if (expirationDate && expirationDate.getTime() < currentTimeStamp) {
        return ActivityAsyncStatus.Expired
    } else if (hasStorageDeposit) {
        return ActivityAsyncStatus.Unclaimed
    } else if (timelockDate) {
        return ActivityAsyncStatus.Claimed
    } else {
        return ActivityAsyncStatus.Unclaimed
    }
}
