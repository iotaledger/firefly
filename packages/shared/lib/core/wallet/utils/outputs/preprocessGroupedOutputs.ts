import { OutputData } from '@iota/wallet'
import { IOutputResponse, ITransactionPayload, IUTXOInput } from '@iota/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { IAccountState } from '@core/account/interfaces'
import { InclusionState } from '../../enums'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { IProcessedTransaction } from '../../interfaces'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { getSenderAddressFromInputs } from '../transactions'

export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    incomingTransactions: [ITransactionPayload, IOutputResponse[]],
    account: IAccountState
): IProcessedTransaction {
    const transactionMetadata = outputDatas[0]?.metadata
    const detailedTransactionInputs = incomingTransactions?.[1]

    const transactionInputs =
        detailedTransactionInputs?.map(
            (input) =>
                ({
                    type: 0,
                    transactionId: input.metadata.transactionId,
                    transactionOutputIndex: input.metadata.outputIndex,
                } as IUTXOInput)
        ) ?? []

    const direction = isTransactionIncoming(outputDatas, detailedTransactionInputs, account.depositAddress)
    const wrappedOutputs = outputDatas.map((outputData) => ({
        outputId: outputData.outputId,
        output: outputData.output.type !== OUTPUT_TYPE_TREASURY ? outputData.output : undefined,
    }))

    return {
        outputs: wrappedOutputs,
        transactionId: transactionMetadata?.transactionId,
        direction,
        time: new Date(transactionMetadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        transactionInputs,
        detailedTransactionInputs,
    }
}

function isTransactionIncoming(
    outputs: OutputData[],
    detailedTransactionInputs: IOutputResponse[],
    accountAddress: string
): ActivityDirection {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return ActivityDirection.Outgoing
    }
    const output =
        nonRemainderOutputs[0].output.type !== OUTPUT_TYPE_TREASURY ? nonRemainderOutputs[0].output : undefined
    const recipientAddress = getRecipientAddressFromOutput(output)
    const senderAddress = detailedTransactionInputs ? getSenderAddressFromInputs(detailedTransactionInputs) : ''

    if (recipientAddress === accountAddress && recipientAddress === senderAddress) {
        return ActivityDirection.SelfTransaction
    }
    if (recipientAddress === accountAddress && recipientAddress !== senderAddress) {
        return ActivityDirection.Incoming
    } else {
        return ActivityDirection.Outgoing
    }
}
