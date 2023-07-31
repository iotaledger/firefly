import { IAccountState } from '@core/account'
import { isActivityHiddenForAccountIndex, IClaimData, AsyncData } from '@core/wallet'
import { getExpirationDateFromOutput } from '../../outputs/getExpirationDateFromOutput'
import { getTimelockDateFromOutput } from './getTimelockDateFromOutput'
import { isOutputAsync } from '../../outputs/isOutputAsync'
import { getAsyncStatus } from './getAsyncStatus'
import { getStorageDepositFromOutput } from './getStorageDepositFromOutput'
import { CommonOutput, Output } from '@iota/wallet'

export async function getAsyncDataFromOutput(
    output: Output,
    outputId: string,
    claimingData: IClaimData,
    account: IAccountState
): Promise<AsyncData> {
    const isAsync = isOutputAsync(output)
    if (isAsync) {
        const commonOutput = output as CommonOutput
        const isClaiming = false
        const claimingTransactionId = claimingData?.claimingTransactionId
        const claimedDate = claimingData?.claimedDate
        const isRejected = isActivityHiddenForAccountIndex(account.index, outputId)

        const expirationDate = getExpirationDateFromOutput(commonOutput)
        const timelockDate = getTimelockDateFromOutput(commonOutput)
        const { storageDeposit } = await getStorageDepositFromOutput(account, commonOutput)

        const asyncStatus = getAsyncStatus(
            !!claimingTransactionId,
            expirationDate,
            timelockDate,
            !!storageDeposit,
            Date.now()
        )

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
