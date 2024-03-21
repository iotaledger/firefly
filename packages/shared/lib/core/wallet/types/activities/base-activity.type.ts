import { OutputType, InclusionState } from '@iota/sdk/out/types'
import { ActivityAsyncStatus, ActivityDirection, ActivityAction, ActivityType, SubjectType } from '../../enums'
import { IWalletState, IWrappedOutput, ProcessedTransaction } from '../../interfaces'
import { Subject } from '../subject.type'
import { Layer2Metadata, getLayer2NetworkFromAddress } from '@core/layer-2'
import { isParticipationOutput } from '@contexts/governance'
import { getActivityTypeFromOutput } from '../../utils'
import * as Activities from './'
import { localize } from '@core/i18n'
import { truncateString } from '@core/utils'
import { getSelectedWallet, isActivityHiddenForWalletId, removeActivityFromHiddenActivities } from '../../stores'
import { handleError } from '@core/error/handlers'

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
    Unclaimed = 'Unclaimed',
    Claimed = 'Claimed',
    Expired = 'Expired',
    TimeLocked = 'TimeLocked',
}

export interface ActivityBaseOptions {
    id: string
    inclusionState: InclusionState
    specialStatus: SpecialStatus
    time: Date // Should this be number, slot index?
    //from: string[]
    //to: string[]

    isHidden: boolean
    action: ActivityAction
    direction: ActivityDirection
    isInternal?: boolean

    outputId: string
    transactionId: string
    containsValue: boolean
    isAssetHidden: boolean // TODO: Is `isAssetHidden` even used?
    storageDeposit: number
    giftedStorageDeposit: number
    surplus?: number
    subject: Subject | undefined
    metadata?: string
    tag?: string
    asyncData?: AsyncData
    destinationNetwork?: string
    parsedLayer2Metadata?: Partial<Layer2Metadata> | null
}

export abstract class ActivityBase  {
    constructor(private options: ActivityBaseOptions) {}

    abstract type(): ActivityType;

    isIncoming(): boolean {
        return [ActivityDirection.Incoming, ActivityDirection.SelfTransaction].includes(this.direction())
    }

    subject(): Subject | undefined {
        const subject = this.options.subject;
        if (this.parsedLayer2Metadata() && subject) {
            return {
                ...subject,
                ...(subject?.type === SubjectType.Address && {
                    address: this.parsedLayer2Metadata()?.ethereumAddress,
                }),
            }
        } else if (subject?.type === SubjectType.Address) {
            const network = getLayer2NetworkFromAddress(subject.address)
            return { ...subject, address: network ?? subject.address }
        } else {
            return subject
        }
    }

    subjectLocale(): string {
        const subject = this.subject();

         if (subject?.type === SubjectType.Wallet) {
            return truncateString(subject?.wallet?.name, 13, 0)
        } else if (subject?.type === SubjectType.Address) {
            const address = this.parsedLayer2Metadata()?.ethereumAddress ?? subject?.address
            const network = getLayer2NetworkFromAddress(address)

            return network ?? truncateString(address, 6, 6)
        } else {
            return localize('general.unknownAddress')
        }
    }

    id() {
        return this.options.id
    }

    inclusionState() {
        return this.options.inclusionState
    }

    specialStatus() {
        return this.options.specialStatus
    }

    time() {
        return this.options.time
    }

    isHidden() {
        return this.options.isHidden
    }

    action() {
        return this.options.action
    }

    direction() {
        return this.options.direction
    }

    isInternal(): boolean {
        return this.options.isInternal ?? false
    }

    outputId() {
        return this.options.outputId
    }

    transactionId() {
        return this.options.transactionId
    }

    containsValue() {
        return this.options.containsValue
    }

    isAssetHidden() {
        return this.options.isAssetHidden
    }

    storageDeposit() {
        return this.options.storageDeposit
    }

    giftedStorageDeposit() {
        return this.options.giftedStorageDeposit
    }

    surplus() {
        return this.options.surplus
    }

    metadata() {
        return this.options.metadata
    }

    tag() {
        return this.options.tag
    }

    asyncData(): AsyncData {
        return this.options.asyncData as AsyncData
    }

    destinationNetwork() {
        return this.options.destinationNetwork
    }

    parsedLayer2Metadata() {
        return this.options.parsedLayer2Metadata
    }

    tileTitle(): string {
        const isConfirmed = this.inclusionState() === InclusionState.Confirmed
        if (this.action() === ActivityAction.Burn) {
            return isConfirmed ? 'general.burned' : 'general.burning'
        } else if (this.action() === ActivityAction.Send) {
            if (this.isInternal()) {
                return isConfirmed ? 'general.transfer' : 'general.transferring'
            }
            if (
                this.direction() === ActivityDirection.Incoming ||
                this.direction() === ActivityDirection.SelfTransaction
            ) {
                return isConfirmed ? 'general.received' : 'general.receiving'
            }
            if (this.direction() === ActivityDirection.Outgoing) {
                return isConfirmed ? 'general.sent' : 'general.sending'
            }
        } else {
            return 'general.unknown'
        }

        return ''
    }

