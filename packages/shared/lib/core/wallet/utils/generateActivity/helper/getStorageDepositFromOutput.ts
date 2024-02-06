import { CommonOutput, StorageDepositReturnUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getClient } from '../../../actions/getClient'

export async function getStorageDepositFromOutput(output: CommonOutput): Promise<{
    storageDeposit: number
    giftedStorageDeposit: number
}> {
    const storageDepositReturnUnlockCondition = <StorageDepositReturnUnlockCondition>(
        output?.unlockConditions?.find(
            (unlockCondition) => unlockCondition?.type === UnlockConditionType.StorageDepositReturn
        )
    )
    if (storageDepositReturnUnlockCondition) {
        return { storageDeposit: Number(storageDepositReturnUnlockCondition.amount), giftedStorageDeposit: 0 }
    } else {
        const client = await getClient()
        const minimumRequiredStorageDeposit = await client.computeMinimumOutputAmount(output)
        let minimumRequiredStorageDepositNumber = Number(minimumRequiredStorageDeposit)
        minimumRequiredStorageDepositNumber =
            minimumRequiredStorageDepositNumber > 0 ? minimumRequiredStorageDepositNumber : 0
        return {
            storageDeposit: 0,
            giftedStorageDeposit: minimumRequiredStorageDepositNumber,
        }
    }
}
