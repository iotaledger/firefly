import { NftOutput, OutputType } from '@iota/sdk/out/types'
import { ActivityAsyncStatus, ActivityDirection, InclusionState, ActivityAction } from '../../enums'
import { IProcessedTransaction, IWalletState, ProcessedTransaction } from '../../interfaces'
import { Subject } from '../subject.type'
import { Layer2Metadata } from '@core/layer-2'
import { isParticipationOutput } from 'shared/lib/contexts/governance'
import { getNftId, getNonRemainderBasicOutputsFromTransaction } from '../../utils'
import { ActivityNft } from './nft-activity.type'
import { addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from 'shared/lib/core/nfts' // TODO: Fix imports
import { generateSingleBasicActivity } from '../../utils/generateActivity/generateSingleBasicActivity'
import { isConsolidation } from '../../utils/generateActivity/generateActivitiesFromBasicOutputs'
import { AcitivitySend } from './send-activity.class'

export type BaseActivity = {
    id: string
    outputId: string
    transactionId: string
    time: Date
    inclusionState: InclusionState
    isHidden?: boolean
    containsValue: boolean
    isAssetHidden: boolean
    direction: ActivityDirection
    action: ActivityAction
    isInternal: boolean
    storageDeposit: number
    giftedStorageDeposit: number
    surplus?: number
    subject: Subject | undefined
    metadata?: string
    tag?: string
    asyncData: AsyncData
    destinationNetwork?: string
    parsedLayer2Metadata?: Partial<Layer2Metadata>
}

export type AsyncData = {
    asyncStatus: ActivityAsyncStatus
    timelockDate: Date
    expirationDate: Date
    isRejected: boolean
    isClaiming: boolean
    claimingTransactionId: string
    claimedDate: Date
}

export enum SpecialStatus {
    Unclaimed = "Unclaimed",
    Claimed = "Claimed",
    Expired = "Expired",
    TimeLocked = "TimeLocked"
}

export class ActivityBase {
    constructor(
        id: string,
        inclusionState: InclusionState,
        specialStatus: SpecialStatus,
        time: number,
        from: string[],
        to: string[],

    ) { }

    /**
     * Generate a group of activies given a processed transaction
     * @returns 
     */
    static async generateActiviesFromProcessedTransaction(wallet: IWalletState, processedTransaction: ProcessedTransaction): Promise<Array<ActivityBase>> {
        let activities: Array<ActivityBase> = []

        const { wrappedInputs, outputs, direction } = processedTransaction;

        if (wrappedInputs?.length > 0) {

            const containsFoundryActivity = outputs.some((output) => output.output.type === OutputType.Foundry)
            if (containsFoundryActivity) {
                // const foundryActivities = await generateActivitiesFromFoundryOutputs(processedTransaction, wallet)
                // activities.push(...foundryActivities)
            }

            const containsNftActivity = outputs.some((output) => output.output.type === OutputType.Nft)
            if (containsNftActivity) {
                // const nftActivities = await generateActivitiesFromNftOutputs(processedTransaction, wallet)
                // activities.push(...nftActivities)
            }

            const containsAccountActivity =
                outputs.some((output) => output.output.type === OutputType.Account) && !containsFoundryActivity
            if (containsAccountActivity) {
                // const accountActivities = await generateActivitiesFromAccountOutputs(processedTransaction, wallet)
                // activities.push(...accountActivities)
            }

            const hasParticipationInputs = wrappedInputs?.some((input) => isParticipationOutput(input.output))
            const governanceOutput = hasParticipationInputs
                ? outputs[0]
                : outputs.find((output) => isParticipationOutput(output.output))
            if (governanceOutput) {
                // const governanceActivity = await generateSingleGovernanceActivity(wallet, {
                //     processedTransaction,
                //     wrappedOutput: governanceOutput,
                //     action: null,
                // })
                // activities.push(governanceActivity)
            }

            const containsAnchorActivity = outputs.some((output) => output.output.type === OutputType.Anchor)
            if (containsAnchorActivity) {
                // const anchorActivities = await generateActivitiesFromAnchorOutputs(processedTransaction, wallet)
                // activities.push(...anchorActivities)
            }
            if (!containsFoundryActivity && !containsNftActivity && !containsAccountActivity && !governanceOutput) {

                const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
                    outputs,
                    wallet.depositAddress,
                    direction
                )
                const burnedNftInputs = processedTransaction.getBurnedNftInputs();
                for (const basicOutput of basicOutputs) {
                    let activity: ActivityBase

                    const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
                    const burnedNftInputIndex = burnedNftInputs.findIndex(
                        (input) => input.output.amount === basicOutput.output.amount
                    )
                    const burnedNativeToken = burnedNftInputIndex < 0 ? processedTransaction.getBurnedNativeTokens() : undefined

                    // NFT Activity
                    if (isSelfTransaction && burnedNftInputIndex >= 0) {
                        const wrappedInput = burnedNftInputs[burnedNftInputIndex]
                        const nftInput = wrappedInput.output as NftOutput
                        
                        activity = await ActivityNft.fromProcessedTransaction(
                            wallet,
                            {
                                action: ActivityAction.Burn,
                                processedTransaction,
                                wrappedOutput: basicOutput,
                            },
                            getNftId(nftInput.nftId, wrappedInput.outputId)
                        )
                        const nft = buildNftFromNftOutput(wrappedInput, wallet.depositAddress, false)
                        addOrUpdateNftInAllWalletNfts(wallet.id, nft)

                        burnedNftInputs.splice(burnedNftInputIndex, 1)
                    }
                    // Burn Activity
                    // else if (isSelfTransaction && burnedNativeToken) {
                    //     activity = await generateSingleBasicActivity(
                    //         wallet,
                    //         {
                    //             action: ActivityAction.Burn,
                    //             processedTransaction,
                    //             wrappedOutput: basicOutput,
                    //         },
                    //         burnedNativeToken.assetId,
                    //         burnedNativeToken.amount
                    //     )
                    // } 
                    // Consolidation Activity
                    // else if (isSelfTransaction && isConsolidation(basicOutput, processedTransaction)) {
                    //     activity = await generateSingleConsolidationActivity(wallet, {
                    //         action: ActivityAction.Send,
                    //         processedTransaction,
                    //         wrappedOutput: basicOutput,
                    //     })
                    // } 
                    // Send Activity
                    else {
                        activity = await AcitivitySend.fromProcessedTransaction(wallet, {
                            action: ActivityAction.Send,
                            processedTransaction,
                            wrappedOutput: basicOutput,
                        })
                    }
                    activities.push(activity)
                }
            } else {

            }

        }
        return activities
    }
}