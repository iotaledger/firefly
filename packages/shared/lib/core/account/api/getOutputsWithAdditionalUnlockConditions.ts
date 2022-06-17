import { OutputsToCollect } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function getOutputsWithAdditionalUnlockConditions(
    outputs: OutputsToCollect,
    id?: string
): Promise<string[]> {
    return (await getAccount(Number(id)))?.getOutputsWithAdditionalUnlockConditions(outputs)
}
