import { NftOutput, OutputType, InclusionState } from '@iota/sdk/out/types'
import { ActivityAsyncStatus, ActivityDirection, ActivityAction, ActivityType } from '../../enums'
import { IProcessedTransaction, IWalletState, IWrappedOutput, ProcessedTransaction } from '../../interfaces'
import { Subject } from '../subject.type'
import { Layer2Metadata } from '@core/layer-2'
import { isParticipationOutput } from '@contexts/governance'
import { getActivityTypeFromOutput, getNftId, getNonRemainderBasicOutputsFromTransaction } from '../../utils'
import { ActivityNft } from './nft-activity.type'
import { addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts' // TODO: Fix imports
import { ActivityBasic } from './basic-activity.class'
import { ActivityConsolidation } from './consolidation-activity.type'
import { ActivityAccount } from './account-activity.type'

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

// TODO: Move somewhere else.
export enum SpecialStatus {
    Unclaimed = "Unclaimed",
    Claimed = "Claimed",
    Expired = "Expired",
    TimeLocked = "TimeLocked"
}

export interface ActivityBaseOptions {
    id: string,
    inclusionState: InclusionState,
    specialStatus: SpecialStatus,
    time: Date, // Should this be number, slot index?
    from: string[],
    to: string[],
}

export class ActivityBase {
    constructor(options: ActivityBaseOptions) { }

    id(){
        return this.id
    }
    
    inclusionState(){
        return this.inclusionState
    }

    /**
     * Generate a group of activies given a processed transaction
     * @returns ActivityBase[]
     */
    static generateActivitiesFromProcessedTransaction(wallet: IWalletState, processedTransaction: ProcessedTransaction): Promise<Array<ActivityBase>> {
        if (processedTransaction.wrappedInputs?.length > 0) {
            return this.generateActivitiesFromProcessedTransactionsWithInputs(wallet, processedTransaction)
        } else {
            return this.generateActivitiesFromProcessedTransactionsWithoutInputs(wallet, processedTransaction)
        }
    }

    static async generateActivitiesFromProcessedTransactionsWithInputs(wallet: IWalletState, processedTransaction: ProcessedTransaction): Promise<Array<ActivityBase>> {
        let activities: Array<ActivityBase> = []

        const { wrappedInputs, outputs, direction } = processedTransaction;

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
                else if (isSelfTransaction && burnedNativeToken) {
                    activity = await ActivityBasic.fromProcessedTransaction(wallet, {
                        action: ActivityAction.Burn,
                        processedTransaction,
                        wrappedOutput: basicOutput,
                    })
                } 
                // Consolidation Activity
                else if (isSelfTransaction && ActivityBase.isConsolidation(basicOutput, processedTransaction)) {
                    activity = await ActivityConsolidation.fromProcessedTransaction(wallet, {
                        action: ActivityAction.Send,
                        processedTransaction,
                        wrappedOutput: basicOutput,
                    })
                } 
                // Send Activity
                else {
                    activity = await ActivityBasic.fromProcessedTransaction(wallet, {
                        action: ActivityAction.Send,
                        processedTransaction,
                        wrappedOutput: basicOutput,
                    })
                }
                activities.push(activity)
            }
        } else {

        }
        return activities
    }

    static async generateActivitiesFromProcessedTransactionsWithoutInputs(wallet: IWalletState, processedTransaction: ProcessedTransaction): Promise<Array<ActivityBase>> {
        const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
        const activities = await Promise.all(
            nonRemainderOutputs.map(async (wrappedOutput) => {
                const params = {
                    type: getActivityTypeFromOutput(wrappedOutput),
                    action: ActivityAction.Unknown,
                    processedTransaction,
                    wrappedOutput,
                }
                switch (params.type) {
                    case ActivityType.Basic:
                        return ActivityBasic.fromProcessedTransaction(wallet, params)
                    case ActivityType.Governance:
                    //    return generateSingleGovernanceActivity(wallet, params)
                    case ActivityType.Foundry:
                    //    return generateSingleFoundryActivity(wallet, params)
                    case ActivityType.Account:
                        return ActivityAccount.fromProcessedTransaction(wallet, params)
                    case ActivityType.Nft:
                        return ActivityNft.fromProcessedTransaction(wallet, params)
                    case ActivityType.Vesting:
                    //    return generateVestingActivity(wallet, params)
                    case ActivityType.Anchor:
                    //    return generateSingleAnchorActivity(wallet, params)
                    default:
                        throw new Error(`Unknown activity type: ${params.type}`)
                }
            })
        )
        return activities
    }

    static isConsolidation(output: IWrappedOutput, processedTransaction: IProcessedTransaction): boolean {
        const allBasicInputs = processedTransaction.wrappedInputs.every((input) => input.output.type === OutputType.Basic)
        const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
        const isSameAmount =
            processedTransaction.wrappedInputs.reduce((sum, input) => sum + Number(input.output.amount), 0) ===
            Number(output.output.amount)
    
        return allBasicInputs && isSelfTransaction && isSameAmount
    
    }
}