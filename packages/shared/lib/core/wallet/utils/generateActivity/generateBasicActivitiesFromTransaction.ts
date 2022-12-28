import { IAccountState } from '@core/account'
import {
    ActivityAction,
    getNftId,
    getNonRemainderBasicOutputsFromTransaction,
    IProcessedTransaction,
    OUTPUT_TYPE_NFT,
} from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'
import { generateSingleNftActivity } from './generateSingleNftActivity'

export function generateBasicActivitiesFromTransaction(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const activities = []

    const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.direction
    )
    const burnedNftOutputs = getBurnedNfts(processedTransaction)
    for (const basicOutput of basicOutputs) {
        const burnedNftOutputIndex = burnedNftOutputs.findIndex((output) => output.amount === basicOutput.output.amount)

        let activity: Activity
        if (burnedNftOutputIndex >= 0) {
            activity = generateSingleNftActivity(
                account,
                {
                    action: ActivityAction.Burn,
                    processedTransaction,
                    wrappedOutput: basicOutput,
                },
                burnedNftOutputs[burnedNftOutputIndex].nftId
            )
            burnedNftOutputs.splice(burnedNftOutputIndex, 1)
            activities.push(activity)
        }
        activities.push(
            generateSingleBasicActivity(account, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        )
    }
    return activities
}

function getBurnedNfts(processedTransaction: IProcessedTransaction): { nftId: string; amount: string }[] {
    const burnedNftOutputs: { nftId: string; amount: string }[] = []
    const nftIdsInOutputs = processedTransaction.outputs
        .map((output) =>
            output.output.type === OUTPUT_TYPE_NFT ? getNftId(output.output.nftId, output.outputId) : undefined
        )
        .filter((output) => output)

    for (const wrappedInput of processedTransaction.wrappedInputs) {
        const output = wrappedInput.output
        if (output.type === OUTPUT_TYPE_NFT) {
            const nftId = getNftId(output.nftId, wrappedInput.outputId)
            if (!nftIdsInOutputs.includes(nftId)) {
                burnedNftOutputs.push({ nftId, amount: wrappedInput.output.amount })
            }
        }
    }
    return burnedNftOutputs
}
