import { IAccountState } from '@core/account'
import { localize } from '@core/i18n'
import { COIN_TYPE, networkHrp } from '@core/network'
import { activeProfile } from '@core/profile'
import { convertToFiat, formatCurrency } from '@lib/currency'
import { truncateString } from '@lib/helpers'
import {
    HOURS_PER_DAY,
    MILLISECONDS_PER_SECOND,
    MINUTES_PER_HOUR,
    SECONDS_PER_DAY,
    SECONDS_PER_MINUTE,
} from 'shared/lib/time'
import { get } from 'svelte/store'
import { ActivityAsyncStatus, ActivityDirection, ActivityType, InclusionState } from '../enums'
import { FoundryActivityData, IActivity, IProcessedTransaction, TransactionActivityData } from '../interfaces'
import { isActivityHiddenForAccountId } from '../stores/hidden-activities.store'
import { getPersistedAsset } from '../stores/persisted-assets.store'
import {
    formatTokenAmountBestMatch,
    getActivityType,
    getAmountFromOutput,
    getAssetFromPersistedAssets,
    getExpirationDateFromOutput,
    getMetadataFromOutput,
    getNativeTokenFromOutput,
    getRecipientFromOutput,
    getStorageDepositFromOutput,
    getTagFromOutput,
    isOutputAsync,
    isSubjectInternal,
    outputIdFromTransactionData,
} from '../utils'
import {
    getSenderFromTransaction,
    getSenderFromInputs,
    getMainTransactionOutputFromTransaction,
    getFoundryOutputFromTransaction,
} from '../utils/transactions'
import { IUTXOInput } from '@iota/types'

export class Activity implements IActivity {
    id: string
    transactionId: string
    type: ActivityType
    time: Date
    inclusionState: InclusionState
    rawAmount: number
    assetId: string
    inputs: IUTXOInput[]
    isHidden?: boolean
    isAssetHidden: boolean

    data: TransactionActivityData | FoundryActivityData

    constructor(processedTransaction: IProcessedTransaction, account: IAccountState) {
        const { outputs, transactionId, time, inclusionState, transactionInputs } = processedTransaction

        const type = getActivityType(outputs)

        this.type = type
        this.isHidden = false

        this.transactionId = transactionId
        this.inclusionState = inclusionState
        this.time = time
        this.inputs = transactionInputs

        this.id = transactionId

        if (type === ActivityType.Transaction) {
            this.data = getTransactionActivityData(processedTransaction, account)
        } else if (type === ActivityType.Foundry) {
            this.data = getFoundryActivityData(processedTransaction)
        }

        const asset = getPersistedAsset(this.data.assetId)
        this.isAssetHidden = !asset || asset.hidden
    }

    updateFromPartialActivity(partialActivity: Partial<IActivity>): void {
        Object.assign(this, partialActivity)
    }

    getAsyncStatus(time: Date): ActivityAsyncStatus {
        if (this.data.type === 'transaction' && this.data.isAsync) {
            if (this.data.isClaimed) {
                return ActivityAsyncStatus.Claimed
            } else {
                if (time > this.data.expirationDate) {
                    return ActivityAsyncStatus.Expired
                } else {
                    return ActivityAsyncStatus.Unclaimed
                }
            }
        }
        return null
    }

    getFormattedAmount(signed: boolean): string {
        const metadata = getAssetFromPersistedAssets(this?.assetId)?.metadata
        const amount = formatTokenAmountBestMatch(this.rawAmount, metadata, 2)
        if (this.data.type === 'transaction') {
            return `${this.data.direction !== ActivityDirection.In && signed ? '- ' : ''}${amount}`
        } else {
            return amount
        }
    }

    getFiatAmount(fiatPrice?: number, exchangeRate?: number): string {
        if (fiatPrice && exchangeRate) {
            const fiatValue = formatCurrency(convertToFiat(this.rawAmount, fiatPrice, exchangeRate))
            return fiatValue ? fiatValue : '-'
        } else {
            return '-'
        }
    }

