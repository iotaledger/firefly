import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction, IFoundryActivityData } from '../../interfaces'
import {
    getAmountFromOutput,
    getNativeTokenFromOutput,
    getStorageDepositFromOutput,
    getFoundryOutputFromTransaction,
} from '..'
import { ActivityType } from '@core/wallet/enums'

export function getFoundryActivityData(processedTransaction: IProcessedTransaction): IFoundryActivityData {
    const { outputs } = processedTransaction
    const { output, outputId } = getFoundryOutputFromTransaction(outputs)

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    return {
        type: ActivityType.Foundry,
        outputId,
        assetId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
    }
}
