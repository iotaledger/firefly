import { IProcessedOutput } from '../../interfaces'
import { OutputData } from '@iota/wallet'
import { OUTPUT_TYPE_FOUNDRY } from '../../constants'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { IOutputResponse, IUTXOInput } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'

export function preprocessOutput(outputData: OutputData, transactionInputs: IOutputResponse[]): IProcessedOutput {
    const output = outputData.output
    const isFoundry = output.type === OUTPUT_TYPE_FOUNDRY

    const transactionInputs2 =
        transactionInputs?.map(
            (input) =>
                ({
                    type: 0,
                    transactionId: input.metadata.transactionId,
                    transactionOutputIndex: input.metadata.outputIndex,
                } as IUTXOInput)
        ) ?? []

    return {
        type: isFoundry ? 'foundry' : 'default',
        output: output,
        outputId: outputData.outputId,
        transactionId: outputData?.metadata?.transactionId,
        time: new Date(outputData.metadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        claimingOutput: undefined,
        isSelfTransaction: false,
        inclusionState: InclusionState.Confirmed,
        transactionInputs: transactionInputs,
        transactionInputs2: transactionInputs2,
    }
}
