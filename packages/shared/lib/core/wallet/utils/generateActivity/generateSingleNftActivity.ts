import { handleError } from '@core/error/handlers'
import { ActivityAction, ActivityType } from '@core/wallet/enums'
import { IActivityGenerationParameters, IWalletState } from '@core/wallet/interfaces'
import { NftActivity } from '@core/wallet/types'
import { getNftId } from '../outputs/getNftId'
import {
    getAsyncDataFromOutput,
    getLayer2ActivityInformation,
    getMetadataFromOutput,
    getSendingInformation,
    getStorageDepositFromOutput,
    getTagFromOutput,
} from './helper'
import { AddressUnlockCondition, NftOutput, UnlockConditionType } from '@iota/sdk/out/types'
import { getClient } from '../../actions/getClient'
import { AddressConverter } from '../AddressConverter'

export async function generateSingleNftActivity(
    wallet: IWalletState,
    { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
    nftIdFromInput?: string
): Promise<NftActivity> {
    const { claimingData, time, inclusionState, transactionId, direction, mana } = processedTransaction
    const outputId = wrappedOutput.outputId
    const output = wrappedOutput.output as NftOutput
    const id = outputId || transactionId

    const isHidden = false
    const isAssetHidden = false
    const containsValue = true

    const nftId = nftIdFromInput ? nftIdFromInput : getNftId(output.nftId, outputId)
    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)

    const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
    const { subject, isInternal } = sendingInfo

    const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)
    const gasBudget = Number(parsedLayer2Metadata?.gasBudget ?? '0')

    const storageDepositData = await getStorageDepositFromOutput(output)
    const { storageDeposit } = storageDepositData
    let { giftedStorageDeposit } = storageDepositData
    giftedStorageDeposit = action === ActivityAction.Burn ? 0 : giftedStorageDeposit
    giftedStorageDeposit = gasBudget === 0 ? giftedStorageDeposit : 0

    let surplus: number | undefined = undefined
    try {
        const client = await getClient()
        const minimumRequiredStorageDeposit = await client.computeMinimumOutputAmount(output)
        surplus = Number(output.amount) - Number(minimumRequiredStorageDeposit)
        if (surplus && !storageDeposit) {
            giftedStorageDeposit = Number(minimumRequiredStorageDeposit)
        }
    } catch (err) {
        handleError(err)
    }

    const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)
    const addressUnlockCondition = output.unlockConditions.find(
        (uc) => uc.type === UnlockConditionType.Address
    ) as AddressUnlockCondition
    const accountAddress = AddressConverter.addressToBech32(addressUnlockCondition.address)

    return {
        type: ActivityType.Nft,
        id,
        transactionId,
        outputId,
        nftId,
        time,
        isHidden,
        action,
        giftedStorageDeposit,
        surplus,
        isAssetHidden,
        containsValue,
        inclusionState,
        storageDeposit,
        metadata,
        tag,
        asyncData,
        subject,
        isInternal,
        direction,
        destinationNetwork,
        parsedLayer2Metadata,
        accountAddress,
        mana,
    }
}
