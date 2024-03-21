import { ProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Output, OutputType, TransactionWithMetadata, UTXOInput } from '@iota/sdk/out/types'
import { computeOutputId } from './computeOutputId'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getDirectionFromOutgoingTransaction } from '../transactions'
import { IWalletState } from '@core/wallet/interfaces'

export async function preprocessOutgoingTransaction(
    transaction: TransactionWithMetadata,
    wallet: IWalletState
): Promise<ProcessedTransaction> {
    const regularTransactionEssence = transaction.payload.transaction
    const transactionId = transaction?.transactionId?.toString()
    const outputs = regularTransactionEssence.outputs;

    const direction = getDirectionFromOutgoingTransaction(outputs, wallet.depositAddress)
    const utxoInputs = regularTransactionEssence.inputs.map((i) => i as UTXOInput)
    const inputIds = await Promise.all(
        utxoInputs.map((input) => {
            const transactionId = input.transactionId
            const transactionOutputIndex = input.transactionOutputIndex
            return computeOutputId(transactionId, transactionOutputIndex)
        })
    )

    const inputs = await Promise.all(inputIds.map((inputId) => wallet.getOutput(inputId)))

    return new ProcessedTransaction(
        outputs,
        transactionId,
        direction,
        new Date(Number(transaction.timestamp)),
        transaction.inclusionState,
        <IWrappedOutput[]>inputs,
        transaction.blockId
    )
}
