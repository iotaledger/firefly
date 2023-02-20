import {
    getExpirationUnixTimeFromOutput,
    getRecipientAddressFromOutput,
    isOutputAsync,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '@core/wallet'
import { getTimelockDateFromOutput } from '@core/wallet/utils/generateActivity/helper'
import { INftOutput } from '@iota/types'

export function getSpendableStatusFromUnspentNftOutput(
    accountAddress: string,
    nftOutput: INftOutput
): { isSpendable: boolean; isLocked: boolean } {
    let isSpendable = true
    let isLocked = false

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

        if (timeLockUnixTime) {
            if (isRecipient && timeLockUnixTime > Date.now()) {
                isLocked = true
            } else {
                isLocked = false
            }
        }
    }
    return { isSpendable, isLocked }
}
