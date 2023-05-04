import { UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN } from '@core/wallet/constants'
import { getExpirationUnixTimeFromOutput, getRecipientAddressFromOutput, isOutputAsync } from '@core/wallet/utils'
import { getTimelockDateFromOutput } from '@core/wallet/utils/generateActivity/helper'
import { INftOutput } from '@iota/types'

export function getSpendableStatusFromUnspentNftOutput(
    accountAddress: string,
    nftOutput: INftOutput
): { isSpendable: boolean; timeLockTime: string } {
    let isSpendable = true
    let timeLockTime = undefined

    const isAsync = isOutputAsync(nftOutput)
    if (isAsync) {
        const expirationUnixTime = getExpirationUnixTimeFromOutput(nftOutput)
        const timeLockUnixTime = getTimelockDateFromOutput(nftOutput)?.getTime()
        const isRecipient = getRecipientAddressFromOutput(nftOutput) === accountAddress
        const hasStorageDepositReturnUnlockCondition = nftOutput.unlockConditions.some(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
        if (expirationUnixTime) {
            if (isRecipient) {
                isSpendable = false
            } else {
                isSpendable = expirationUnixTime < Date.now()
            }
        } else if (hasStorageDepositReturnUnlockCondition) {
            isSpendable = false
        }

        if (isRecipient && timeLockUnixTime) {
            timeLockTime = timeLockUnixTime
        }
    }
    return { isSpendable, timeLockTime }
}
