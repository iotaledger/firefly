import { IAccountState } from '@core/account'
import { ActivityAction, IProcessedTransaction, OUTPUT_TYPE_FOUNDRY } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'

export async function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_FOUNDRY)
    for (const foundryOutput of foundryOutputs) {
        activities.push(
            await generateSingleFoundryActivity(account, {
                action: ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: foundryOutput,
            })
        )
    }
    return activities
}
