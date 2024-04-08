import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
import { DelegationActivity } from '@core/wallet/types'
import {
    getAmountFromOutput,
    getAsyncDataFromOutput,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { DelegationOutput } from '@iota/sdk/out/types'

export async function generateSingleDelegationActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<DelegationActivity> {
    const { transactionId, direction, time, inclusionState, mana } = processedTransaction
    const output = wrappedOutput.output as DelegationOutput
    // console.log('output', output, wrappedOutput)
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId

    const { storageDeposit: _storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(wallet, output)
    const storageDeposit = getAmountFromOutput(output) + _storageDeposit

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true
    const delegatedAmount = output.delegatedAmount.toString()
    const delegationId = output.delegationId
    const validatorAddress = wrappedOutput?.validatorAddress
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)

    return {
        type: ActivityType.Delegation,
        id,
        outputId,
        transactionId,
        direction,
        action,
        storageDeposit,
        giftedStorageDeposit,
        isHidden,
        isAssetHidden,
        time,
        metadata,
        tag,
        inclusionState,
        containsValue,
        mana,
        delegatedAmount,
        delegationId,
        validatorAddress,
        asyncData,
        ...sendingInfo,
    }
}
