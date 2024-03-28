import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Output, OutputType, OutputWithMetadata, TransactionWithMetadata, UTXOInput } from '@iota/sdk/out/types'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { ActivityDirection } from '../../enums'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function preprocessIncomingTransaction(transaction: TransactionWithMetadata): IProcessedTransaction {
    const regularTransactionEssence = transaction.payload.transaction
    const transactionId = transaction?.transactionId?.toString()
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    const slotUnixTimestamp = nodeProtocolParameters
        ? getUnixTimestampFromNodeInfoAndSlotIndex(nodeProtocolParameters, regularTransactionEssence.creationSlot)
        : 0

    const outputs = convertTransactionsOutputTypesToWrappedOutputs(transactionId, regularTransactionEssence.outputs)

    const utxoInputs = regularTransactionEssence.inputs.map((i) => i as UTXOInput)
    const inputs = transaction.inputs.map((input) => ({
        output: input.output,
        outputId: input.metadata.outputId,
        metadata: input.metadata,
        remainder: true,
    }))

    return {
        outputs,
        transactionId,
        direction: ActivityDirection.Incoming,
        time: new Date(slotUnixTimestamp * MILLISECONDS_PER_SECOND),
        inclusionState: transaction.inclusionState,
        wrappedInputs: <IWrappedOutput[]>inputs,
        utxoInputs,
    }
}

function convertTransactionsOutputTypesToWrappedOutputs(
    transactionId: string,
    outputTypes: Output[]
): IWrappedOutput[] {
    return outputTypes.map((outputType, index) =>
        convertTransactionOutputTypeToWrappedOutput(transactionId, index, outputType)
    )
}

function convertTransactionOutputTypeToWrappedOutput(
    transactionId: string,
    index: number,
    outputType: Output
): IWrappedOutput {
    const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, index)
    OutputWithMetadata
    return {
        outputId,
        output: outputType,
        remainder:
            index === 0 || (outputType.type !== OutputType.Basic && outputType.type !== OutputType.Account)
                ? false
                : true, // when sending prepared output in the resulting transactions outputs array it will always be first output(index = 0)
    }
}
