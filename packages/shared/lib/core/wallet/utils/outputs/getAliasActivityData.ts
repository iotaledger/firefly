import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction, IAliasActivityData } from '../../interfaces'
import {
    getAmountFromOutput,
    getGovernorAddressFromOutput,
    getNativeTokenFromOutput,
    getStorageDepositFromOutput,
    getStateControllerAddressFromOutput,
} from '..'
import { ActivityType } from '@core/wallet/enums'
import { OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'

export function getAliasActivityData(processedTransaction: IProcessedTransaction): IAliasActivityData {
    const { outputs } = processedTransaction
    const { output, outputId } = outputs.find((output) => output.output.type === OUTPUT_TYPE_ALIAS)

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const storageDeposit = getAmountFromOutput(output) + getStorageDepositFromOutput(output).storageDeposit
    const governorAddress = getGovernorAddressFromOutput(output)
    const stateControllerAddress = getStateControllerAddressFromOutput(output)
    const aliasId = output.type === OUTPUT_TYPE_ALIAS ? output.aliasId : ''

    return {
        type: ActivityType.Alias,
        outputId,
        assetId,
        aliasId,
        storageDeposit,
        governorAddress,
        stateControllerAddress,
    }
}
