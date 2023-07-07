import { IAccountState } from '@core/account'
import { ActivityAction, EMPTY_HEX_ID, IProcessedTransaction, OUTPUT_TYPE_NFT } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import type { INftOutput } from '@iota/types'
import { generateSingleNftActivity } from './generateSingleNftActivity'

export async function generateActivitiesFromNftOutputs(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Promise<Activity[]> {
    const outputs = processedTransaction.outputs
    const activities = []

    const nftOutputs = outputs.filter((output) => output.output.type === OUTPUT_TYPE_NFT)
    for (const nftOutput of nftOutputs) {
        const output = nftOutput.output as INftOutput
        const activity = await generateSingleNftActivity(account, {
            action: output.nftId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send,
            processedTransaction,
            wrappedOutput: nftOutput,
        })
        activities.push(activity)
    }
    return activities
}
