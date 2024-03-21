import { CommonOutput, InclusionState, OutputData, OutputWithMetadata } from '@iota/sdk/out/types'
import { IWalletState } from '@core/wallet/interfaces'
import { ActivityDirection } from '../../enums'
import { ProcessedTransaction } from '../../interfaces'
import { getRecipientAddressFromOutput } from './getRecipientAddressFromOutput'
import { getSenderAddressFromInputs } from '../transactions'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'
import { MILLISECONDS_PER_SECOND } from '@core/utils'

export function preprocessGroupedOutputs(
    outputDatas: OutputData[],
    transactionInputs: OutputWithMetadata[],
    wallet: IWalletState
): ProcessedTransaction {
    const transactionMetadata = outputDatas[0]?.metadata
    const direction = getDirectionForOutputs(outputDatas, transactionInputs, wallet.depositAddress)

    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    let slotUnixTimestamp = 0
    if (nodeProtocolParameters) {
        slotUnixTimestamp = getUnixTimestampFromNodeInfoAndSlotIndex(
            nodeProtocolParameters,
            transactionMetadata?.included?.slot
        )
    }

    return new ProcessedTransaction(
        outputDatas,
        transactionMetadata?.included.transactionId,
        direction,
        new Date(slotUnixTimestamp * MILLISECONDS_PER_SECOND),
        InclusionState.Confirmed,
        transactionInputs,
        transactionMetadata.blockId
    )
}

function getDirectionForOutputs(
    outputs: OutputData[],
    transactionInputs: OutputWithMetadata[],
    depositAddress: string
): ActivityDirection {
    const nonRemainderOutputs = outputs.filter((output) => !output.remainder)
    if (nonRemainderOutputs.length === 0) {
        return ActivityDirection.Outgoing
    }
    const output = nonRemainderOutputs[0].output
    const recipientAddress = output ? getRecipientAddressFromOutput(output as CommonOutput) : undefined
    const senderAddress = transactionInputs ? getSenderAddressFromInputs(transactionInputs) : ''
    const isRecipientOneOfAccountAddresses = depositAddress === recipientAddress
    const isSenderOneOfAccountAddresses = depositAddress === senderAddress
    const isSelfTransaction = isRecipientOneOfAccountAddresses && isSenderOneOfAccountAddresses

    if (isSelfTransaction) {
        return ActivityDirection.SelfTransaction
    }
    if (isRecipientOneOfAccountAddresses && recipientAddress !== senderAddress) {
        return ActivityDirection.Incoming
    } else {
        return ActivityDirection.Outgoing
    }
}
