import { CommonOutput, OutputData, OutputResponse, UTXOInput } from '@iota/sdk/out/types'
import { IWalletState } from '@core/wallet/interfaces'
import { InclusionState, ActivityDirection } from '../../enums'
import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { getSenderAddressFromInputs } from '../transactions'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { get } from 'svelte/store'
import { MILLISECONDS_PER_SECOND } from 'shared/lib/core/utils'

// TODO(2.0) Fix all usages
export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    transactionInputs: OutputResponse[],
    wallet: IWalletState
): IProcessedTransaction {
    const transactionMetadata = outputDatas[0]?.metadata
    const wrappedInputs = convertTransactionOutputResponsesToWrappedOutputs(
        transactionMetadata?.included.transactionId,
        transactionInputs
    )
    const utxoInputs = getUtxoInputsFromWrappedInputs(wrappedInputs)
    const direction = getDirectionForOutputs(outputDatas, wrappedInputs, wallet.depositAddress)
    const wrappedOutputs = outputDatas.map((outputData) => ({
        outputId: outputData.outputId,
        remainder: outputData.remainder,
        output: outputData.output,
    }))

    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    let slotUnixTimestamp = 0
    if (nodeProtocolParameters) {
        slotUnixTimestamp = getUnixTimestampFromNodeInfoAndSlotIndex(
            nodeProtocolParameters,
            transactionMetadata?.included?.slot
        )
    }

    return {
        outputs: wrappedOutputs,
        transactionId: transactionMetadata?.included.transactionId,
        direction,
        time: new Date(slotUnixTimestamp * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        utxoInputs,
        wrappedInputs,
    }
}

// TODO(2.0) Fix all usages
function getDirectionForOutputs(
    outputs: OutputData[],
    wrappedInputs: IWrappedOutput[],
    depositAddress: string
): ActivityDirection {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return ActivityDirection.Outgoing
    }
    const output = nonRemainderOutputs[0].output
    const recipientAddress = output ? getRecipientAddressFromOutput(output as CommonOutput) : undefined
    const senderAddress = wrappedInputs ? getSenderAddressFromInputs(wrappedInputs) : ''
    const isRecipientOneOfAccountAddresses = depositAddress === recipientAddress
    const isSenderOneOfAccountAddresses = depositAddress === senderAddress
    const isSelfTransaction = isRecipientOneOfAccountAddresses && isSenderOneOfAccountAddresses

    if (isSelfTransaction) {
        return ActivityDirection.SelfTransaction
    }
    if (isRecipientOneOfAccountAddresses && recipientAddress !== senderAddress) {
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
    const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, outputResponse.metadata.outputIndex)
    return { outputId, output: outputResponse.output, metadata: outputResponse.metadata }
}

function getUtxoInputsFromWrappedInputs(wrappedInputs: IWrappedOutput[]): UTXOInput[] {
    return (
        wrappedInputs?.map((input) => new UTXOInput(input.metadata?.transactionId, input.metadata?.outputIndex)) ?? []
    )
}
