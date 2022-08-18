import { IProcessedTransaction } from '../../interfaces'
import { OutputData } from '@iota/wallet'
import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { IOutputResponse, ITransactionPayload, IUTXOInput } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { IAccountState } from '@core/account'

export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    incomingTransactions: [ITransactionPayload, IOutputResponse[]],
    account: IAccountState
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

    const isIncoming = isTransactionIncoming(outputDatas, account.depositAddress)

    return {
        outputs: outputs,
        transactionId: transactionMetadata?.transactionId,
        isIncoming,
        time: new Date(transactionMetadata.milestoneTimestampBooked * MILLISECONDS_PER_SECOND),
        inclusionState: InclusionState.Confirmed,
        transactionInputs,
        detailedTransactionInputs,
    }
}

function isTransactionIncoming(outputs: OutputData[], accountAddress: string): boolean {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return false
    }
    const address = getRecipientAddressFromOutput(nonRemainderOutputs[0].output)
    return address === accountAddress
}