    getTimeDiffUntilExpirationTime(time: Date): string {
        if (
            this.data.type === 'transaction' &&
            this.data.isAsync &&
            !this.data.isClaimed &&
            this.data?.expirationDate
        ) {
            const elapsedTime = this.data.expirationDate.getTime() - time.getTime()
            const days = Math.floor(elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY))
            const hours = Math.floor(
                (elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) % HOURS_PER_DAY
            )
            const minutes = Math.floor(
                (elapsedTime / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) % MINUTES_PER_HOUR
            )
            const seconds = Math.floor((elapsedTime / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE)

            if (days > 0 || hours > 0) {
                return `${days}d ${hours}h`
            } else if (minutes > 0) {
                return `${minutes}min`
            } else if (seconds > 0) {
                return '<1min'
            } else {
                return '-'
            }
        }
        return undefined
    }

    getTitle(): string {
        let title = ''
        if (this.data.type === 'transaction') {
            if (this.data.isInternal) {
                title = this.inclusionState === InclusionState.Confirmed ? 'general.transfer' : 'general.transferring'
            } else {
                if (this.data.direction === ActivityDirection.In) {
                    title = this.inclusionState === InclusionState.Confirmed ? 'general.received' : 'general.receiving'
                } else if (this.data.direction === ActivityDirection.Out) {
                    title = this.inclusionState === InclusionState.Confirmed ? 'general.sent' : 'general.sending'
                }
            }
        } else {
            title = this.inclusionState === InclusionState.Confirmed ? 'general.minted' : 'general.minting'
        }
        return title
    }

    getFormattedSubject(): string {
        if (this.data.type === 'transaction') {
            let subject = ''
            if (this.data.subject?.type === 'account') {
                subject = truncateString(this.data.subject?.account?.name, 13, 0)
            } else if (this.data.subject?.type === 'address') {
                subject = truncateString(this.data.subject?.address, get(networkHrp).length, 6)
            } else {
                subject = localize('general.unknownAddress')
            }
            return subject
        } else {
            return ''
        }
    }
}

function getTransactionActivityData(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): TransactionActivityData {
    const { outputs, transactionId, isIncoming, detailedTransactionInputs } = processedTransaction

    const { output, outputIndex, isSelfTransaction } = getMainTransactionOutputFromTransaction(
        outputs,
        account.depositAddress,
        isIncoming
    )
    const outputId = outputIdFromTransactionData(transactionId, outputIndex) // Only required for async transactions e.g. when claimed or to get the full output with `getOutput`

    const recipient = getRecipientFromOutput(output)
    const sender = detailedTransactionInputs
        ? getSenderFromInputs(detailedTransactionInputs)
        : getSenderFromTransaction(isIncoming, account.depositAddress, output)

    const subject = isIncoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.In : ActivityDirection.Out

    const isAsync = isOutputAsync(output)
    const asyncStatus = isAsync ? ActivityAsyncStatus.Unclaimed : null
    const isClaimed = false
    const isClaiming = false
    const claimingTransactionId = undefined
    const claimedDate = undefined

    const nativeToken = getNativeTokenFromOutput(output)

    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])
    const isRejected = isActivityHiddenForAccountId(account.id, transactionId)

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output)
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    const metadata = getMetadataFromOutput(output)
    const tag = getTagFromOutput(output)
    const expirationDate = getExpirationDateFromOutput(output)
    const publicNote = ''

    return {
        type: 'transaction',
        direction,
        outputId,
        isInternal,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
        sender,
        recipient,
        subject,
        isSelfTransaction,
        isAsync,
        asyncStatus,
        expirationDate,
        isRejected,
        isClaiming,
        isClaimed,
        publicNote,
        claimingTransactionId,
        claimedDate,
        metadata,
        tag,
        assetId,
    }
}

function getFoundryActivityData(processedTransaction: IProcessedTransaction): FoundryActivityData {
    const { outputs } = processedTransaction
    const { output } = getFoundryOutputFromTransaction(outputs)

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const { storageDeposit, giftedStorageDeposit } = getStorageDepositFromOutput(output) // probably we need to sum up all storage deposits
    const rawAmount = nativeToken ? Number(nativeToken?.amount) : getAmountFromOutput(output) - storageDeposit

    return {
        type: 'foundry',
        assetId,
        storageDeposit,
        giftedStorageDeposit,
        rawAmount,
    }
}
