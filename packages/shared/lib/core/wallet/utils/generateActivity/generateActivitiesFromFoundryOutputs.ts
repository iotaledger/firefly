import { IAccountState } from '@core/account'
import { ActivityAction, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OutputType.Foundry)
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
