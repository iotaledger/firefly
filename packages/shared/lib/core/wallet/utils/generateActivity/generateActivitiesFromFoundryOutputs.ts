import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleFoundryActivity } from './generateSingleFoundryActivity'
import { OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromFoundryOutputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const foundryOutputs = outputs.filter((output) => output.output.type === OutputType.Foundry)
    for (const foundryOutput of foundryOutputs) {
        activities.push(
            await generateSingleFoundryActivity(wallet, {
                action: ActivityAction.Mint,
                processedTransaction,
                wrappedOutput: foundryOutput,
            })
        )
    }
    return activities
}
