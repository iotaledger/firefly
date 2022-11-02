import { IProcessedTransaction } from '../../interfaces'
import { outputContainsValue, getNftOutputFromTransaction } from '..'
import { ActivityType } from '@core/wallet/enums'
import { IAccountState } from '@core/account'
import type { INftOutput } from '@iota/types'
import { getAsyncDataFromOutput } from '../generateActivity/helper/getAsyncDataFromOutput'
import { NftActivity } from '@core/wallet/types'
import { getSendingInformation } from './helper'
import { getNftByIdFromAllAccountNfts } from '@core/nfts'
import { getMetadataFromNftOutput } from '../outputs/getMetadataFromNftOutput'
import { getNftId } from '../outputs/getNftId'

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
    const nft = getNftByIdFromAllAccountNfts(account.index, nftId)
    const metadata = nft?.metadata ?? getMetadataFromNftOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
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
        immutableFeatures: output.immutableFeatures,
        storageDeposit,
        metadata,
        asyncData,
        ...sendingInfo,
    }
}
