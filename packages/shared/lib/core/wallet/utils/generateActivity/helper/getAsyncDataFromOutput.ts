import { IAccountState } from '@core/account'
import { isActivityHiddenForAccountIndex, ActivityAsyncStatus, IClaimData, Output, AsyncData } from '@core/wallet'
import { getExpirationDateFromOutput } from '../../outputs/getExpirationDateFromOutput'
import { getTimelockDateFromOutput } from './getTimelockDateFromOutput'
import { isOutputAsync } from '../../outputs/isOutputAsync'

export function getAsyncDataFromOutput(
    output: Output,
    transactionId: string,
    claimingData: IClaimData,
    account: IAccountState
): AsyncData {
    const isAsync = isOutputAsync(output)
    if (isAsync) {
        const asyncStatus = claimingData ? ActivityAsyncStatus.Claimed : ActivityAsyncStatus.Unclaimed
        const isClaiming = false
        const claimingTransactionId = claimingData?.claimingTransactionId
        const claimedDate = claimingData?.claimedDate
        const isRejected = isActivityHiddenForAccountIndex(account.index, transactionId)

        const expirationDate = getExpirationDateFromOutput(output)
        const timelockDate = getTimelockDateFromOutput(output)

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
