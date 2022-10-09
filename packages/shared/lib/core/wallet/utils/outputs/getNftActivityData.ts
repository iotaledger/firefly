import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { ActivityType } from '@core/wallet/enums'
import { get } from 'svelte/store'
import { getAmountFromOutput, getNativeTokenFromOutput, getStorageDepositFromOutput } from '..'
import { INftActivityData, IProcessedTransaction } from '../../interfaces'

export function getNftActivityData(processedTransaction: IProcessedTransaction): INftActivityData {
    const { outputs } = processedTransaction
    const { output, outputId } = outputs.find((output) => output.output.type === OUTPUT_TYPE_NFT)
    const storageDeposit = getAmountFromOutput(output) + getStorageDepositFromOutput(output).storageDeposit
    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    return {
        type: ActivityType.Nft,
        outputId,
        assetId,
        storageDeposit,
    }
}
