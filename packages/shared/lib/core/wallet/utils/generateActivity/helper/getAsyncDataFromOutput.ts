import { IAccountState } from '@core/account'
import { isActivityHiddenForAccountIndex, ActivityAsyncStatus, IClaimData, Output, AsyncData } from '@core/wallet'
import { getExpirationDateFromOutput } from '../../outputs/getExpirationDateFromOutput'
import { getTimelockDateFromOutput } from './getTimelockDateFromOutput'
import { isOutputAsync } from '../../outputs/isOutputAsync'

export function getAsyncDataFromOutput(
    output: Output,
    outputId: string,
    claimingData: IClaimData,
    account: IAccountState
): AsyncData {
    const isAsync = isOutputAsync(output)
    if (isAsync) {
        const isClaiming = false
        const claimingTransactionId = claimingData?.claimingTransactionId
        const claimedDate = claimingData?.claimedDate
        const isRejected = isActivityHiddenForAccountIndex(account.index, outputId)

        const expirationDate = getExpirationDateFromOutput(output)
        const timelockDate = getTimelockDateFromOutput(output)

        let asyncStatus
        if (claimingData) {
            asyncStatus = ActivityAsyncStatus.Claimed
        } else if (timelockDate) {
            if (timelockDate.getTime() > Date.now()) {
                asyncStatus = ActivityAsyncStatus.Timelocked
            }
        } else if (expirationDate && expirationDate.getTime() < Date.now()) {
            asyncStatus = ActivityAsyncStatus.Expired
        } else {
            asyncStatus = ActivityAsyncStatus.Unclaimed
        }

        return {
            asyncStatus,
            timelockDate,
            expirationDate,
            isRejected,
            isClaiming,
            claimingTransactionId,
            claimedDate,
        }
    } else {
        return null
    }
}