    async claim(): Promise<void> {
        const wallet = getSelectedWallet()
        try {
            if (isActivityHiddenForWalletId(wallet.id, this.id())) {
                removeActivityFromHiddenActivities(wallet.id, this.id())
                if(this.options.asyncData){
                    this.options.asyncData.isRejected = false;
                }
            }

            if(this.options.asyncData){
                this.options.asyncData.isClaiming = true;
            }

            const result = await wallet.claimOutputs([this.outputId()])
            const transactionId = result.transactionId

            if(this.options.asyncData){
                this.options.asyncData.claimingTransactionId = transactionId 
            }
        } catch (err) {
            handleError(err)
            if(this.options.asyncData){
                this.options.asyncData.isClaiming = false;
            }
        }
    }

    /**
     * Generate a group of activies given a processed transaction
     * @returns ActivityBase[]
     */
    static generateActivitiesFromProcessedTransaction(
        wallet: IWalletState,
        processedTransaction: ProcessedTransaction
    ): Promise<Array<ActivityBase>> {
        if (processedTransaction.transactionInputs?.length > 0) {
            return this.generateActivitiesFromProcessedTransactionsWithInputs(wallet, processedTransaction)
        } else {
            return this.generateActivitiesFromProcessedTransactionsWithoutInputs(wallet, processedTransaction)
        }
    }

    static async generateActivitiesFromProcessedTransactionsWithInputs(
        wallet: IWalletState,
        processedTransaction: ProcessedTransaction
    ): Promise<Array<ActivityBase>> {
        let activities: Array<ActivityBase> = []

        const { transactionInputs: wrappedInputs, outputs } = processedTransaction

        const containsFoundryActivity = outputs.some((output) => output.output.type === OutputType.Foundry)
        if (containsFoundryActivity) {
            const foundryActivities = await Activities.ActivityFoundry.fromOutputs(processedTransaction, wallet)
            activities.push(...foundryActivities)
        }

        const containsNftActivity = outputs.some((output) => output.output.type === OutputType.Nft)
        if (containsNftActivity) {
            const nftActivities = await Activities.ActivityNft.fromOutputs(processedTransaction, wallet)
            activities.push(...nftActivities)
        }

        const containsAccountActivity =
            outputs.some((output) => output.output.type === OutputType.Account) && !containsFoundryActivity
        if (containsAccountActivity) {
            const accountActivities = await Activities.ActivityAccount.fromOutputs(processedTransaction, wallet)
            activities.push(...accountActivities)
        }

        const hasParticipationInputs = wrappedInputs?.some((input) => isParticipationOutput(input.output))
        const governanceOutput = hasParticipationInputs
            ? outputs[0]
            : outputs.find((output) => isParticipationOutput(output.output))
        if (governanceOutput) {
            const governanceActivity = await Activities.ActivityGovernance.fromProcessedTransaction(wallet, {
                processedTransaction,
                wrappedOutput: governanceOutput,
                action: ActivityAction.Unknown, // TODO: Maybe this should be optional?
            })
            activities.push(governanceActivity)
        }

        const containsAnchorActivity = outputs.some((output) => output.output.type === OutputType.Anchor)
        if (containsAnchorActivity) {
            const anchorActivities = await Activities.ActivityAnchor.fromOutputs(processedTransaction, wallet)
            activities.push(...anchorActivities)
        }

        if (!containsFoundryActivity && !containsNftActivity && !containsAccountActivity && !governanceOutput) {
            const basicActivities = await Activities.ActivityTransaction.fromOutputs(processedTransaction, wallet)
            activities.push(...basicActivities)
        }

        return activities
    }

    static async generateActivitiesFromProcessedTransactionsWithoutInputs(
        wallet: IWalletState,
        processedTransaction: ProcessedTransaction
    ): Promise<Array<ActivityBase>> {
        const nonRemainderOutputs = processedTransaction.outputs.filter((wrappedOutput) => !wrappedOutput.remainder)
        const activities = await Promise.all(
            nonRemainderOutputs.map(async (wrappedOutput) => {
                const params = {
                    action: ActivityAction.Unknown,
                    processedTransaction,
                    wrappedOutput,
                }
                const activityType = getActivityTypeFromOutput(wrappedOutput)
                switch (activityType) {
                    case ActivityType.Transaction:
                        return Activities.ActivityTransaction.fromProcessedTransaction(wallet, params)
                    case ActivityType.Governance:
                        return Activities.ActivityGovernance.fromProcessedTransaction(wallet, params)
                    case ActivityType.Foundry:
                        return Activities.ActivityFoundry.fromProcessedTransaction(wallet, params)
                    case ActivityType.Account:
                        return Activities.ActivityAccount.fromProcessedTransaction(wallet, params)
                    case ActivityType.Nft:
                        return Activities.ActivityNft.fromProcessedTransaction(wallet, params)
                    case ActivityType.Vesting:
                        return Activities.ActivityVesting.fromProcessedTransaction(wallet, params)
                    case ActivityType.Anchor:
                        return Activities.ActivityAnchor.fromProcessedTransaction(wallet, params)
                    default:
                        throw new Error(`Unknown activity type: ${activityType}`)
                }
            })
        )
        return activities
    }

    static isConsolidation(output: IWrappedOutput, processedTransaction: ProcessedTransaction): boolean {
        const allBasicInputs = processedTransaction.wrappedInputs.every(
            (input) => input.output.type === OutputType.Basic
        )
        const isSelfTransaction = processedTransaction.direction === ActivityDirection.SelfTransaction
        const isSameAmount =
            processedTransaction.wrappedInputs.reduce((sum, input) => sum + Number(input.output.amount), 0) ===
            Number(output.output.amount)

        return allBasicInputs && isSelfTransaction && isSameAmount
    }
}
