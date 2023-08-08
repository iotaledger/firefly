import { OutputData, OutputResponse, OutputType, UTXOInput } from '@iota/wallet/out/types'
import { MILLISECONDS_PER_SECOND } from '@core/utils/constants'
import { IAccountState } from '@core/account/interfaces'
import { InclusionState, ActivityDirection } from '../../enums'
import { OUTPUT_TYPE_TREASURY } from '../../constants'
import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { getSenderAddressFromInputs } from '../transactions'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'

export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    transactionInputs: OutputResponse[],
    account: IAccountState
): IProcessedTransaction {
    const transactionMetadata = outputDatas[0]?.metadata
    const wrappedInputs = convertTransactionOutputResponsesToWrappedOutputs(
        transactionMetadata?.transactionId,
        transactionInputs
    )
    const utxoInputs = getUtxoInputsFromWrappedInputs(wrappedInputs)
    const direction = getDirectionForOutputs(outputDatas, wrappedInputs, account.depositAddress)
    const wrappedOutputs = outputDatas.map((outputData) => ({
        outputId: outputData.outputId,
        remainder: outputData.remainder,
        output: outputData.output.type !== OutputType.Treasury ? outputData.output : undefined,
    }))

    return {
        outputs: wrappedOutputs,
        transactionId: transactionMetadata?.transactionId,
        direction,
        time: new Date(transactionMetadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        utxoInputs,
        wrappedInputs,
    }
}

function getDirectionForOutputs(
    outputs: OutputData[],
    wrappedInputs: IWrappedOutput[],
    accountAddress: string
): ActivityDirection {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return ActivityDirection.Outgoing
    }
    const output =
        nonRemainderOutputs[0].output.type !== OUTPUT_TYPE_TREASURY ? nonRemainderOutputs[0].output : undefined
    const recipientAddress = getRecipientAddressFromOutput(output)
    const senderAddress = wrappedInputs ? getSenderAddressFromInputs(wrappedInputs) : ''

    if (recipientAddress === accountAddress && recipientAddress === senderAddress) {
        return ActivityDirection.SelfTransaction
    }
    if (recipientAddress === accountAddress && recipientAddress !== senderAddress) {
        return ActivityDirection.Incoming
    } else {
        return ActivityDirection.Outgoing
    }
}

function convertTransactionOutputResponsesToWrappedOutputs(
    transactionId: string,
    outputResponses: OutputResponse[]
): IWrappedOutput[] {
    return outputResponses.map((outputResponse) =>
        convertTransactionOutputResponseToWrappedOutput(transactionId, outputResponse)
    )
}

function convertTransactionOutputResponseToWrappedOutput(
    transactionId: string,
    outputResponse: OutputResponse
): IWrappedOutput {
    if (outputResponse.output.type === OutputType.Treasury) {
        return undefined
    } else {
        const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, outputResponse.metadata.outputIndex)
        return { outputId, output: outputResponse.output, metadata: outputResponse.metadata }
    }
}

function getUtxoInputsFromWrappedInputs(wrappedInputs: IWrappedOutput[]): UTXOInput[] {
    // TODO-sdk This won't work probably
    return (
        wrappedInputs?.map((input) => ({
            type: 0,
            transactionId: input.metadata?.transactionId,
            transactionInputIndex: input.metadata?.outputIndex,
        })) ?? []
    )
}
