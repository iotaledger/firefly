import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Transaction } from '@iota/wallet'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { OUTPUT_TYPE_TREASURY } from '@core/wallet/constants'
import { getDirectionFromTransaction } from '../transactions'
import { IAccountState } from '@core/account'
import { OutputTypes } from '@iota/types'

export async function preprocessTransaction(
    transaction: Transaction,
    account: IAccountState
): Promise<IProcessedTransaction> {
    const outputs = convertTransactionsOutputTypesToWrappedOutputs(
        transaction.transactionId,
        transaction.payload.essence.outputs
    )
    const direction = getDirectionFromTransaction(outputs, transaction.incoming, account.depositAddress)
    const utxoInputs = transaction.payload.essence.inputs
    const inputIds = utxoInputs.map((input) =>
        getOutputIdFromTransactionIdAndIndex(input.transactionId, input.transactionOutputIndex)
    )
    const inputs = await Promise.all(inputIds.map((inputId) => account.getOutput(inputId)))
    return {
        outputs: outputs,
        transactionId: transaction.transactionId,
        direction,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        wrappedInputs: <IWrappedOutput[]>inputs,
        utxoInputs,
    }
}

function convertTransactionsOutputTypesToWrappedOutputs(
    transactionId: string,
    outputTypes: OutputTypes[]
): IWrappedOutput[] {
    return outputTypes.map((outputType, index) =>
        convertTransactionOutputTypeToWrappedOutput(transactionId, index, outputType)
    )
}

function convertTransactionOutputTypeToWrappedOutput(
    transactionId: string,
    index: number,
    outputType: OutputTypes
): IWrappedOutput {
    const outputId = getOutputIdFromTransactionIdAndIndex(transactionId, index)
    return {
        outputId,
        output: outputType.type !== OUTPUT_TYPE_TREASURY ? outputType : undefined,
        remainder: false,
    }
}
