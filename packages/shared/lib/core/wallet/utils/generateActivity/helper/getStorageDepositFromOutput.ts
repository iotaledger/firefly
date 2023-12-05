import { CommonOutput, StorageDepositReturnUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getClient } from '../../../actions/getClient'
import { IWalletState } from '../../../interfaces'

export async function getStorageDepositFromOutput(
    wallet: IWalletState,
    output: CommonOutput
): Promise<{
    storageDeposit: number
    giftedStorageDeposit: number
}> {
    // TODO(2.0) Account indexes are gone
    /*
    if (!(account?.index >= 0)) {
        return { storageDeposit: 0, giftedStorageDeposit: 0 }
    }
    */
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
