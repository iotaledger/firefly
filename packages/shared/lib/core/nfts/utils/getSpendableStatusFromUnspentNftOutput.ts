import {
    getExpirationUnixTimeFromOutput,
    getRecipientAddressFromOutput,
    getRecipientReturnAddressFromOutput,
    isOutputAsync,
    isOutputExpired,
} from '@core/wallet/utils'
import { getTimelockDateFromOutput } from '@core/wallet/utils/generateActivity/helper'
import { NftOutput, UnlockConditionType } from '@iota/sdk/out/types'

export function getSpendableStatusFromUnspentNftOutput(
    accountAddress: string,
    nftOutput: NftOutput
): { isSpendable: boolean; timeLockTime: number | undefined } {
    let isSpendable = true
    let timeLockTime = undefined

    const isAsync = isOutputAsync(nftOutput)
    if (isAsync) {
        const expirationUnixTime = getExpirationUnixTimeFromOutput(nftOutput)
        const timeLockUnixTime = getTimelockDateFromOutput(nftOutput)?.getTime()
        const isRecipient = getRecipientAddressFromOutput(nftOutput) === accountAddress
        const isReturnRecipient = getRecipientReturnAddressFromOutput(nftOutput) === accountAddress
        const hasStorageDepositReturnUnlockCondition = nftOutput.unlockConditions.some(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
        )
        if (expirationUnixTime) {
            const isExpirationTimeExpired = isOutputExpired(nftOutput)
            if (typeof isExpirationTimeExpired === 'undefined') {
                // The expiration is in the deadzone where it can't be unlocked
                isSpendable = false
            } else if (isExpirationTimeExpired) {
                if (isReturnRecipient) {
                    isSpendable = true
                } else {
                    isSpendable = false
                }
            } else {
                isSpendable = false
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
