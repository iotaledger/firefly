import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction } from '@core/wallet'
import { Activity, type AnchorActivity } from '@core/wallet/types'
import { generateSingleAnchorActivity } from './generateSingleAnchorActivity'
import { AnchorOutput, OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromAnchorOutputs(
    processedTransaction: IProcessedTransaction,
    wallet: IWalletState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities: AnchorActivity[] = []

    const anchorOutputs = outputs.filter((output) => output.output.type === OutputType.Anchor)
    for (const anchorOutput of anchorOutputs) {
        const output = anchorOutput.output as AnchorOutput
        const activity = await generateSingleAnchorActivity(wallet, {
            action: output.anchorId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: anchorOutput,
        })
        activities.push(activity)
    }
    return activities
}
