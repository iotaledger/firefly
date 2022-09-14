import { IOutput, IProcessedTransaction } from '../../interfaces'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { IOutputResponse, ITransactionPayload, IUTXOInput, IAliasOutput } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { IAccountState } from '@core/account'
import { OUTPUT_TYPE_ALIAS } from '@core/wallet/constants/output-type.constants'

export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    incomingTransactions: [ITransactionPayload, IOutputResponse[]],
    account: IAccountState
): IProcessedTransaction[] {
    const transactionMetadata = outputDatas[0]?.metadata
    const detailedTransactionInputs = incomingTransactions?.[1]

    const transactionInputs =
        detailedTransactionInputs?.map(
            (input) =>
                ({
                    type: 0,
                    transactionId: input.metadata.transactionId,
                    transactionOutputIndex: input.metadata.outputIndex,
                } as IUTXOInput)
        ) ?? []

    const isIncoming = isTransactionIncoming(outputDatas, account.depositAddress)

    const outputGroups: IOutput[][] = splitOutputs(outputDatas)
    const processedTransactions = outputGroups.map((outputs) => ({
        outputs,
        transactionId: transactionMetadata?.transactionId,
        isIncoming,
        time: new Date(transactionMetadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        transactionInputs,
        detailedTransactionInputs,
    }))
    return processedTransactions
}

function isTransactionIncoming(outputs: OutputData[], accountAddress: string): boolean {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return false
    }
    const address = getRecipientAddressFromOutput(nonRemainderOutputs[0].output)
    return address === accountAddress
}

function splitOutputs(outputDatas: OutputData[]): IOutput[][] {
    const outputs = outputDatas.map((outputData) => ({
        outputId: outputData.outputId,
        output: outputData.output,
    }))

    const aliasOutput = outputs.find((output) => output.output.type === OUTPUT_TYPE_ALIAS)
    const containsNewAliasOutput = (aliasOutput?.output as IAliasOutput)?.stateIndex === 0

    if (containsNewAliasOutput) {
        const aliasOutputIndex = outputs.findIndex((output) => output.output.type === OUTPUT_TYPE_ALIAS)

        const aliasOutput = [outputs[aliasOutputIndex]]
        const otherOutputs = outputs.slice(aliasOutputIndex)
        return [aliasOutput, otherOutputs]
    } else {
        return [outputs]
    }
}
