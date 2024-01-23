import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction } from '@core/wallet'
import { Activity, type AliasActivity } from '@core/wallet/types'
import { generateSingleAliasActivity } from './generateSingleAliasActivity'
import { AliasOutput, OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromAliasOutputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities: AliasActivity[] = []

    const aliasOutputs = outputs.filter((output) => output.output.type === OutputType.Alias)
    for (const aliasOutput of aliasOutputs) {
        const output = aliasOutput.output as AliasOutput
        const activity = await generateSingleAliasActivity(wallet, {
            action: output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: aliasOutput,
        })
        activities.push(activity)
    }
    return activities
}
