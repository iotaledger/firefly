import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Output, OutputType, OutputWithMetadata, TransactionWithMetadata, UTXOInput } from '@iota/sdk/out/types'
// import { computeOutputId } from './computeOutputId'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { ActivityDirection } from '../../enums'

export function preprocessIncomingTransaction(transaction: TransactionWithMetadata): IProcessedTransaction {
    const regularTransactionEssence = transaction.payload.transaction
    const transactionId = transaction?.transactionId?.toString()

    const outputs = convertTransactionsOutputTypesToWrappedOutputs(transactionId, regularTransactionEssence.outputs)

    const utxoInputs = regularTransactionEssence.inputs.map((i) => i as UTXOInput)
    // const inputIds =  utxoInputs.map((input) => {
    //         const transactionId = input.transactionId
    //         const transactionOutputIndex = input.transactionOutputIndex
    //         return computeOutputId(transactionId, transactionOutputIndex)
    //     })
    // const inputs = await Promise.all(inputIds.map((inputId) => wallet.getOutput(inputId)))

    return {
        outputs: outputs,
        transactionId,
        direction: ActivityDirection.Incoming,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        wrappedInputs: [],
        // wrappedInputs: <IWrappedOutput[]>inputs,
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
