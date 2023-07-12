import { IAccountState } from '@core/account'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction, OUTPUT_TYPE_ALIAS } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import type { IAliasOutput } from '@iota/types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'

export async function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const aliasOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_ALIAS)
    for (const aliasOutput of aliasOutputs) {
        const output = aliasOutput.output as IAliasOutput
        const activity = await generateSingleAliasActivity(account, {
            action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: aliasOutput,
        })
        activities.push(activity)
    }
    return activities
}
