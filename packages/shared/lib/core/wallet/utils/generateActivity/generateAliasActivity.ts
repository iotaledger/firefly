import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction } from '../../interfaces'
import { getNativeTokenFromOutput, convertHexAddressToBech32, outputContainsValue, hashOutputId } from '..'
import { ActivityType, AliasType } from '@core/wallet/enums'
import { ADDRESS_TYPE_ALIAS, EMPTY_HEX_ID, OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { IAliasOutput } from '@iota/types'
import { AliasActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getGovernorAddressFromOutput,
    getSendingInformation,
    getStateControllerAddressFromOutput,
    getStorageDepositFromOutput,
} from './helper'
import { IAccountState } from '@core/account'

export function generateAliasActivity(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): AliasActivity {
    const { outputs, transactionInputs, transactionId, claimingData, time, inclusionState } = processedTransaction
    const wrappedOutput = outputs.find((output) => output.output.type === OUTPUT_TYPE_ALIAS)

    const output = wrappedOutput.output as IAliasOutput
    const outputId = wrappedOutput.outputId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit
    const governorAddress = getGovernorAddressFromOutput(output)
    const stateControllerAddress = getStateControllerAddressFromOutput(output)
    const aliasId = getAliasId(output, outputId)
    const aliasType = output.aliasId === EMPTY_HEX_ID ? AliasType.Created : AliasType.Other

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = transactionInputs

    const id = outputId || transactionId

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const asyncData = getAsyncDataFromOutput(output, transactionId, claimingData, account)
    const sendingInfo = getSendingInformation(processedTransaction, output, account)

    return {
        type: ActivityType.Alias,
        id,
        outputId,
        transactionId,
        assetId,
        aliasId,
        aliasType,
        storageDeposit,
        giftedStorageDeposit,
        governorAddress,
        stateControllerAddress,
        isHidden,
        isAssetHidden,
        inputs,
        time,
        inclusionState,
        containsValue,
        ...sendingInfo,
        ...asyncData,
    }
}

function getAliasId(output: IAliasOutput, outputId: string): string {
    const isNewAlias = output.aliasId === EMPTY_HEX_ID
    const aliasId = isNewAlias ? hashOutputId(outputId) : output.aliasId
    return convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, aliasId)
}
