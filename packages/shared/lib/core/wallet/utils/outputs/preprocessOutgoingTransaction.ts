import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import {
    AccountOutput,
    Output,
    OutputType,
    OutputWithMetadata,
    TransactionWithMetadata,
    UTXOInput,
} from '@iota/sdk/out/types'
import { computeOutputId } from './computeOutputId'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getDirectionFromOutgoingTransaction } from '../transactions'
import { IWalletState } from '@core/wallet/interfaces'
import { getPassiveManaForOutput } from 'shared/lib/core/network'

export async function preprocessOutgoingTransaction(
    transaction: TransactionWithMetadata,
    wallet: IWalletState
): Promise<IProcessedTransaction> {
    const regularTransactionEssence = transaction.payload.transaction
    const transactionId = transaction?.transactionId?.toString()

    const outputs = convertTransactionsOutputTypesToWrappedOutputs(transactionId, regularTransactionEssence.outputs)

    const direction = getDirectionFromOutgoingTransaction(regularTransactionEssence.outputs, await wallet.address())
    const utxoInputs = regularTransactionEssence.inputs.map((i) => i as UTXOInput)
    const inputIds = utxoInputs.map((input) => {
        const transactionId = input.transactionId
        const transactionOutputIndex = input.transactionOutputIndex
        return computeOutputId(transactionId, transactionOutputIndex)
    })

    const inputs = await Promise.all(inputIds.map((inputId) => wallet.getOutput(inputId)))

    let manaCost = 0
    const prevAccountOutput = inputs.find((input) => (input.output as AccountOutput).accountId)
    if (prevAccountOutput) {
        const prevMana = getPassiveManaForOutput(prevAccountOutput) ?? 0
        const postAccountOutput = outputs.find(
            (output) =>
                (prevAccountOutput.output as AccountOutput).accountId === (output.output as AccountOutput).accountId
        )
        manaCost = prevMana - Number(postAccountOutput?.output?.mana ?? 0)
    }

    return {
        outputs: outputs,
        transactionId,
        direction,
        time: new Date(Number(transaction.timestamp)),
        inclusionState: transaction.inclusionState,
        mana: manaCost,
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
