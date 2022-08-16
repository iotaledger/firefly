import { IProcessedTransaction } from '../../interfaces'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { IOutputResponse, IUTXOInput } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'

export function preprocessOutput(
    outputData: OutputData,
    detailedTransactionInputs: IOutputResponse[]
): IProcessedTransaction {
    const output = outputData.output

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
        outputs: [output],
        transactionId: outputData?.metadata?.transactionId,
        time: new Date(outputData.metadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        transactionInputs,
        detailedTransactionInputs,
    }
}
