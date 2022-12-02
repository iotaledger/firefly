import {
    getExpirationUnixTimeFromOutput,
    getRecipientAddressFromOutput,
    isOutputAsync,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '@core/wallet'
import { INftOutput } from '@iota/types'

export function getIsSpendableFromUnspentNftOutput(accountAddress: string, nftOutput: INftOutput): boolean {
    const isAsync = isOutputAsync(nftOutput)
    if (isAsync) {
        const expirationUnixTime = getExpirationUnixTimeFromOutput(nftOutput)
        const isRecipient = getRecipientAddressFromOutput(nftOutput) === accountAddress
        const hasStorageDepositReturnUnlockCondition = nftOutput.unlockConditions.some(
            (unlockCondition) => unlockCondition?.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN
        )
        if (expirationUnixTime) {
            if (isRecipient) {
                return false
            } else {
                return expirationUnixTime < Date.now()
            }
        } else if (hasStorageDepositReturnUnlockCondition) {
            return false
        }
    } else {
        return true
    }
}
