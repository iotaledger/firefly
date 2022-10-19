import { IAccountState } from '@core/account'
import { isActivityHiddenForAccountIndex, ActivityAsyncStatus, IClaimData } from '@core/wallet'
import type { OutputTypes } from '@iota/types'
import { getExpirationDateFromOutput } from '../../outputs/getExpirationDateFromOutput'
import { getTimelockDateFromOutput } from './getTimelockDateFromOutput'
import { isOutputAsync } from '../../outputs/isOutputAsync'

export function getAsyncDataFromOutput(
    output: OutputTypes,
    transactionId: string,
    claimingData: IClaimData,
    account: IAccountState
): {
    isAsync: boolean
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    isClaimed: boolean
    claimingTransactionId: string
    claimedDate: Date
} {
    const isAsync = isOutputAsync(output)
    const asyncStatus = isAsync ? ActivityAsyncStatus.Unclaimed : null
    const isClaimed = !!claimingData
    const isClaiming = false
    const claimingTransactionId = claimingData?.claimingTransactionId
    const claimedDate = claimingData?.claimedDate
    const isRejected = isActivityHiddenForAccountIndex(account.index, transactionId)

    const expirationDate = getExpirationDateFromOutput(output)
    const timelockDate = getTimelockDateFromOutput(output)

    return {
        isAsync,
        asyncStatus,
        timelockDate,
        expirationDate,
        isRejected,
        isClaiming,
        isClaimed,
        claimingTransactionId,
        claimedDate,
    }
}
