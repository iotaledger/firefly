import { IProcessedTransaction } from '../../interfaces'
import { convertHexAddressToBech32, outputContainsValue, hashOutputId } from '..'
import { ActivityAction, ActivityType } from '@core/wallet/enums'
import { ADDRESS_TYPE_ALIAS, EMPTY_HEX_ID, OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { IAliasOutput } from '@iota/types'
import { AliasActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getGovernorAddressFromAliasOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStateControllerAddressFromAliasOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { IAccountState } from '@core/account'

export function generateAliasActivity(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): AliasActivity {
    const { outputs, utxoInputs, transactionId, claimingData, direction, time, inclusionState } = processedTransaction
    const wrappedOutput = outputs.find((output) => output.output.type === OUTPUT_TYPE_ALIAS)

    const output = wrappedOutput.output as IAliasOutput
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit
    const governorAddress = getGovernorAddressFromAliasOutput(output)
    const stateControllerAddress = getStateControllerAddressFromAliasOutput(output)
    const aliasId = getAliasId(output, outputId)
    const action = output.aliasId === EMPTY_HEX_ID ? ActivityAction.Mint : ActivityAction.Send

    const isHidden = false
    const isAssetHidden = false
    const containsValue = outputContainsValue(processedTransaction, account)

    const inputs = utxoInputs

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const asyncData = getAsyncDataFromOutput(output, outputId, claimingData, account)
    const sendingInfo = getSendingInformation(processedTransaction, output, account)

    return {
        type: ActivityType.Alias,
        id,
        outputId,
        transactionId,
        direction,
        action,
        aliasId,
        storageDeposit,
        giftedStorageDeposit,
        governorAddress,
        stateControllerAddress,
        isHidden,
        isAssetHidden,
        inputs,
        time,
        metadata,
        tag,
        inclusionState,
        containsValue,
        asyncData,
        ...sendingInfo,
    }
}

function getAliasId(output: IAliasOutput, outputId: string): string {
    const isNewAlias = output.aliasId === EMPTY_HEX_ID
    const aliasId = isNewAlias ? hashOutputId(outputId) : output.aliasId
    return convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, aliasId)
}
