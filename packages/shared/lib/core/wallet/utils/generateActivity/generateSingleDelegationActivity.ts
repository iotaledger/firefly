import { ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
import { DelegationActivity } from '@core/wallet/types'
import { getAmountFromOutput, getAsyncDataFromOutput, getSendingInformation } from './helper'
import { DelegationOutput } from '@iota/sdk/out/types'
import { AddressConverter } from '../AddressConverter'

export async function generateSingleDelegationActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters
): Promise<DelegationActivity> {
    const { transactionId, direction, time, claimingData, inclusionState, mana } = processedTransaction
    const output = wrappedOutput.output as DelegationOutput
    const outputId = wrappedOutput.outputId
    const id = outputId || transactionId
    const isHidden = false
    const isAssetHidden = false
    const containsValue = true
    const delegatedAmount = Number(output.delegatedAmount)
    const delegationId = output.delegationId
    const validatorAddress = AddressConverter.addressToBech32(output?.validatorAddress)
    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
    const storageDeposit = getAmountFromOutput(output)
    const giftedStorageDeposit = 0
    const startEpoch = output.startEpoch
    const accountAddress = AddressConverter.addressToBech32(output.unlockConditions[0]?.address)
    return {
        type: ActivityType.Delegation,
        id,
        outputId,
        transactionId,
        direction,
        action,
        isHidden,
        isAssetHidden,
        time,
        inclusionState,
        containsValue,
        mana,
        delegatedAmount,
        storageDeposit,
        giftedStorageDeposit,
        delegationId,
        validatorAddress,
        asyncData,
        accountAddress,
        startEpoch,
        ...sendingInfo,
    }
}
