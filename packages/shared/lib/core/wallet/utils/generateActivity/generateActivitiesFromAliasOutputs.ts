import { IAccountState } from '@core/account'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction, OUTPUT_TYPE_ALIAS } from '@core/wallet'
import { Activity, type AliasActivity } from '@core/wallet/types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { AliasOutput } from '@iota/wallet'

export async function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities: AliasActivity[] = []

    const aliasOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_ALIAS)
    for (const aliasOutput of aliasOutputs) {
        const output = aliasOutput.output as AliasOutput
        const activity = await generateSingleAliasActivity(account, {
            action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: aliasOutput,
        })
        activities.push(activity)
    }
    return activities
}
