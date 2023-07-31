import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Output, RegularTransactionEssence, Transaction, UTXOInput, Utils } from '@iota/wallet'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getDirectionFromTransaction } from '../transactions'
import { IAccountState } from '@core/account'

export async function preprocessTransaction(
    transaction: Transaction,
    account: IAccountState
): Promise<IProcessedTransaction> {
    const regularTransactionEssence = transaction.payload.essence as RegularTransactionEssence

    const outputs = convertTransactionsOutputTypesToWrappedOutputs(
        transaction?.transactionId,
        regularTransactionEssence.outputs
    )
    const direction = getDirectionFromTransaction(outputs, transaction.incoming, account.depositAddress)
    const utxoInputs = regularTransactionEssence.inputs.map((i) => i as UTXOInput)
    const inputIds = utxoInputs.map((input) => {
        const transactionId = input.transactionId
        const transactionOutputIndex = input.transactionOutputIndex
        return Utils.computeOutputId(transactionId, transactionOutputIndex)
    })

    const inputs = await Promise.all(inputIds.map((inputId) => account.getOutput(inputId)))

    return {
        outputs: outputs,
        transactionId: transaction?.transactionId,
        direction,
        time: new Date(Number(transaction.timestamp)),
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
    return {
        outputId,
        output: outputType,
        remainder: false,
    }
}
