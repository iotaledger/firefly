import { getExpirationUnixTimeFromOutput, getRecipientAddressFromOutput, isOutputAsync } from '@core/wallet/utils'
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
        const hasStorageDepositReturnUnlockCondition = nftOutput.unlockConditions.some(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
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
