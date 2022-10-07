import { get } from 'svelte/store'

import { syncBalance } from '@core/account/actions/syncBalance'
import {
    allAccountActivities,
    updateActivityDataByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'
import { ActivityAsyncStatus, ActivityType } from '@core/wallet'

import { WalletApiEvent } from '../../enums'
import { ISpentOutputEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export async function handleSpentOutputEvent(error: Error, rawEvent: string): Promise<void> {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.SpentOutput)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    await handleSpentOutputEventInternal(accountIndex, payload as ISpentOutputEventPayload)
}

export async function handleSpentOutputEventInternal(
    accountIndex: number,
    payload: ISpentOutputEventPayload
): Promise<void> {
    await syncBalance(accountIndex)
    const outputId = payload?.output?.outputId
    const activity = get(allAccountActivities)?.[accountIndex]?.find(
        (_activity) =>
            _activity.data.type === ActivityType.Transaction &&
            _activity.data.asyncStatus === ActivityAsyncStatus.Unclaimed &&
            _activity.data.outputId === outputId
    )

    if (activity) {
        const transactionId = payload?.output?.metadata?.transactionId
        updateActivityDataByTransactionId(accountIndex, transactionId, {
            type: ActivityType.Transaction,
            isClaimed: true,
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }
}
