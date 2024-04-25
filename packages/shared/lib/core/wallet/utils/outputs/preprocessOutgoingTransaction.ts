import { IProcessedTransaction, IWrappedOutput } from '../../interfaces'
import { Output, OutputType, OutputWithMetadata, TransactionWithMetadata, UTXOInput } from '@iota/sdk/out/types'
import { computeOutputId } from './computeOutputId'
import { getOutputIdFromTransactionIdAndIndex } from './getOutputIdFromTransactionIdAndIndex'
import { getDirectionFromOutgoingTransaction } from '../transactions'
import { IWalletState } from '@core/wallet/interfaces'
import { MILLISECONDS_PER_SECOND } from '@core/utils'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'
import { getTotalTransactionMana } from './getTotalTransactionMana'

export async function preprocessOutgoingTransaction(
    transaction: TransactionWithMetadata,
    wallet: IWalletState
): Promise<IProcessedTransaction> {
    const regularTransactionEssence = transaction.payload.transaction
    const transactionId = transaction?.transactionId?.toString()
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    const walletAddress = await wallet.address()
    const createTransactionUnixTimestamp = nodeProtocolParameters
        ? getUnixTimestampFromNodeInfoAndSlotIndex(nodeProtocolParameters, regularTransactionEssence.creationSlot)
        : 0
    const createTransactionTimestamp = createTransactionUnixTimestamp * MILLISECONDS_PER_SECOND

    const outputs = convertTransactionsOutputTypesToWrappedOutputs(transactionId, regularTransactionEssence.outputs)

    const direction = getDirectionFromOutgoingTransaction(regularTransactionEssence.outputs, walletAddress)
    const utxoInputs = regularTransactionEssence.inputs.map((i) => i as UTXOInput)
    const inputIds = utxoInputs.map((input) => {
        const transactionId = input.transactionId
        const transactionOutputIndex = input.transactionOutputIndex
        return computeOutputId(transactionId, transactionOutputIndex)
    })

    const inputs = await Promise.all(inputIds.map((inputId) => wallet.getOutput(inputId)))
    const totalTransactionMana = await getTotalTransactionMana(
        inputs,
        outputs,
        wallet,
        regularTransactionEssence.creationSlot,
        createTransactionTimestamp
    )

    return {
        outputs: outputs,
        transactionId,
        direction,
        time: new Date(createTransactionTimestamp),
        inclusionState: transaction.inclusionState,
        mana: totalTransactionMana,
        wrappedInputs: <IWrappedOutput[]>inputs,
        utxoInputs,
        creationSlot: regularTransactionEssence.creationSlot,
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
