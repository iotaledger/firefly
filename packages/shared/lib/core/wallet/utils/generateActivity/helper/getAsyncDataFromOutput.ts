import { isActivityHiddenForWalletId, IClaimData, AsyncData, IWalletState } from '@core/wallet'
import { getExpirationDateFromOutput } from '../../outputs/getExpirationDateFromOutput'
import { getTimelockDateFromOutput } from './getTimelockDateFromOutput'
import { isOutputAsync } from '../../outputs/isOutputAsync'
import { getAsyncStatus } from './getAsyncStatus'
import { getStorageDepositFromOutput } from './getStorageDepositFromOutput'
import { CommonOutput, Output } from '@iota/sdk/out/types'

export async function getAsyncDataFromOutput(
    output: Output,
    outputId: string,
    claimingData: IClaimData,
    wallet: IWalletState
): Promise<AsyncData> {
    const isAsync = isOutputAsync(output)
    if (isAsync) {
        const commonOutput = output as CommonOutput
        const isClaiming = false
        const claimingTransactionId = claimingData?.claimingTransactionId
        const claimedDate = claimingData?.claimedDate
        const isIgnored = isActivityHiddenForWalletId(wallet.id, outputId)

        const expirationDate = getExpirationDateFromOutput(commonOutput)
        const timelockDate = getTimelockDateFromOutput(commonOutput)
        const { storageDeposit } = await getStorageDepositFromOutput(commonOutput)

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
            isIgnored,
            isClaiming,
            claimingTransactionId,
            claimedDate,
        }
    } else {
        return null
    }
}
