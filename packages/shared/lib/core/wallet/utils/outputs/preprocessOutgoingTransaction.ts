import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Output, OutputType, TransactionWithMetadata, UTXOInput } from '@iota/sdk/out/types'
import { computeOutputId } from './computeOutputId'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getDirectionFromOutgoingTransaction } from '../transactions'
import { IWalletState } from '@core/wallet/interfaces'

export async function preprocessOutgoingTransaction(
    transaction: TransactionWithMetadata,
    wallet: IWalletState
): Promise<IProcessedTransaction> {
    const regularTransactionEssence = transaction.payload.transaction
    const transactionId = transaction?.transactionId?.toString()

    const outputs = convertTransactionsOutputTypesToWrappedOutputs(transactionId, regularTransactionEssence.outputs)

    const direction = getDirectionFromOutgoingTransaction(outputs, wallet.depositAddress)
    const inputIds = await Promise.all(
        regularTransactionEssence.inputs.map((input) => {
            const _input = input as UTXOInput
            const transactionId = _input.transactionId
            const transactionOutputIndex = _input.transactionOutputIndex
            return computeOutputId(transactionId, transactionOutputIndex)
        })
    )

    const inputs = await Promise.all(inputIds.map((inputId) => wallet.getOutput(inputId)))

    return {
        outputs: outputs,
        transactionId,
        direction,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        wrappedInputs: <IWrappedOutput[]>inputs,
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
    return {
        outputId,
        output: outputType,
        remainder: index === 0 || outputType.type !== OutputType.Basic ? false : true, // when sending prepared output in the resulting transactions outputs array it will always be first output(index = 0)
    }
}
