import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import { updateActivityByTransactionId } from '@core/wallet/stores/all-account-activities.store'

import { validateWalletApiEvent } from '../../helpers'
import { ITransactionInclusionEvent } from '../../interfaces'

export function handleTransactionInclusionEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventInternal(accountIndex, payload as ITransactionInclusionEvent)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: ITransactionInclusionEvent
): void {
    updateActivityByTransactionId(accountIndex.toString(), payload.transactionId, {
        inclusionState: payload.inclusionState,
    })
    updateClaimingTransactionInclusion(payload.transactionId, payload.inclusionState, accountIndex.toString())
}
