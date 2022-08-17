import { IProcessedTransaction } from '../../interfaces'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { IOutputResponse, ITransactionPayload, IUTXOInput } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'

export function preprocessOutput(
    outputDatas: OutputData[],
    incomingTransactions: [ITransactionPayload, IOutputResponse[]]
): IProcessedTransaction {
    const outputs = outputDatas.map((outputData) => outputData.output)
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

    return {
        outputs: outputs,
        transactionId: transactionMetadata?.transactionId,
        time: new Date(transactionMetadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        transactionInputs,
        detailedTransactionInputs,
    }
}
