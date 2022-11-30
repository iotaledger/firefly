import { updateNftInAllAccountNfts } from '@core/nfts'
import { ActivityDirection, ActivityType } from '@core/wallet'
import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import {
    updateActivityByTransactionId,
    getActivityByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'

import { WalletApiEvent } from '../../enums'
import { ITransactionInclusionEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionInclusionEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.TransactionInclusion)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventInternal(accountIndex, payload as ITransactionInclusionEventPayload)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: ITransactionInclusionEventPayload
): void {
    updateActivityByTransactionId(accountIndex, payload.transactionId, {
        inclusionState: payload.inclusionState,
    })

    const activity = getActivityByTransactionId(accountIndex, payload.transactionId)

    if (activity.type === ActivityType.Nft) {
        const isSpendable = activity.direction === ActivityDirection.Incoming || activity.isSelfTransaction
        updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable })
    }

    updateClaimingTransactionInclusion(payload.transactionId, payload.inclusionState, accountIndex)
}
