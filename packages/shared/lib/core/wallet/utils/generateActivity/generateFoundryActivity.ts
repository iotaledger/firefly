import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction } from '../../interfaces'
import { getNativeTokenFromOutput, getFoundryOutputFromTransaction, outputContainsValue } from '..'
import { ActivityType } from '@core/wallet/enums'
import { FoundryActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
} from './helper'
import { IAccountState } from '@core/account'

export function generateFoundryActivity(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): FoundryActivity {
    const { outputs, transactionId, claimingData, transactionInputs, time, inclusionState } = processedTransaction
    const { output, outputId } = getFoundryOutputFromTransaction(outputs)

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const id = outputId || transactionId
    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    const sendingInfo = getSendingInformation(processedTransaction, output, account)
    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)

    return {
        type: ActivityType.Foundry,
        id,
        outputId,
        transactionId,
        assetId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        time,
        inputs,
        inclusionState,
        containsValue,
        isAssetHidden,
        isHidden,
        ...sendingInfo,
        ...asyncData,
    }
}
