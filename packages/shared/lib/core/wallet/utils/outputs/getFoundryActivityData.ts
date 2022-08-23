import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction, FoundryActivityData } from '../../interfaces'
import {
    getAmountFromOutput,
    getNativeTokenFromOutput,
    getStorageDepositFromOutput,
    getFoundryOutputFromTransaction,
} from '..'

export function getFoundryActivityData(processedTransaction: IProcessedTransaction): FoundryActivityData {
    const { outputs } = processedTransaction
    const { output } = getFoundryOutputFromTransaction(outputs)

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    return {
        type: 'foundry',
        assetId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
    }
}
