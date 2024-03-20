import { EMPTY_HEX_ID } from '@core/wallet/constants'
import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
import { AccountActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { api } from '@core/api'
import { AddressConverter } from '../AddressConverter'

export async function generateSingleAccountActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<AccountActivity> {
    const { transactionId, claimingData, direction, time, inclusionState } = processedTransaction

    const output = wrappedOutput.output as AccountOutput
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit
    const accountId = getAccountId(output, outputId)
    const accountAddress = AddressConverter.addressToBech32(new AccountAddress(accountId))

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)

    return {
        type: ActivityType.Account,
        id,
        outputId,
        transactionId,
        direction,
        action,
        accountId,
        accountAddress,
        storageDeposit,
        giftedStorageDeposit,
        isHidden,
        isAssetHidden,
        time,
        metadata,
        tag,
        inclusionState,
        containsValue,
        asyncData,
        ...sendingInfo,
    }
}

function getAccountId(output: AccountOutput, outputId: string): string {
    const isNewAccount = output.accountId === EMPTY_HEX_ID
    return isNewAccount ? api.computeAccountId(outputId) : output.accountId
}
