import { IWalletState } from '@core/wallet/interfaces'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet'
import { generateSingleNftActivity } from './generateSingleNftActivity'
import { NftOutput, OutputType } from '@iota/sdk/out/types'

export async function generateActivitiesFromNftOutputs(
    processedTransaction: IProcessedTransaction,
    account: IWalletState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const nftOutputs = outputs.filter((output) => output.output.type === OutputType.Nft)
    for (const nftOutput of nftOutputs) {
        const output = nftOutput.output as NftOutput
        const activity = await generateSingleNftActivity(account, {
            action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: nftOutput,
        })
        activities.push(activity)
    }
    return activities
}
