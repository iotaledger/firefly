import { IProcessedTransaction } from '../../interfaces'
import { outputContainsValue, getNftOutputFromTransaction } from '..'
import { ActivityDirection, ActivityType } from '@core/wallet/enums'
import { IAccountState } from '@core/account'
import type { INftOutput } from '@iota/types'
import { getAsyncDataFromOutput } from '../generateActivity/helper/getAsyncDataFromOutput'
import { NftActivity } from '@core/wallet/types'
import { getMetadataFromOutput, getSendingInformation, getTagFromOutput } from './helper'
import { getNftId } from '../outputs/getNftId'
import { EMPTY_HEX_ID } from '@core/wallet/constants'

export function generateNftActivity(processedTransaction: IProcessedTransaction, account: IAccountState): NftActivity {
    const { outputs, claimingData, transactionInputs, time, inclusionState, transactionId } = processedTransaction
    const wrappedOutput = getNftOutputFromTransaction(outputs)
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as INftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const nftId = getNftId(output.nftId, outputId)
    const storageDeposit = Number(output.amount)
    const giftedStorageDeposit = 0
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const { subject, isInternal, isSelfTransaction } = sendingInfo
    let { direction } = sendingInfo

    direction = output.nftId === EMPTY_HEX_ID ? ActivityDirection.Minting : direction
    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    return {
        type: ActivityType.Nft,
        id,
        transactionId,
        outputId,
        nftId,
        time,
        isHidden,
        giftedStorageDeposit,
        isAssetHidden,
        containsValue,
        inputs,
        inclusionState,
        storageDeposit,
        metadata,
        tag,
        asyncData,
        subject,
        isInternal,
        direction,
        isSelfTransaction,
    }
}
