import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import { updateActivityByTransactionId } from '@core/wallet/stores/all-account-activities.store'

import { ITransactionInclusionEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionInclusionEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventInternal(accountIndex, payload as ITransactionInclusionEventPayload)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: ITransactionInclusionEventPayload
): void {
    updateActivityByTransactionId(accountIndex.toString(), payload.transactionId, {
        inclusionState: payload.inclusionState,
    })
    updateClaimingTransactionInclusion(payload.transactionId, payload.inclusionState, accountIndex.toString())
}
