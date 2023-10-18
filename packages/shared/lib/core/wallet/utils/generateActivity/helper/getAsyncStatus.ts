import { ActivityAsyncStatus } from '@core/wallet/enums'

export function getAsyncStatus(
    isClaimed: boolean,
    expirationDate: Date | undefined,
    timelockDate: Date | undefined,
    hasStorageDeposit: boolean,
    currentTimeStamp: number
): ActivityAsyncStatus {
    if (isClaimed) {
        return ActivityAsyncStatus.Claimed
    } else if (timelockDate && timelockDate.getTime() > currentTimeStamp) {
        return ActivityAsyncStatus.Timelocked
    } else if (expirationDate && expirationDate.getTime() < currentTimeStamp) {
        return ActivityAsyncStatus.Expired
    } else if (hasStorageDeposit || expirationDate) {
        return ActivityAsyncStatus.Unclaimed
    } else if (timelockDate) {
        return ActivityAsyncStatus.Claimed
    } else {
        return ActivityAsyncStatus.Unclaimed
    }
}
