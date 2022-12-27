import { IAccountState } from '@core/account'
import {
    ActivityAction,
    getNftId,
    getNonRemainderBasicOutputsFromTransaction,
    IProcessedTransaction,
    IWrappedOutput,
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
        const burnedNftOutputIndex = burnedNftOutputs.findIndex(
            (output) => output.output.amount === basicOutput.output.amount
        )

        let activity: Activity
        if (burnedNftOutputIndex >= 0) {
            activity = generateSingleNftActivity(account, {
                action: ActivityAction.Burn,
                processedTransaction,
                wrappedOutput: burnedNftOutputs[burnedNftOutputIndex],
            })
        }
        activities.push(
            generateSingleBasicActivity(account, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        )
        activities.push(activity)
    }
    return activities
}

function getBurnedNfts(processedTransaction: IProcessedTransaction): IWrappedOutput[] {
    const burnedNftOutputs: IWrappedOutput[] = []
    const nftIdsInOutputs = processedTransaction.outputs
        .map((output) => {
            if (output.output.type === OUTPUT_TYPE_NFT) {
                return getNftId(output.output.nftId, output.outputId)
            } else {
                return undefined
            }
        })
        .filter((output) => output)

    for (const wrappedInput of processedTransaction.wrappedInputs) {
        const output = wrappedInput.output
        if (output.type === OUTPUT_TYPE_NFT) {
            const nftId = getNftId(output.nftId, wrappedInput.outputId)
            if (!nftIdsInOutputs.includes(nftId)) {
                burnedNftOutputs.push(wrappedInput)
            }
        }
    }
    return burnedNftOutputs
}
