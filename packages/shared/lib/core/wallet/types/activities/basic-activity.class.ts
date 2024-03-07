import { BasicOutput } from "@iota/sdk/out/types";
import { ActivityAction } from "../../enums";
import { IActivityGenerationParameters, IWalletState } from "../../interfaces";
import { activityOutputContainsValue, getAmountFromOutput, getAsyncDataFromOutput, getLayer2ActivityInformation, getMetadataFromOutput, getNativeTokenFromOutput, getSendingInformation, getStorageDepositFromOutput, getTagFromOutput } from "../../utils";
import { ActivityBase, ActivityBaseOptions, SpecialStatus } from "./base-activity.type";
import { isShimmerClaimingTransaction } from "@contexts/onboarding";
import { activeProfileId, getCoinType } from "@core/profile";
import { get } from "svelte/store";

interface ActivityBasicOptions extends ActivityBaseOptions {
    
}

export class ActivityBasic extends ActivityBase {
    constructor(options: ActivityBasicOptions) {
        super(options)
    }

    static async fromProcessedTransaction(wallet: IWalletState, 
        { action, processedTransaction, wrappedOutput }: IActivityGenerationParameters,
        fallbackAssetId?: string,
        fallbackAmount?: number): Promise<ActivityBasic> {
        const { transactionId, direction, claimingData, time, inclusionState } = processedTransaction

        const specialStatus = SpecialStatus.Unclaimed // TODO: Fix this
        const isHidden = false
        const isAssetHidden = false
        const containsValue = await activityOutputContainsValue(wallet, wrappedOutput)

        const outputId = wrappedOutput.outputId
        const id = outputId || transactionId

        const output = wrappedOutput.output as BasicOutput
        const amount = getAmountFromOutput(output)

        const isShimmerClaiming = isShimmerClaimingTransaction(transactionId, get(activeProfileId))

        const tag = getTagFromOutput(output)
        const metadata = getMetadataFromOutput(output)
        const publicNote = ''

        const sendingInfo = getSendingInformation(processedTransaction, output, wallet)
        const asyncData = await getAsyncDataFromOutput(output, outputId, claimingData, wallet)

        const { parsedLayer2Metadata, destinationNetwork } = getLayer2ActivityInformation(metadata, sendingInfo)
        const layer2Allowance = Number(parsedLayer2Metadata?.baseTokens ?? '0')
        const gasBudget = Number(parsedLayer2Metadata?.gasBudget ?? '0')
        const gasFee = layer2Allowance > 0 ? amount - layer2Allowance : 0

        let { storageDeposit, giftedStorageDeposit } = await getStorageDepositFromOutput(output)
        giftedStorageDeposit = action === ActivityAction.Burn ? 0 : giftedStorageDeposit
        giftedStorageDeposit = gasBudget === 0 ? giftedStorageDeposit : 0

        const baseTokenAmount = amount - storageDeposit - gasFee

        const nativeToken = getNativeTokenFromOutput(output)
        const assetId = fallbackAssetId ?? nativeToken?.id ?? getCoinType()

        let surplus: number | undefined = undefined
        if (nativeToken) {
            const storageDepositToDeduct = (storageDeposit > 0 ? storageDeposit : giftedStorageDeposit) ?? 0
            surplus = Number(output.amount) - storageDepositToDeduct
        }

        let rawAmount: number
        if (fallbackAmount === undefined) {
            rawAmount = nativeToken ? Number(nativeToken?.amount) : baseTokenAmount
        } else {
            rawAmount = fallbackAmount
        }

        // Note: we update the displayed storage deposit so it matches what was displayed in the send confirmation flow
        // set the storage deposit to zero if the amount is greater than the storage deposit
        // to improve the UX so the user doesnt think they need to pay the storage deposit
        if (!nativeToken && !storageDeposit && rawAmount >= giftedStorageDeposit) {
            storageDeposit = giftedStorageDeposit = 0
        }

        return new ActivityBasic({
            //type: ActivityType.Basic,
            //isHidden,
            id,
            inclusionState,
            specialStatus,
            time,
            to,
            from,
            //transactionId,
            // time,
            // direction,
            // action,
            // isAssetHidden,
            // inclusionState,
            // containsValue,
            // outputId,
            // storageDeposit,
            // giftedStorageDeposit,
            // surplus,
            // rawAmount,
            // isShimmerClaiming,
            // publicNote,
            // metadata,
            // tag,
            // assetId,
            // asyncData,
            // destinationNetwork,
            // parsedLayer2Metadata,

        })
    }
}