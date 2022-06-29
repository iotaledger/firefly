import { OutputsToClaim } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function getOutputsWithAdditionalUnlockConditions(
    outputs: OutputsToClaim,
    id?: string
): Promise<string[]> {
    return (await getAccount(Number(id)))?.getOutputsWithAdditionalUnlockConditions(outputs)
}
